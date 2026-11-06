import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Invoice, Sale } from '../../types';
import { FiscalService } from '../../services/fiscalAndTef';
import { ThermalReceiptModal } from '../PDV/ThermalReceiptModal';

export const FiscalScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(StorageService.getInvoices());
  const [sales, setSales] = useState<Sale[]>(StorageService.getSales());
  const [sefazStatus, setSefazStatus] = useState<{ online: boolean; pingMs: number; message: string }>({
    online: true,
    pingMs: 128,
    message: 'Serviço em Operação (SEFAZ SP - v4.00 NFC-e)',
  });
  const [isCheckingSefaz, setIsCheckingSefaz] = useState(false);
  const [selectedInvoiceForDanfe, setSelectedInvoiceForDanfe] = useState<{ sale: Sale; invoice: Invoice } | null>(null);

  const handleCheckSefaz = () => {
    setIsCheckingSefaz(true);
    setTimeout(() => {
      setIsCheckingSefaz(false);
      setSefazStatus({
        online: true,
        pingMs: Math.floor(90 + Math.random() * 60),
        message: '107 - Serviço em Operação (SEFAZ SP Homologação)',
      });
    }, 1000);
  };

  const handleDownloadXml = (invoice: Invoice) => {
    const sale = sales.find(s => s.id === invoice.saleId);
    if (sale) {
      FiscalService.downloadXml(sale, invoice);
    } else {
      alert('Venda associada não encontrada para gerar XML completo.');
    }
  };

  const handleOpenDanfe = (invoice: Invoice) => {
    const sale = sales.find(s => s.id === invoice.saleId);
    if (sale) {
      setSelectedInvoiceForDanfe({ sale, invoice });
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
              <FileText className="w-5 h-5 text-[#242424]" />
              <span>Documentos Fiscais (NFC-e / NF-e) — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Transmissão à SEFAZ SP, chaves de 44 dígitos, DANFE NFC-e com QR Code e repositório de XMLs 4.00.
          </p>
        </div>

        {/* Status SEFAZ */}
        <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#E7E2D8] p-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#26734D] animate-pulse" />
            <span className="text-xs text-[#6B6862] font-semibold">SEFAZ SP:</span>
            <span className="text-xs text-[#26734D] font-bold font-mono">{sefazStatus.pingMs}ms</span>
          </div>
          <button
            disabled={isCheckingSefaz}
            onClick={handleCheckSefaz}
            className="text-[#6B6862] hover:text-[#242424] p-1 rounded transition-colors cursor-pointer"
            title="Consultar Status do Servidor SEFAZ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSefaz ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">NFC-e Autorizadas</span>
          <div className="text-2xl font-black font-mono text-[#26734D] mt-1">
            {invoices.filter(i => i.status === 'AUTORIZADA').length}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Transmissão em tempo real</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Volume Faturado</span>
          <div className="text-2xl font-black font-mono text-[#242424] mt-1">
            R$ {invoices.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Cupom fiscal com tributos</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Ambiente Fiscal</span>
          <div className="text-2xl font-black font-mono text-[#D97706] mt-1">
            HOMOLOGAÇÃO
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Layout SEFAZ 4.00</div>
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1]">
          <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#26734D]" />
            <span>Repositório de Documentos Emitidos (NFC-e Mod. 65)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Número / Série</th>
                <th className="py-3 px-4">Emissão</th>
                <th className="py-3 px-4">Destinatário</th>
                <th className="py-3 px-4">Chave de Acesso</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#242424]">
                    NFC-e #{inv.invoiceNumber} <span className="text-[#6B6862] font-normal font-sans">(Série {inv.series})</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#6B6862]">
                    {new Date(inv.emissionDate).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-[#242424] font-medium">
                    {inv.customerName || 'Consumidor Final Não Identificado'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#6B6862]">
                    <span className="truncate block max-w-[160px]" title={inv.accessKey}>
                      {inv.accessKey}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#242424]">
                    R$ {inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-[#26734D]/15 text-[#26734D] text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenDanfe(inv)}
                        className="p-1.5 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] rounded-lg border border-[#E7E2D8] transition-colors cursor-pointer"
                        title="Visualizar e Imprimir Cupom DANFE"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadXml(inv)}
                        className="p-1.5 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] rounded-lg border border-[#E7E2D8] transition-colors cursor-pointer"
                        title="Baixar Arquivo XML Autorizado"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal DANFE */}
      {selectedInvoiceForDanfe && (
        <ThermalReceiptModal
          sale={selectedInvoiceForDanfe.sale}
          invoice={selectedInvoiceForDanfe.invoice}
          onClose={() => setSelectedInvoiceForDanfe(null)}
        />
      )}
    </div>
  );
};
