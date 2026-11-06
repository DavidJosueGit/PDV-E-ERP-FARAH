import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Users,
  CheckCircle2,
  X,
  AlertCircle,
  Plus,
  Trash2,
  Cpu,
  Loader2,
  Receipt,
  UtensilsCrossed
} from 'lucide-react';
import { PaymentMethod, PaymentItem, Customer, CartItem, Sale, Invoice } from '../../types';
import { StorageService } from '../../services/storage';
import { TefPaymentService } from '../../services/fiscalAndTef';

interface PaymentModalProps {
  cart: CartItem[];
  subtotal: number;
  discountTotal: number;
  additionTotal: number;
  total: number;
  onClose: () => void;
  onComplete: (sale: Sale, invoice: Invoice) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  cart,
  subtotal,
  discountTotal,
  additionTotal,
  total,
  onClose,
  onComplete,
}) => {
  const customers = StorageService.getCustomers();
  const activeCash = StorageService.getActiveCashRegister();
  const currentUser = StorageService.getCurrentUser();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('DINHEIRO');
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [cashReceived, setCashReceived] = useState<number>(total);
  const [installments, setInstallments] = useState<number>(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customCpfCnpj, setCustomCpfCnpj] = useState<string>('');
  
  // TEF process state
  const [isProcessingTef, setIsProcessingTef] = useState<boolean>(false);
  const [tefTerminal, setTefTerminal] = useState<'STONE_TEF' | 'CIELO' | 'MERCADO_PAGO'>('STONE_TEF');
  const [tefMessage, setTefMessage] = useState<string>('');
  
  // Pix QR Code state
  const [pixGenerated, setPixGenerated] = useState<boolean>(false);
  const [pixCountdown, setPixCountdown] = useState<number>(3);
  const [isProcessingPix, setIsProcessingPix] = useState<boolean>(false);

  // Totais parciais de pagamento
  const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = Math.max(0, total - totalPaid);
  const change = selectedMethod === 'DINHEIRO' && cashReceived > remaining ? cashReceived - remaining : 0;

  // Adicionar pagamento à lista (suporta pagamento múltiplo/dividido)
  const handleAddPayment = async () => {
    if (remaining <= 0) return;

    if (selectedMethod === 'DINHEIRO') {
      const amountToAdd = Math.min(cashReceived, remaining);
      const newPayment: PaymentItem = {
        id: 'pay-' + Date.now(),
        method: 'DINHEIRO',
        amount: amountToAdd,
        change: cashReceived > amountToAdd ? cashReceived - amountToAdd : 0,
      };
      setPayments([...payments, newPayment]);
      setCashReceived(Math.max(0, remaining - amountToAdd));
    } else if (selectedMethod === 'CARTAO_CREDITO' || selectedMethod === 'CARTAO_DEBITO') {
      // Processar TEF
      setIsProcessingTef(true);
      setTefMessage('Insira, aproxime ou passe o cartão no PINPAD...');
      try {
        const tefResult = await TefPaymentService.processCardPayment(
          selectedMethod,
          remaining,
          installments,
          tefTerminal
        );
        const newPayment: PaymentItem = {
          id: 'pay-' + Date.now(),
          method: selectedMethod,
          amount: remaining,
          installments: selectedMethod === 'CARTAO_CREDITO' ? installments : 1,
          tefNsu: tefResult.nsu,
          tefAuthCode: tefResult.authorizationCode,
          tefAcquirer: tefResult.acquirer,
        };
        setPayments([...payments, newPayment]);
      } catch (e: any) {
        alert('Falha na comunicação TEF: ' + e.message);
      } finally {
        setIsProcessingTef(false);
        setTefMessage('');
      }
    } else if (selectedMethod === 'PIX') {
      setIsProcessingPix(true);
      setPixGenerated(true);
      setPixCountdown(3);
      
      const interval = setInterval(() => {
        setPixCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsProcessingPix(false);
            const newPayment: PaymentItem = {
              id: 'pay-' + Date.now(),
              method: 'PIX',
              amount: remaining,
              tefAuthCode: 'PIX-' + Math.floor(10000000 + Math.random() * 90000000),
            };
            setPayments((curr) => [...curr, newPayment]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (selectedMethod === 'CREDIARIO') {
      if (!selectedCustomerId) {
        alert('Selecione um cliente cadastrado para registrar no crediário da casa!');
        return;
      }
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (customer && (customer.creditLimit - customer.creditUsed) < remaining) {
        alert(`Limite de crédito insuficiente! Disponível: R$ ${(customer.creditLimit - customer.creditUsed).toFixed(2)}`);
        return;
      }
      const newPayment: PaymentItem = {
        id: 'pay-' + Date.now(),
        method: 'CREDIARIO',
        amount: remaining,
      };
      setPayments([...payments, newPayment]);
    }
  };

  const handleRemovePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  // Finalizar a venda
  const handleFinalizeSale = () => {
    if (!activeCash) {
      alert('Caixa fechado! Abra o caixa antes de realizar vendas.');
      return;
    }

    if (totalPaid < total) {
      alert(`Valor pendente de pagamento: R$ ${(total - totalPaid).toFixed(2)}`);
      return;
    }

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    const saleItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      barcode: item.product.barcode,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total,
    }));

    try {
      const result = StorageService.completeSale({
        cashRegisterId: activeCash.id,
        operatorId: currentUser.id,
        operatorName: currentUser.name,
        customerId: selectedCustomer?.id,
        customerName: selectedCustomer ? selectedCustomer.name : customCpfCnpj ? 'Consumidor Identificado' : 'Consumidor Final',
        customerCpfCnpj: selectedCustomer ? selectedCustomer.cpfCnpj : customCpfCnpj || undefined,
        items: saleItems,
        subtotal,
        discountTotal,
        additionTotal,
        total,
        payments,
        change: payments.reduce((acc, curr) => acc + (curr.change || 0), 0),
      });

      onComplete(result.sale, result.invoice);
    } catch (err: any) {
      alert('Erro ao finalizar venda: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Oficial Farah */}
        <div className="px-6 py-4 bg-[#242424] text-white flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFCC33] rounded-xl text-[#242424]">
              <Receipt className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-wide text-white">
                Finalização de Venda & Pagamento
              </h2>
              <p className="text-xs text-[#FFCC33] font-bold">
                Farah Esfiharia e Pizzaria • Total a Receber: R$ {total.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto flex-1 bg-[#F6F5F1]">
          {/* Coluna Esquerda: Formas de Pagamento */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="text-xs font-black text-[#6B6862] uppercase tracking-wider block mb-2">
                Selecione o Meio de Pagamento:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('DINHEIRO')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    selectedMethod === 'DINHEIRO'
                      ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40 shadow-sm'
                      : 'bg-white border-[#E7E2D8] text-[#252525] hover:bg-stone-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#242424]" />
                  <span>Dinheiro (F1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('PIX')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    selectedMethod === 'PIX'
                      ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40 shadow-sm'
                      : 'bg-white border-[#E7E2D8] text-[#252525] hover:bg-stone-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-teal-600" />
                  <span>PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARTAO_CREDITO')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    selectedMethod === 'CARTAO_CREDITO'
                      ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40 shadow-sm'
                      : 'bg-white border-[#E7E2D8] text-[#252525] hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#CF1020]" />
                  <span>Crédito (TEF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARTAO_DEBITO')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    selectedMethod === 'CARTAO_DEBITO'
                      ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40 shadow-sm'
                      : 'bg-white border-[#E7E2D8] text-[#252525] hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Débito (TEF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CREDIARIO')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    selectedMethod === 'CREDIARIO'
                      ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40 shadow-sm'
                      : 'bg-white border-[#E7E2D8] text-[#252525] hover:bg-stone-50'
                  }`}
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Conta da Casa</span>
                </button>
              </div>
            </div>

            {/* Painel Específico da Forma Selecionada */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2D8] shadow-sm">
              {selectedMethod === 'DINHEIRO' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#252525] font-bold">Valor em Dinheiro Recebido:</span>
                    <span className="text-xs text-[#6B6862]">Falta receber: R$ {remaining.toFixed(2)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#6B6862] font-bold text-sm">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl pl-10 pr-3 py-2 text-lg font-black text-[#252525] focus:outline-none focus:border-[#FFCC33] font-mono"
                    />
                  </div>
                  {/* Botões Rápidos de Notas */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[remaining, 10, 20, 50, 100, 200].map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCashReceived(val)}
                        className="px-3 py-1 bg-[#F6F5F1] hover:bg-stone-200 text-[#252525] text-xs rounded-lg font-mono font-bold transition-colors border border-[#E7E2D8]"
                      >
                        {idx === 0 ? 'Exato' : `R$ ${val}`}
                      </button>
                    ))}
                  </div>
                  {cashReceived > remaining && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[#26734D] font-black">
                      <span className="text-xs uppercase">Troco a Devolver:</span>
                      <span className="text-lg font-mono">R$ {(cashReceived - remaining).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'PIX' && (
                <div className="text-center py-2 space-y-3">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-[#E7E2D8]">
                    <QrCode className="w-32 h-32 text-[#242424] mx-auto" />
                  </div>
                  <div className="text-xs text-[#252525]">
                    <div className="font-black text-[#242424] text-sm">QR Code Pix Dinâmico Farah</div>
                    <div className="text-[#6B6862] mt-0.5">Valor: R$ {remaining.toFixed(2)} • Farah Esfiharia e Pizzaria</div>
                  </div>
                  {isProcessingPix ? (
                    <div className="flex items-center justify-center gap-2 text-teal-700 text-xs font-bold py-1 bg-teal-50 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                      <span>Aguardando confirmação do banco instantaneamente... ({pixCountdown}s)</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#6B6862] bg-[#F6F5F1] p-2.5 rounded-lg border border-[#E7E2D8] font-mono break-all select-all">
                      00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540{remaining.toFixed(2)}5802BR5925FARAH ESFIHARIA PIZZARIA6009SAO PAULO62070503***6304ABCD
                    </div>
                  )}
                </div>
              )}

              {(selectedMethod === 'CARTAO_CREDITO' || selectedMethod === 'CARTAO_DEBITO') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#252525]">
                    <span className="font-bold">Integração TEF Dedicado:</span>
                    <span className="font-bold text-[#26734D] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> PINPAD Operacional (USB 01)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTefTerminal('STONE_TEF')}
                      className={`px-3 py-2 text-xs rounded-xl border text-center font-bold transition-all ${
                        tefTerminal === 'STONE_TEF'
                          ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40'
                          : 'bg-[#F6F5F1] border-[#E7E2D8] text-[#252525]'
                      }`}
                    >
                      Stone TEF
                    </button>
                    <button
                      type="button"
                      onClick={() => setTefTerminal('CIELO')}
                      className={`px-3 py-2 text-xs rounded-xl border text-center font-bold transition-all ${
                        tefTerminal === 'CIELO'
                          ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40'
                          : 'bg-[#F6F5F1] border-[#E7E2D8] text-[#252525]'
                      }`}
                    >
                      Cielo LIO
                    </button>
                    <button
                      type="button"
                      onClick={() => setTefTerminal('MERCADO_PAGO')}
                      className={`px-3 py-2 text-xs rounded-xl border text-center font-bold transition-all ${
                        tefTerminal === 'MERCADO_PAGO'
                          ? 'bg-amber-50 border-[#FFCC33] text-[#242424] ring-2 ring-[#FFCC33]/40'
                          : 'bg-[#F6F5F1] border-[#E7E2D8] text-[#252525]'
                      }`}
                    >
                      Mercado Pago
                    </button>
                  </div>

                  {selectedMethod === 'CARTAO_CREDITO' && (
                    <div>
                      <label className="text-xs text-[#6B6862] font-bold block mb-1">Parcelamento do Pedido:</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                        className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-[#252525] font-semibold"
                      >
                        <option value={1}>1x de R$ {remaining.toFixed(2)} (À vista)</option>
                        <option value={2}>2x de R$ {(remaining / 2).toFixed(2)}</option>
                        <option value={3}>3x de R$ {(remaining / 3).toFixed(2)}</option>
                        <option value={6}>6x de R$ {(remaining / 6).toFixed(2)}</option>
                      </select>
                    </div>
                  )}

                  {isProcessingTef && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 text-[#242424] text-xs font-bold animate-pulse">
                      <Loader2 className="w-5 h-5 animate-spin text-[#CF1020]" />
                      <span>{tefMessage}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'CREDIARIO' && (
                <div className="space-y-3">
                  <label className="text-xs text-[#252525] font-bold block">Selecione o Cliente / Comanda da Casa:</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-[#252525] font-semibold"
                  >
                    <option value="">Selecione o cliente cadastrado...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (CPF/CNPJ: {c.cpfCnpj}) - Limite Disp: R$ {(c.creditLimit - c.creditUsed).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <div className="text-[11px] text-[#242424] bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                    O valor será lançado em Contas a Receber para vencimento mensal.
                  </div>
                </div>
              )}

              {/* Botão de Adicionar Meio de Pagamento */}
              <button
                type="button"
                disabled={remaining <= 0 || isProcessingTef || isProcessingPix}
                onClick={handleAddPayment}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#242424] hover:bg-black text-[#FFCC33] font-black py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Registrar Pagamento de R$ {remaining.toFixed(2)}</span>
              </button>
            </div>

            {/* Identificação de CPF na NFC-e */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E7E2D8] shadow-sm">
              <label className="text-xs font-bold text-[#252525] block mb-1">
                CPF / CNPJ na NFC-e (Nota Fiscal Paulista):
              </label>
              <input
                type="text"
                placeholder="Ex: 123.456.789-00 ou 00.000.000/0001-00 (Opcional)"
                value={customCpfCnpj}
                onChange={(e) => setCustomCpfCnpj(e.target.value)}
                className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-[#252525] font-mono focus:outline-none focus:border-[#FFCC33]"
              />
            </div>
          </div>

          {/* Coluna Direita: Resumo Financeiro & Pagamentos Lançados */}
          <div className="md:col-span-5 bg-[#242424] text-white p-5 rounded-2xl border border-[#333333] flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="border-b border-[#3D3D3D] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#FFCC33] font-black block mb-2">
                  Resumo Financeiro
                </span>
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">R$ {subtotal.toFixed(2)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-xs text-[#FFCC33] font-bold">
                    <span>Desconto Total:</span>
                    <span className="font-mono">- R$ {discountTotal.toFixed(2)}</span>
                  </div>
                )}
                {additionTotal > 0 && (
                  <div className="flex justify-between text-xs text-stone-300">
                    <span>Acréscimos:</span>
                    <span className="font-mono">+ R$ {additionTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white mt-2 pt-2 border-t border-[#3D3D3D]">
                  <span className="text-[#FFCC33]">TOTAL:</span>
                  <span className="font-mono text-xl text-[#FFCC33]">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Lista de Pagamentos Lançados */}
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-300 font-bold block mb-2">
                  Pagamentos Registrados ({payments.length}):
                </span>
                {payments.length === 0 ? (
                  <div className="text-xs text-stone-400 py-3 text-center border border-dashed border-[#3D3D3D] rounded-xl">
                    Nenhum pagamento lançado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 bg-[#1A1A1A] rounded-xl border border-[#333333] text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {p.method} {p.installments && p.installments > 1 ? `(${p.installments}x)` : ''}
                          </div>
                          {p.tefAuthCode && (
                            <div className="text-[10px] text-stone-400">
                              Aut: {p.tefAuthCode} • NSU: {p.tefNsu || 'LOCAL'}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[#FFCC33]">
                            R$ {p.amount.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePayment(p.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status do Saldo */}
              <div className="p-3.5 bg-[#1A1A1A] rounded-xl border border-[#333333] space-y-1.5">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Total Pago:</span>
                  <span className="font-mono text-white font-bold">R$ {totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Restante a Pagar:</span>
                  <span className={`font-mono font-black ${remaining > 0 ? 'text-[#FFCC33]' : 'text-stone-400'}`}>
                    R$ {remaining.toFixed(2)}
                  </span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-black pt-1.5 border-t border-[#333333]">
                    <span>Troco:</span>
                    <span className="font-mono text-sm">R$ {change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botão Finalizar Venda com Cor da Marca */}
            <div className="pt-4 mt-4 border-t border-[#3D3D3D]">
              <button
                type="button"
                disabled={remaining > 0 || isProcessingTef || isProcessingPix}
                onClick={handleFinalizeSale}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#CF1020] hover:bg-[#B4101E] text-white font-black rounded-xl shadow-lg shadow-red-950/60 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>CONFIRMAR & EMITIR NFC-e (F10)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
