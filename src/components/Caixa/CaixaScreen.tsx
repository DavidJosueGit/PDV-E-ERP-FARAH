import React from 'react';
import {
  Banknote,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Unlock,
  Printer,
  History,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { CashRegister, CashMovement } from '../../types';

interface CaixaScreenProps {
  onOpenCaixaModal: () => void;
  onOpenSangriaModal: () => void;
}

export const CaixaScreen: React.FC<CaixaScreenProps> = ({
  onOpenCaixaModal,
  onOpenSangriaModal,
}) => {
  const activeCash = StorageService.getActiveCashRegister();
  const allMovements = StorageService.getCashMovements();
  const allRegisters = StorageService.getDatabase().cashRegisters;

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#242424]" />
              <span>Controle de Caixa & Turnos — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Gestão do fundo de troco, sangrias gerenciais, suprimentos e conciliação cega da gaveta do restaurante.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeCash && (
            <button
              onClick={onOpenSangriaModal}
              className="px-3.5 py-2 bg-[#FFFFFF] hover:bg-stone-50 text-[#242424] text-xs font-semibold rounded-xl border border-[#E7E2D8] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4 text-[#CF1020]" />
              <span>Sangria / Suprimento</span>
            </button>
          )}

          <button
            onClick={onOpenCaixaModal}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
              activeCash
                ? 'bg-[#CF1020] hover:bg-[#b00e1b] text-white shadow-red-900/20'
                : 'bg-[#26734D] hover:bg-[#1f5d3e] text-white'
            }`}
          >
            {activeCash ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Fechamento de Caixa</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Abrir Turno de Caixa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Caixa Ativo */}
      {activeCash ? (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#26734D] animate-ping" />
              <div>
                <div className="text-sm font-bold text-[#242424] flex items-center gap-2">
                  <span>Terminal #{activeCash.terminalNumber} • Turno em Operação</span>
                  <span className="bg-[#26734D]/15 text-[#26734D] text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    STATUS: ABERTO
                  </span>
                </div>
                <div className="text-xs text-[#6B6862] mt-0.5 flex items-center gap-2">
                  <span>Operador: <strong className="text-[#242424]">{activeCash.operatorName}</strong></span>
                  <span>•</span>
                  <span>Aberto às: {new Date(activeCash.openedAt).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs text-[#242424] hover:bg-stone-100 flex items-center gap-1.5 bg-[#F6F5F1] px-3 py-1.5 rounded-lg border border-[#E7E2D8] font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#242424]" />
              <span>Imprimir Espelho de Caixa</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8]">
              <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Fundo de Troco Inicial</span>
              <div className="text-xl font-bold font-mono text-[#242424] mt-1">
                R$ {activeCash.initialBalance.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8]">
              <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Total de Vendas</span>
              <div className="text-xl font-bold font-mono text-[#26734D] mt-1">
                R$ {activeCash.totalSales.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8]">
              <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Total Sangrias</span>
              <div className="text-xl font-bold font-mono text-[#CF1020] mt-1">
                - R$ {activeCash.totalSangria.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#F6F5F1] p-4 rounded-xl border-2 border-[#FFCC33]">
              <span className="text-xs text-[#242424] uppercase font-black tracking-wider">Saldo em Gaveta</span>
              <div className="text-xl font-black font-mono text-[#242424] mt-1">
                R$ {activeCash.currentBalance.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8]">
            <h3 className="text-xs font-bold text-[#6B6862] uppercase tracking-wider mb-3">
              Vendas Liquidadas por Forma de Pagamento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(activeCash.paymentsBreakdown).map(([method, amount]) => (
                <div key={method} className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E7E2D8]">
                  <span className="text-[11px] text-[#6B6862] block font-medium">{method}</span>
                  <span className="text-sm font-mono font-bold text-[#242424] mt-0.5 block">
                    R$ {amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-[#242424]">Nenhum Caixa Aberto no Momento</h2>
          <p className="text-xs text-[#6B6862] max-w-md mx-auto mt-1 mb-4">
            Para iniciar o atendimento no balcão e registrar vendas no PDV, abra um novo turno informando o fundo de troco da gaveta.
          </p>
          <button
            onClick={onOpenCaixaModal}
            className="px-5 py-2.5 bg-[#26734D] hover:bg-[#1f5d3e] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Abrir Turno do Caixa Agora
          </button>
        </div>
      )}

      {/* Histórico de Movimentações */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 mb-4 uppercase tracking-wider">
          <History className="w-4 h-4 text-[#242424]" />
          <span>Extrato de Movimentações de Dinheiro (Sangrias e Suprimentos)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] text-[#6B6862] font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Data/Hora</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Operador</th>
                <th className="py-2.5 px-3">Motivo / Descrição</th>
                <th className="py-2.5 px-3 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {allMovements.map((m) => (
                <tr key={m.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-2.5 px-3 text-[#6B6862] font-mono">
                    {new Date(m.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-2.5 px-3 font-bold">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        m.type === 'SANGRIA'
                          ? 'bg-[#CF1020]/15 text-[#CF1020]'
                          : 'bg-[#26734D]/15 text-[#26734D]'
                      }`}
                    >
                      {m.type === 'SANGRIA' ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#242424]">
                    <div>{m.userName}</div>
                    {m.authorizedBy && (
                      <div className="flex items-center gap-1 text-[10px] text-[#CF1020] mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#CF1020] shrink-0" />
                        <span>Liberação: {m.authorizedBy}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-[#6B6862]">{m.reason}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#242424]">
                    R$ {m.amount.toFixed(2)}
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
