import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AccountPayable, AccountReceivable, Sale } from '../../types';

export const FinanceiroScreen: React.FC = () => {
  const [payables, setPayables] = useState<AccountPayable[]>(StorageService.getAccountsPayable());
  const [receivables, setReceivables] = useState<AccountReceivable[]>(StorageService.getAccountsReceivable());
  const sales = StorageService.getSales();
  const [activeTab, setActiveTab] = useState<'DRE' | 'PAGAR' | 'RECEBER'>('DRE');

  const refreshData = () => {
    setPayables(StorageService.getAccountsPayable());
    setReceivables(StorageService.getAccountsReceivable());
  };

  const handlePayAccount = (id: string) => {
    if (confirm('Confirmar a quitação desta despesa de insumos/fornecedor?')) {
      StorageService.markAccountPayableAsPaid(id, 'Transferência Pix / Caixa Farah');
      refreshData();
    }
  };

  const handleReceiveAccount = (id: string) => {
    if (confirm('Confirmar o recebimento deste valor de cliente?')) {
      StorageService.markAccountReceivableAsReceived(id);
      refreshData();
    }
  };

  // Cálculos DRE Comercial Farah
  const receitaBruta = sales
    .filter(s => s.status === 'CONCLUIDA')
    .reduce((acc, curr) => acc + curr.total, 0);

  const impostosDeducoes = receitaBruta * 0.085; // Alíquota Simples Nacional ~8.5%
  const receitaLiquida = receitaBruta - impostosDeducoes;
  const cmv = receitaBruta * 0.38; // Custo médio das esfihas e insumos (~38%)
  const lucroBruto = receitaLiquida - cmv;

  const totalDespesasPagas = payables
    .filter(p => p.status === 'PAGO')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalContasAPagarPendentes = payables
    .filter(p => p.status === 'PENDENTE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalContasAReceberPendentes = receivables
    .filter(r => r.status === 'PENDENTE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const resultadoOperacional = lucroBruto - totalDespesasPagas;

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#242424]" />
              <span>Financeiro & DRE Comercial — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Contas a pagar de insumos, recebíveis, fluxo de caixa e DRE gerencial do restaurante.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E7E2D8] p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('DRE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'DRE'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            DRE & Resultados
          </button>
          <button
            onClick={() => setActiveTab('PAGAR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'PAGAR'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            Contas a Pagar ({payables.filter(p => p.status === 'PENDENTE').length})
          </button>
          <button
            onClick={() => setActiveTab('RECEBER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'RECEBER'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            Contas a Receber ({receivables.filter(r => r.status === 'PENDENTE').length})
          </button>
        </div>
      </div>

      {/* KPI Cards Financeiros */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Receita Bruta</span>
          <div className="text-2xl font-black font-mono text-[#26734D] mt-1">
            R$ {receitaBruta.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Vendas salão e balcão</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">A Pagar (Pendente)</span>
          <div className="text-2xl font-black font-mono text-[#CF1020] mt-1">
            R$ {totalContasAPagarPendentes.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Boletos de fornecedores</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">A Receber</span>
          <div className="text-2xl font-black font-mono text-[#242424] mt-1">
            R$ {totalContasAReceberPendentes.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Crediário e faturados</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Resultado Operacional</span>
          <div className={`text-2xl font-black font-mono mt-1 ${resultadoOperacional >= 0 ? 'text-[#26734D]' : 'text-[#CF1020]'}`}>
            R$ {resultadoOperacional.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#26734D] font-semibold mt-1">Margem positiva da operação</div>
        </div>
      </div>

      {/* Conteúdo da Aba DRE */}
      {activeTab === 'DRE' && (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4 text-[#CF1020]" />
              <span>Demonstrativo do Resultado do Exercício (DRE Gerencial)</span>
            </h2>
            <span className="text-xs text-[#6B6862] font-mono font-medium">Regime de Competência</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-3 bg-[#F6F5F1] rounded-xl border border-[#E7E2D8]">
              <span className="text-[#242424] font-bold">(+) RECEITA BRUTA DE VENDAS</span>
              <span className="text-[#26734D] font-bold">R$ {receitaBruta.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] text-[#CF1020]">
              <span>(-) Deduções da Receita Bruta (Simples Nacional ~8.5%)</span>
              <span>- R$ {impostosDeducoes.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-[#F6F5F1] rounded-xl font-bold text-[#242424] border-l-4 border-[#242424]">
              <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
              <span>R$ {receitaLiquida.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] text-[#CF1020]">
              <span>(-) Custo das Mercadorias Vendidas (CMV Médio ~38%)</span>
              <span>- R$ {cmv.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-[#F6F5F1] rounded-xl font-bold text-[#26734D] border-l-4 border-[#26734D]">
              <span>(=) LUCRO BRUTO COMERCIAL</span>
              <span>R$ {lucroBruto.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-[#FFFFFF] rounded-xl border border-[#E7E2D8] text-[#D97706]">
              <span>(-) Despesas Operacionais e Financeiras Liquidadas</span>
              <span>- R$ {totalDespesasPagas.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3.5 bg-[#FFCC33]/20 border-2 border-[#FFCC33] rounded-xl font-black text-sm text-[#242424]">
              <span>(=) RESULTADO LÍQUIDO DO PERÍODO</span>
              <span>R$ {resultadoOperacional.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Contas a Pagar */}
      {activeTab === 'PAGAR' && (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Contas a Pagar (Fornecedores de Alimentos e Despesas)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Fornecedor</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4 text-right">Valor (R$)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {payables.map((ap) => (
                  <tr key={ap.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#242424]">{ap.supplierName}</td>
                    <td className="py-3 px-4 text-[#6B6862]">{ap.description}</td>
                    <td className="py-3 px-4 text-[#6B6862]">{ap.category}</td>
                    <td className="py-3 px-4 font-mono text-[#242424]">{ap.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#CF1020]">
                      R$ {ap.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ap.status === 'PAGO'
                            ? 'bg-[#26734D]/15 text-[#26734D]'
                            : 'bg-[#D97706]/15 text-[#D97706]'
                        }`}
                      >
                        {ap.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {ap.status === 'PENDENTE' && (
                        <button
                          onClick={() => handlePayAccount(ap.id)}
                          className="px-2.5 py-1 bg-[#26734D] hover:bg-[#1f5d3e] text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Liquidar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Contas a Receber */}
      {activeTab === 'RECEBER' && (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Contas a Receber (Crediário e Clientes Faturados)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Parcela</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4 text-right">Valor (R$)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {receivables.map((ar) => (
                  <tr key={ar.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#242424]">{ar.customerName}</td>
                    <td className="py-3 px-4 text-[#6B6862]">{ar.description}</td>
                    <td className="py-3 px-4 font-mono text-[#6B6862]">{ar.installment}</td>
                    <td className="py-3 px-4 font-mono text-[#242424]">{ar.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#26734D]">
                      R$ {ar.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          ar.status === 'PAGO'
                            ? 'bg-[#26734D]/15 text-[#26734D]'
                            : 'bg-[#D97706]/15 text-[#D97706]'
                        }`}
                      >
                        {ar.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {ar.status === 'PENDENTE' && (
                        <button
                          onClick={() => handleReceiveAccount(ar.id)}
                          className="px-2.5 py-1 bg-[#26734D] hover:bg-[#1f5d3e] text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Receber
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
