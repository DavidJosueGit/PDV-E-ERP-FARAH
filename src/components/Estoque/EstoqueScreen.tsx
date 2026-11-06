import React, { useState } from 'react';
import {
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  RefreshCw,
  Plus,
  History,
  TrendingDown,
  X,
  CheckCircle2,
  Package
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Product, StockMovement, MovementType } from '../../types';

export const EstoqueScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts());
  const [movements, setMovements] = useState<StockMovement[]>(StorageService.getStockMovements());
  const currentUser = StorageService.getCurrentUser();

  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [movementType, setMovementType] = useState<MovementType>('ENTRADA');
  const [quantity, setQuantity] = useState<number>(20);
  const [unitCost, setUnitCost] = useState<number>(3.0);
  const [reason, setReason] = useState<string>('Produção artesanal de esfihas - Lote do dia');

  const refreshData = () => {
    setProducts(StorageService.getProducts());
    setMovements(StorageService.getStockMovements());
  };

  // Cálculos de KPIs
  const totalStockItems = products.reduce((acc, curr) => acc + curr.currentStock, 0);
  const totalCostValue = products.reduce((acc, curr) => acc + (curr.currentStock * curr.costPrice), 0);
  const totalRetailValue = products.reduce((acc, curr) => acc + (curr.currentStock * curr.salePrice), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;

  const handleOpenMovement = (productId?: string, type: MovementType = 'ENTRADA') => {
    const prod = products.find(p => p.id === productId) || products[0];
    if (prod) {
      setSelectedProductId(prod.id);
      setUnitCost(prod.costPrice);
    }
    setMovementType(type);
    setQuantity(20);
    setReason(
      type === 'ENTRADA'
        ? 'Produção artesanal Farah - Lote fresco'
        : type === 'PERDA_AVARIA'
        ? 'Descarte por tempo ou avaria de forneio'
        : 'Ajuste de contagem periódica'
    );
    setShowMovementModal(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity <= 0) {
      alert('Informe uma quantidade válida maior que zero.');
      return;
    }

    const newMovement: StockMovement = {
      id: 'mov-' + Date.now(),
      productId: product.id,
      productName: product.name,
      type: movementType,
      quantity,
      unitPrice: unitCost,
      totalValue: quantity * unitCost,
      reason,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
    };

    StorageService.addStockMovement(newMovement);
    refreshData();
    setShowMovementModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#242424]" />
              <span>Controle de Estoque & Insumos — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Controle de massas, recheios, bebidas, movimentações de produção e alertas de reposição para a cozinha.
          </p>
        </div>

        <button
          onClick={() => handleOpenMovement()}
          className="px-4 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Lançar Entrada / Ajuste</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Itens em Estoque</span>
          <div className="text-2xl font-black font-mono text-[#242424] mt-1">
            {totalStockItems} <span className="text-xs font-normal text-[#6B6862]">unidades</span>
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Prontos ou em maturação</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Custo Imobilizado</span>
          <div className="text-2xl font-black font-mono text-[#242424] mt-1">
            R$ {totalCostValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Valor de matéria-prima</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Previsão em Venda</span>
          <div className="text-2xl font-black font-mono text-[#26734D] mt-1">
            R$ {totalRetailValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#26734D] font-medium mt-1">Receita potencial total</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl shadow-sm">
          <span className="text-xs text-[#6B6862] uppercase font-bold tracking-wider">Alerta de Reposição</span>
          <div className="text-2xl font-black font-mono text-[#D97706] mt-1 flex items-center gap-2">
            {lowStockCount}
            {lowStockCount > 0 ? (
              <span className="text-xs bg-[#D97706]/15 text-[#D97706] px-2 py-0.5 rounded font-sans font-bold">
                Repor Insumos
              </span>
            ) : (
              <span className="text-xs bg-[#26734D]/15 text-[#26734D] px-2 py-0.5 rounded font-sans font-bold">
                Tudo Normal
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6B6862] mt-1">Abaixo do estoque mínimo</div>
        </div>
      </div>

      {/* Seção Alerta de Ruptura de Estoque */}
      {lowStockCount > 0 && (
        <div className="bg-[#FFFFFF] border-l-4 border-[#D97706] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm">
          <h2 className="text-xs font-bold text-[#D97706] uppercase tracking-wider flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            <span>Itens que Exigem Reposição Imediata ({lowStockCount})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products
              .filter(p => p.currentStock <= p.minStock)
              .map(p => (
                <div key={p.id} className="bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#242424] text-xs">{p.name}</div>
                    <div className="text-[10px] text-[#6B6862] font-mono mt-0.5">
                      Atual: <strong className="text-[#CF1020] font-black">{p.currentStock} {p.unit}</strong> • Mínimo: {p.minStock} {p.unit}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenMovement(p.id, 'ENTRADA')}
                    className="px-2.5 py-1 bg-[#FFCC33] hover:bg-[#e6b82e] text-[#242424] rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Repor
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tabela de Histórico de Movimentações */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E7E2D8] flex items-center justify-between bg-[#F6F5F1]">
          <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 uppercase tracking-wider">
            <History className="w-4 h-4 text-[#242424]" />
            <span>Extrato e Rastreabilidade de Movimentações</span>
          </h2>
          <span className="text-[11px] font-semibold text-[#6B6862]">Auditoria Interna</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4 text-center">Quantidade</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4">Motivo / Documento</th>
                <th className="py-3 px-4">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#6B6862]">
                    {new Date(m.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        m.type === 'ENTRADA'
                          ? 'bg-[#26734D]/15 text-[#26734D]'
                          : m.type === 'SAIDA'
                          ? 'bg-[#242424]/10 text-[#242424]'
                          : m.type === 'PERDA_AVARIA'
                          ? 'bg-[#CF1020]/15 text-[#CF1020]'
                          : 'bg-[#D97706]/15 text-[#D97706]'
                      }`}
                    >
                      {m.type === 'ENTRADA' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#242424]">{m.productName}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#242424]">
                    {m.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#242424]">
                    R$ {m.totalValue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-[#6B6862]">{m.reason}</td>
                  <td className="py-3 px-4 text-[#6B6862]">{m.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Movimentação Manual */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FFCC33]" />
                <span>Lançamento de Estoque & Produção</span>
              </h2>
              <button onClick={() => setShowMovementModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[#242424] font-semibold block mb-1">Item / Insumo *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find(prod => prod.id === e.target.value);
                    if (p) setUnitCost(p.costPrice);
                  }}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Atual: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Tipo de Movimentação</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as MovementType)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                  >
                    <option value="ENTRADA">ENTRADA (Produção / Compra)</option>
                    <option value="SAIDA">SAÍDA (Consumo Interno)</option>
                    <option value="AJUSTE">AJUSTE (Inventário Físico)</option>
                    <option value="PERDA_AVARIA">PERDA / DESCARTE</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Custo Unitário (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Motivo / Justificativa *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Forneio matinal - lote de 50 esfihas de carne"
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
