import React, { useState } from 'react';
import {
  CreditCard,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Printer,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { TefPaymentService } from '../../services/fiscalAndTef';

export const TefScreen: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'STONE' | 'CIELO' | 'MERCADO_PAGO'>('STONE');
  const [method, setMethod] = useState<'CARTAO_CREDITO' | 'CARTAO_DEBITO'>('CARTAO_CREDITO');
  const [testAmount, setTestAmount] = useState<number>(45.70);
  const [installments, setInstallments] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tefResult, setTefResult] = useState<any | null>(null);

  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 'tef-1',
      acquirer: 'Stone Pagamentos',
      brand: 'MASTERCARD',
      method: 'CARTAO_CREDITO',
      amount: 55.60,
      installments: 1,
      nsu: '928371',
      authCode: '482910',
      timestamp: '2025-02-03T11:24:00Z',
      status: 'APROVADA',
    },
    {
      id: 'tef-2',
      acquirer: 'Cielo Brasil',
      brand: 'VISA',
      method: 'CARTAO_DEBITO',
      amount: 88.50,
      installments: 1,
      nsu: '881294',
      authCode: '194029',
      timestamp: '2025-02-02T16:10:00Z',
      status: 'APROVADA',
    }
  ]);

  const handleSimulateTransaction = async () => {
    setIsProcessing(true);
    setTefResult(null);
    try {
      const res = await TefPaymentService.processCardPayment(
        method,
        testAmount,
        installments,
        selectedProvider === 'STONE' ? 'STONE_TEF' : selectedProvider === 'CIELO' ? 'CIELO' : 'MERCADO_PAGO'
      );
      setTefResult(res);

      setTransactions(prev => [
        {
          id: 'tef-' + Date.now(),
          acquirer: res.acquirer,
          brand: res.cardBrand,
          method,
          amount: testAmount,
          installments,
          nsu: res.nsu,
          authCode: res.authorizationCode,
          timestamp: new Date().toISOString(),
          status: 'APROVADA',
        },
        ...prev
      ]);
    } catch (err: any) {
      alert('Erro na transação: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = (nsu: string) => {
    if (confirm(`Deseja solicitar o estorno e cancelamento da transação TEF com NSU ${nsu}?`)) {
      setTransactions(prev =>
        prev.map(t => (t.nsu === nsu ? { ...t, status: 'ESTORNADA' } : t))
      );
      alert(`Transação NSU ${nsu} estornada com sucesso junto à adquirente.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#242424]" />
              <span>TEF & Maquininhas de Cartão — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Comunicação direta com PINPAD Gertec / Verifone, adquirentes de cartão e conciliação de comprovantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#26734D]/15 border border-[#26734D]/30 text-[#26734D] text-xs font-mono font-bold">
            <Cpu className="w-4 h-4 text-[#26734D]" />
            GERENCIADOR TEF: ATIVO (PORTA 4096)
          </span>
        </div>
      </div>

      {/* Provedores Suportados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedProvider('STONE')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedProvider === 'STONE'
              ? 'bg-[#FFFFFF] border-[#FFCC33] ring-2 ring-[#FFCC33]/40 shadow-sm'
              : 'bg-[#FFFFFF] border-[#E7E2D8] hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#242424] text-sm">Stone TEF / Microvix</span>
            <span className="bg-[#26734D]/15 text-[#26734D] text-[10px] font-bold px-2 py-0.5 rounded font-mono">CONECTADO</span>
          </div>
          <p className="text-xs text-[#6B6862] leading-relaxed">
            Comunicação via DLL e WebSockets com PINPAD Gertec PPC930 / Verifone VX820 no balcão.
          </p>
        </div>

        <div
          onClick={() => setSelectedProvider('CIELO')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedProvider === 'CIELO'
              ? 'bg-[#FFFFFF] border-[#FFCC33] ring-2 ring-[#FFCC33]/40 shadow-sm'
              : 'bg-[#FFFFFF] border-[#E7E2D8] hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#242424] text-sm">Cielo LIO / Premia</span>
            <span className="bg-[#26734D]/15 text-[#26734D] text-[10px] font-bold px-2 py-0.5 rounded font-mono">CONECTADO</span>
          </div>
          <p className="text-xs text-[#6B6862] leading-relaxed">
            Protocolo TLS com roteamento automático de bandeiras e parcelamento no cartão.
          </p>
        </div>

        <div
          onClick={() => setSelectedProvider('MERCADO_PAGO')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            selectedProvider === 'MERCADO_PAGO'
              ? 'bg-[#FFFFFF] border-[#FFCC33] ring-2 ring-[#FFCC33]/40 shadow-sm'
              : 'bg-[#FFFFFF] border-[#E7E2D8] hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[#242424] text-sm">Mercado Pago Point</span>
            <span className="bg-[#D97706]/15 text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded font-mono">STANDBY</span>
          </div>
          <p className="text-xs text-[#6B6862] leading-relaxed">
            Integração Point Pro 2 via Device ID com Webhook de confirmação imediata de recebimento.
          </p>
        </div>
      </div>

      {/* Simulador de Transação TEF */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-[#CF1020]" />
          <span>Teste de Comunicação com PINPAD Físico</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs text-[#6B6862] font-semibold block mb-1">Modalidade:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
            >
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              <option value="CARTAO_DEBITO">Cartão de Débito</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#6B6862] font-semibold block mb-1">Valor do Pagamento (R$):</label>
            <input
              type="number"
              step="0.01"
              value={testAmount}
              onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-xs text-[#6B6862] font-semibold block mb-1">Parcelas:</label>
            <select
              disabled={method === 'CARTAO_DEBITO'}
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
              className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] disabled:opacity-50"
            >
              <option value={1}>1x À Vista</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              disabled={isProcessing}
              onClick={handleSimulateTransaction}
              className="w-full py-2.5 bg-[#CF1020] hover:bg-[#b00e1b] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Aguardando Cartão no PINPAD...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Enviar para PINPAD</span>
                </>
              )}
            </button>
          </div>
        </div>

        {tefResult && (
          <div className="bg-[#26734D]/10 p-4 rounded-xl border border-[#26734D]/30 text-xs font-mono space-y-2 text-[#242424]">
            <div className="flex items-center gap-2 text-[#26734D] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>TRANSAÇÃO APROVADA PELO EMISSOR</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[#6B6862]">
              <div>Adquirente: <strong className="text-[#242424]">{tefResult.acquirer}</strong></div>
              <div>Bandeira: <strong className="text-[#242424]">{tefResult.cardBrand}</strong></div>
              <div>NSU: <strong className="text-[#242424]">{tefResult.nsu}</strong></div>
              <div>Cód. Autorização: <strong className="text-[#242424]">{tefResult.authorizationCode}</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de Transações de Cartão */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1]">
          <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#26734D]" />
            <span>Extrato de Transações Eletrônicas de Fundos (TEF)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Adquirente</th>
                <th className="py-3 px-4">Bandeira / Modalidade</th>
                <th className="py-3 px-4 text-center">NSU</th>
                <th className="py-3 px-4 text-center">Cód. Aut</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#6B6862]">
                    {new Date(t.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#242424]">{t.acquirer}</td>
                  <td className="py-3 px-4 text-[#6B6862]">
                    {t.brand} • {t.method === 'CARTAO_CREDITO' ? `Crédito (${t.installments}x)` : 'Débito à vista'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#242424]">{t.nsu}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#242424]">{t.authCode}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#242424]">
                    R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        t.status === 'APROVADA'
                          ? 'bg-[#26734D]/15 text-[#26734D]'
                          : 'bg-[#CF1020]/15 text-[#CF1020]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {t.status === 'APROVADA' && (
                      <button
                        onClick={() => handleRefund(t.nsu)}
                        className="text-xs text-[#CF1020] hover:underline font-semibold cursor-pointer"
                      >
                        Estornar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
