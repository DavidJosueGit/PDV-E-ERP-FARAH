import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Award,
  CreditCard,
  UtensilsCrossed,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const DashboardScreen: React.FC = () => {
  const db = StorageService.getDatabase();
  const sales = db.sales.filter(s => s.status === 'CONCLUIDA');
  const products = db.products;

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.total, 0);
  const totalSalesCount = sales.length;
  const ticketMedio = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
  const totalItemsSold = sales.reduce((acc, curr) => 
    acc + curr.items.reduce((iAcc, item) => iAcc + item.quantity, 0), 0
  );

  // Vendas por forma de pagamento
  const paymentTotals: Record<string, number> = {
    DINHEIRO: 0,
    PIX: 0,
    CARTAO_CREDITO: 0,
    CARTAO_DEBITO: 0,
    CREDIARIO: 0,
  };

  for (const s of sales) {
    for (const p of s.payments) {
      paymentTotals[p.method] = (paymentTotals[p.method] || 0) + p.amount;
    }
  }

  // Ranking de produtos mais vendidos
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const s of sales) {
    for (const item of s.items) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
      }
      productSalesMap[item.productId].quantity += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
    }
  }

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header com Identidade Farah */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight">
              Painel Executivo & Vendas — Farah Esfiharia & Pizzaria
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Métricas de faturamento, ticket médio e giro do cardápio consolidados em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#242424] flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#26734D]"></span>
            <span>Operação Salão & Balcão Ativa</span>
          </div>
        </div>
      </div>

      {/* Alerta de Estoque Mínimo se houver */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#FFFFFF] border-l-4 border-[#D97706] border border-[#E7E2D8] p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#242424]">Atenção de Reposição de Insumos / Estoque</h2>
              <p className="text-[11px] text-[#6B6862]">
                {lowStockItems.length} item(ns) estão no limite ou abaixo do estoque mínimo: {lowStockItems.map(p => p.name).join(', ')}.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-lg">
            Ver Estoque
          </span>
        </div>
      )}

      {/* KPI Cards Principais em Fundo Branco com Acentos Farah */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Bruto */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#6B6862] text-xs font-bold uppercase tracking-wider">
            <span>Faturamento Bruto</span>
            <div className="w-8 h-8 rounded-lg bg-[#26734D]/10 flex items-center justify-center text-[#26734D]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#242424] mt-2 tracking-tight">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#26734D] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Consolidado de turnos</span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#6B6862] text-xs font-bold uppercase tracking-wider">
            <span>Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFCC33]/20 flex items-center justify-center text-[#242424]">
              <TrendingUp className="w-4 h-4 text-[#CF1020]" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#242424] mt-2 tracking-tight">
            R$ {ticketMedio.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">
            Média por comanda / pedido
          </div>
        </div>

        {/* Pedidos & Atendimentos */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#6B6862] text-xs font-bold uppercase tracking-wider">
            <span>Vendas Concluídas</span>
            <div className="w-8 h-8 rounded-lg bg-[#CF1020]/10 flex items-center justify-center text-[#CF1020]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#242424] mt-2 tracking-tight">
            {totalSalesCount} <span className="text-xs text-[#6B6862] font-semibold">pedidos</span>
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">
            {totalItemsSold} itens comercializados
          </div>
        </div>

        {/* Margem Média do Cardápio */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#6B6862] text-xs font-bold uppercase tracking-wider">
            <span>Margem Comercial</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFCC33]/30 flex items-center justify-center text-[#242424]">
              <Award className="w-4 h-4 text-[#242424]" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#242424] mt-2 tracking-tight">
            63.8%
          </div>
          <div className="text-[11px] text-[#26734D] font-medium mt-1">
            Alta rentabilidade nas esfihas
          </div>
        </div>
      </div>

      {/* Grid: Meios de Pagamento e Ranking de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Meio de Pagamento */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <h2 className="text-sm font-bold text-[#242424] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#CF1020]" />
              <span>Recebimento por Meio de Pagamento</span>
            </h2>
            <span className="text-[11px] font-semibold text-[#6B6862]">TEF & PIX Integrado</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {Object.entries(paymentTotals).map(([method, amount]) => {
              const percent = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              const methodLabels: Record<string, string> = {
                DINHEIRO: 'Dinheiro Espécie',
                PIX: 'PIX Instantâneo QR Code',
                CARTAO_CREDITO: 'Cartão de Crédito',
                CARTAO_DEBITO: 'Cartão de Débito',
                CREDIARIO: 'Comanda Salão / Faturado',
              };

              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#242424]">
                    <span className="font-semibold">{methodLabels[method] || method}</span>
                    <span className="font-mono font-bold">
                      R$ {amount.toFixed(2)} <span className="text-[#6B6862] font-normal">({percent.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F6F5F1] h-2.5 rounded-full overflow-hidden border border-[#E7E2D8]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(2, percent)}%`,
                        backgroundColor: method === 'PIX' ? '#26734D' : method === 'DINHEIRO' ? '#FFCC33' : '#CF1020',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Produtos Mais Vendidos */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <h2 className="text-sm font-bold text-[#242424] flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#FFCC33]" />
              <span>Mais Vendidos — Giro do Cardápio Farah</span>
            </h2>
            <span className="text-[11px] font-semibold text-[#6B6862]">Curva ABC</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-xs text-[#6B6862] text-center py-8">
              Nenhuma venda registrada ainda no período.
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {topProducts.map((p, index) => (
                <div
                  key={index}
                  className="bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8] flex items-center justify-between text-xs hover:border-[#FFCC33] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-xs ${
                        index === 0
                          ? 'bg-[#FFCC33] text-[#242424]'
                          : index === 1
                          ? 'bg-[#CF1020] text-white'
                          : 'bg-[#FFFFFF] text-[#242424] border border-[#E7E2D8]'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[#242424]">{p.name}</div>
                      <div className="text-[10px] text-[#6B6862]">{p.quantity} unidades servidas</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#242424] text-sm">
                    R$ {p.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
