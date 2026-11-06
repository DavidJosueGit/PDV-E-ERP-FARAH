import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  CheckCircle,
  QrCode,
  Wifi,
  Settings,
  AlertCircle,
  Loader2,
  RefreshCw,
  Monitor
} from 'lucide-react';
import { Sale, Invoice } from '../../types';
import { FiscalService } from '../../services/fiscalAndTef';
import { PrintService, PrinterConfig } from '../../services/printService';

interface ThermalReceiptModalProps {
  sale: Sale;
  invoice: Invoice;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  sale,
  invoice,
  onClose,
}) => {
  const [config, setConfig] = useState<PrinterConfig>(PrintService.getConfig());
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printStatus, setPrintStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Formata chave de 44 dígitos em grupos de 4
  const formatAccessKey = (key: string) => {
    return key.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleDownloadXml = () => {
    FiscalService.downloadXml(sale, invoice);
  };

  const handleSaveConfig = (newConfig: PrinterConfig) => {
    setConfig(newConfig);
    PrintService.saveConfig(newConfig);
  };

  const handleTestP2B = async () => {
    setIsPrinting(true);
    setPrintStatus(null);
    try {
      const res = await PrintService.testP2BConnection(config);
      if (res.success) {
        setPrintStatus({ type: 'success', message: res.message });
      } else {
        setPrintStatus({ type: 'error', message: res.message });
      }
    } catch (e: any) {
      setPrintStatus({
        type: 'error',
        message: `Não foi possível conectar à impressora: ${e.message}`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintStatus(null);

    // Se estiver configurado para PagBank Moderninha P2-B via Wi-Fi
    if (config.mode === 'PAGBANK_P2B') {
      try {
        const result = await PrintService.printToPagBankP2B(config, sale, invoice);
        if (result.success) {
          setPrintStatus({
            type: 'success',
            message: result.message,
          });
        } else {
          setPrintStatus({
            type: 'error',
            message: result.message,
          });
        }
      } catch (err: any) {
        setPrintStatus({
          type: 'error',
          message: `Falha ao enviar comprovante para PagBank P2-B: ${err.message}`,
        });
      } finally {
        setIsPrinting(false);
      }
      return;
    }

    // Modo Padrão: Impressão Térmica Isolada (Windows Spooler / Driver sem páginas em branco)
    try {
      await PrintService.printElementViaIframe('thermal-receipt');
      setPrintStatus({
        type: 'success',
        message: 'Impressão enviada com sucesso para a fila de impressão.',
      });
    } catch (err: any) {
      setPrintStatus({
        type: 'error',
        message: `Falha ao disparar impressão no Windows: ${err.message}`,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleFallbackWindowsPrint = async () => {
    setIsPrinting(true);
    try {
      await PrintService.printElementViaIframe('thermal-receipt');
      setPrintStatus({
        type: 'info',
        message: 'Comprovante enviado para a fila de impressão local do Windows.',
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal com Farah Branding */}
        <div className="px-5 py-3.5 bg-[#242424] text-white border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#26734D] text-white flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide text-white">Comprovante de Venda & NFC-e</h3>
              <p className="text-[11px] text-[#FFCC33] font-bold">Farah Esfiharia e Pizzaria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(prev => !prev)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                showConfig ? 'bg-[#FFCC33] text-[#242424]' : 'bg-stone-800 text-stone-300 hover:text-white'
              }`}
              title="Configurar Destino da Impressora (PagBank P2-B ou Windows)"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Impressora</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Painel Expansível de Configuração da Impressora */}
        {showConfig && (
          <div className="bg-[#1A1A1A] text-white p-4 border-b border-stone-800 space-y-3 text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFCC33] flex items-center gap-1.5">
                <Wifi className="w-4 h-4" />
                Destino da Impressão de Comprovante:
              </span>
              <span className="text-[10px] text-stone-400">Wi-Fi / Rede Local</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, mode: 'PAGBANK_P2B' })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  config.mode === 'PAGBANK_P2B'
                    ? 'bg-amber-950/60 border-[#FFCC33] text-[#FFCC33] font-bold'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Wifi className="w-3.5 h-3.5 text-[#FFCC33]" />
                  <span>PagBank P2-B (Wi-Fi)</span>
                </div>
                <div className="text-[10px] text-stone-400">Impressora térmica integrada</div>
              </button>

              <button
                type="button"
                onClick={() => handleSaveConfig({ ...config, mode: 'BROWSER_SPOOLER' })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  config.mode === 'BROWSER_SPOOLER'
                    ? 'bg-amber-950/60 border-[#FFCC33] text-[#FFCC33] font-bold'
                    : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Monitor className="w-3.5 h-3.5 text-stone-300" />
                  <span>Impressora Windows / PDF</span>
                </div>
                <div className="text-[10px] text-stone-400">Spooler térmico padrão</div>
              </button>
            </div>

            {config.mode === 'PAGBANK_P2B' && (
              <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] text-stone-400 block mb-1">
                      IP da PagBank P2-B na Rede Wi-Fi:
                    </label>
                    <input
                      type="text"
                      value={config.p2bIp}
                      onChange={(e) => handleSaveConfig({ ...config, p2bIp: e.target.value.trim() })}
                      placeholder="Ex: 192.168.1.150"
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#FFCC33]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">Porta HTTP:</label>
                    <input
                      type="number"
                      value={config.p2bPort}
                      onChange={(e) => handleSaveConfig({ ...config, p2bPort: parseInt(e.target.value) || 8080 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#FFCC33]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-400">
                    O notebook e a Moderninha P2-B devem estar no mesmo Wi-Fi.
                  </span>
                  <button
                    type="button"
                    disabled={isPrinting}
                    onClick={handleTestP2B}
                    className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold rounded-lg border border-stone-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPrinting ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensagens de Feedback e Tratamento de Erros de Impressão */}
        {printStatus && (
          <div
            className={`p-3 text-xs flex items-center justify-between border-b ${
              printStatus.type === 'success'
                ? 'bg-emerald-50 text-[#26734D] border-emerald-200'
                : printStatus.type === 'error'
                ? 'bg-red-50 text-[#B42318] border-red-200'
                : 'bg-amber-50 text-[#D97706] border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-bold">{printStatus.message}</span>
            </div>
            {printStatus.type === 'error' && config.mode === 'PAGBANK_P2B' && (
              <button
                type="button"
                onClick={handleFallbackWindowsPrint}
                className="ml-2 px-2.5 py-1 bg-[#242424] hover:bg-black text-white text-[10px] font-bold rounded-lg transition-colors shrink-0"
              >
                Imprimir no Windows
              </button>
            )}
          </div>
        )}

        {/* Cupom Térmico 80mm Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-[#F6F5F1] flex justify-center">
          <div
            id="thermal-receipt"
            className="bg-white text-black p-5 rounded-lg font-mono text-[11px] leading-relaxed w-full max-w-[340px] shadow-md border border-[#E7E2D8]"
          >
            {/* Cabeçalho */}
            <div className="text-center border-b border-dashed border-black pb-2 mb-2">
              <div className="font-black text-xs uppercase tracking-wider">FARAH ESFIHARIA E PIZZARIA LTDA</div>
              <div>CNPJ: 12.345.678/0001-90</div>
              <div>IE: 112.233.445.566</div>
              <div>Rua das Esfihas Tradicionais, 120 - Centro - São Paulo/SP</div>
              <div className="mt-1 font-bold text-[10px] tracking-widest border-t border-dotted border-gray-400 pt-1">
                DANFE NFC-e - DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETRÔNICA
              </div>
              <div className="text-[9px] text-gray-700">Não permite aproveitamento de crédito de ICMS</div>
            </div>

            {/* Dados da Venda e Consumidor */}
            <div className="border-b border-dashed border-black pb-1 mb-2">
              <div className="flex justify-between">
                <span>Venda: {sale.code}</span>
                <span>{new Date(sale.createdAt).toLocaleDateString('pt-BR')} {new Date(sale.createdAt).toLocaleTimeString('pt-BR')}</span>
              </div>
              <div>Consumidor: {sale.customerName || 'CONSUMIDOR FINAL'}</div>
              {sale.customerCpfCnpj && <div>CPF/CNPJ: {sale.customerCpfCnpj}</div>}
              <div>Operador: {sale.operatorName} • Caixa: #{sale.cashRegisterId}</div>
            </div>

            {/* Lista de Itens */}
            <div className="border-b border-dashed border-black pb-2 mb-2">
              <div className="flex justify-between font-bold border-b border-dotted border-gray-400 pb-1 mb-1">
                <span>ITEM CÓD DESCRIÇÃO</span>
                <span>QTDxV.UN TOTAL</span>
              </div>
              {sale.items.map((item, index) => (
                <div key={item.productId} className="mb-1 text-[10px]">
                  <div className="font-bold">
                    {String(index + 1).padStart(3, '0')} {item.sku} - {item.productName}
                  </div>
                  <div className="flex justify-between pl-4 text-gray-800">
                    <span>
                      {item.quantity} UN x R$ {item.unitPrice.toFixed(2)}
                      {item.discount > 0 && ` (Desc. R$ ${item.discount.toFixed(2)})`}
                    </span>
                    <span className="font-bold">R$ {item.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="border-b border-dashed border-black pb-2 mb-2 space-y-1">
              <div className="flex justify-between">
                <span>Qtd. Total de Itens:</span>
                <span className="font-bold">
                  {sale.items.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discountTotal > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>Desconto Total:</span>
                  <span>- R$ {sale.discountTotal.toFixed(2)}</span>
                </div>
              )}
              {sale.additionTotal > 0 && (
                <div className="flex justify-between">
                  <span>Acréscimos:</span>
                  <span>+ R$ {sale.additionTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black pt-1 border-t border-dotted border-gray-400">
                <span>VALOR TOTAL A PAGAR:</span>
                <span className="text-sm">R$ {sale.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="border-b border-dashed border-black pb-2 mb-2">
              <div className="font-bold mb-1">FORMA DE PAGAMENTO</div>
              {sale.payments.map((p) => (
                <div key={p.id} className="flex justify-between text-[10px]">
                  <span>{p.method} {p.installments && p.installments > 1 ? `(${p.installments}x)` : ''}:</span>
                  <span className="font-semibold">R$ {p.amount.toFixed(2)}</span>
                </div>
              ))}
              {sale.change > 0 && (
                <div className="flex justify-between font-bold text-[10px] mt-1 pt-1 border-t border-dotted border-gray-300">
                  <span>TROCO:</span>
                  <span>R$ {sale.change.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Tributos */}
            <div className="text-[9px] text-gray-700 border-b border-dashed border-black pb-2 mb-2">
              Informação dos Tributos Totais Incidentes (Lei Federal 12.741/2012):
              <div className="font-semibold">
                R$ {(sale.total * 0.2845).toFixed(2)} (Fed 13.45%, Est 15.00%)
              </div>
            </div>

            {/* Chave de Acesso e QR Code */}
            <div className="text-center pt-1 border-b border-dashed border-black pb-2 mb-2">
              <div className="font-bold text-[10px]">NFC-e Nº {invoice.invoiceNumber} • SÉRIE {invoice.series}</div>
              <div className="text-[9px] text-gray-600">
                Emissão: {new Date(invoice.emissionDate).toLocaleString('pt-BR')}
              </div>
              <div className="text-[9px] font-semibold mt-1">PROTOCOLO DE AUTORIZAÇÃO:</div>
              <div className="text-[10px] font-bold text-emerald-800">{invoice.protocol}</div>

              <div className="my-2 border border-black p-1 text-[8px] break-all leading-tight">
                <div className="font-bold text-[9px] mb-0.5">CHAVE DE ACESSO SEFAZ</div>
                {formatAccessKey(invoice.accessKey)}
              </div>

              {/* Simulação Visual do QR Code SEFAZ */}
              <div className="flex flex-col items-center justify-center my-2 p-2 bg-stone-50 border border-gray-300 rounded">
                <QrCode className="w-20 h-20 text-black mb-1" />
                <div className="text-[8px] text-gray-600 text-center">
                  Consulte pela Chave de Acesso em www.fazenda.sp.gov.br/nfce
                </div>
              </div>
            </div>

            {/* Mensagem de Agradecimento e Indicação de Não Fiscal Obrigatória */}
            <div className="text-center pt-1 text-[10px] space-y-1">
              <div className="font-semibold text-stone-800">
                Obrigado pela preferência! Volte sempre à Farah Esfiharia e Pizzaria!
              </div>
              <div className="font-bold text-[9px] text-stone-500 uppercase tracking-widest pt-1 border-t border-dotted border-gray-400">
                *** COMPROVANTE NÃO FISCAL ***
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Ações Preservadas */}
        <div className="p-4 bg-white border-t border-[#E7E2D8] flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
            <span>Destino atual:</span>
            <span className="font-bold text-[#242424]">
              {config.mode === 'PAGBANK_P2B' ? `PagBank P2-B (${config.p2bIp})` : 'Impressora Windows / PDF'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#F6F5F1] hover:bg-stone-200 text-[#252525] text-xs font-bold rounded-xl transition-colors border border-[#E7E2D8] cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#CF1020]" />
              <span>Baixar XML Fiscal</span>
            </button>
            <button
              disabled={isPrinting}
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#242424] hover:bg-black text-[#FFCC33] text-xs font-black rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFCC33]" />
                  <span>Enviando para Impressora...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Cupom Térmico (80mm)</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#CF1020] hover:bg-[#B4101E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
