import React, { useState, useEffect, useRef } from 'react';
import {
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Percent,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  HelpCircle,
  DollarSign,
  UtensilsCrossed,
  Tag,
  Pizza,
  Sparkles
} from 'lucide-react';
import { Product, CartItem, Sale, Invoice, CashRegister } from '../../types';
import { StorageService } from '../../services/storage';
import { PaymentModal } from './PaymentModal';
import { ThermalReceiptModal } from './ThermalReceiptModal';

interface PdvScreenProps {
  cashRegister: CashRegister | null;
  onOpenCashModal: () => void;
  onOpenSangriaModal: () => void;
}

export const PdvScreen: React.FC<PdvScreenProps> = ({
  cashRegister,
  onOpenCashModal,
  onOpenSangriaModal,
}) => {
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts());
  const [categories, setCategories] = useState(StorageService.getCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Input do leitor de código de barras
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);

  // Carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [additionTotal, setAdditionTotal] = useState<number>(0);

  // Modais de Finalização
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [completedSale, setCompletedSale] = useState<{ sale: Sale; invoice: Invoice } | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Manter foco no leitor de código de barras
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, [showPaymentModal, completedSale, showSearchModal]);

  // Teclas de Atalho Globais do PDV
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelpModal(prev => !prev);
      } else if (e.key === 'F2') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0) setShowDiscountModal(prev => !prev);
      } else if (e.key === 'F7') {
        e.preventDefault();
        onOpenSangriaModal();
      } else if (e.key === 'F8') {
        e.preventDefault();
        onOpenCashModal();
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0 && confirm('Deseja realmente cancelar todos os itens do pedido atual?')) {
          setCart([]);
        }
      } else if (e.key === 'F10') {
        e.preventDefault();
        if (cart.length > 0 && (!cashRegister || cashRegister.status === 'ABERTO')) {
          setShowPaymentModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, cashRegister, onOpenCashModal, onOpenSangriaModal]);

  // Adicionar produto por código de barras ou formato QTD*CODIGO
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    let quantity = 1;
    let code = barcodeInput.trim();

    // Suporta digitação de multiplicador: Ex: "6*ESF-CARNE" ou "3*7894900011517"
    if (code.includes('*')) {
      const parts = code.split('*');
      quantity = parseFloat(parts[0]) || 1;
      code = parts[1] || '';
    }

    const found = products.find(
      p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      addToCart(found, quantity);
      setBarcodeInput('');
    } else {
      alert(`Item com código ou SKU "${code}" não foi encontrado no cardápio.`);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (!cashRegister || cashRegister.status !== 'ABERTO') {
      alert('Atenção: O caixa está fechado! Abra o caixa antes de lançar pedidos.');
      return;
    }

    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        const newQty = next[index].quantity + quantity;
        next[index].quantity = newQty;
        next[index].total = newQty * next[index].unitPrice - next[index].discount;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            unitPrice: product.salePrice,
            discount: 0,
            total: quantity * product.salePrice,
          }
        ];
      }
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = Math.max(1, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.unitPrice - item.discount,
            };
          }
          return item;
        });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Cálculos de totais
  const subtotal = cart.reduce((acc, curr) => acc + curr.total, 0);
  const discountTotal = (subtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountTotal + additionTotal);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.barcode.includes(searchFilter) ||
      p.sku.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] overflow-hidden select-none font-sans">
      {/* Barra Superior de Teclas de Atalho com Tokens da Marca */}
      <div className="bg-[#1E1E1E] border-b border-[#333333] px-4 py-1.5 flex items-center justify-between text-[11px] text-stone-300 overflow-x-auto shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-[#FFCC33] text-[#242424] px-1.5 py-0.5 rounded font-black font-mono text-[10px]">F1</kbd>
            <span className="text-stone-300">Ajuda</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-[#333333] text-[#FFCC33] px-1.5 py-0.5 rounded font-bold font-mono text-[10px] border border-stone-600">F2</kbd>
            <span className="text-stone-300">Buscar Cardápio</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-[#333333] text-[#FFCC33] px-1.5 py-0.5 rounded font-bold font-mono text-[10px] border border-stone-600">F4</kbd>
            <span className="text-stone-300">Desconto</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-[#333333] text-stone-200 px-1.5 py-0.5 rounded font-bold font-mono text-[10px] border border-stone-600">F7</kbd>
            <span className="text-stone-300">Sangria / Suprimento</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-[#333333] text-stone-200 px-1.5 py-0.5 rounded font-bold font-mono text-[10px] border border-stone-600">F8</kbd>
            <span className="text-stone-300">Caixa</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <kbd className="bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded font-bold font-mono text-[10px] border border-red-800/60">F9</kbd>
            <span className="text-red-300">Cancelar Pedido</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <kbd className="bg-[#CF1020] text-white px-2 py-0.5 rounded font-black font-mono text-[10px] shadow-sm">F10</kbd>
            <span className="text-white font-bold tracking-wide">Finalizar Pedido</span>
          </span>
        </div>
      </div>

      {/* Alerta de Caixa Fechado */}
      {(!cashRegister || cashRegister.status !== 'ABERTO') && (
        <div className="bg-[#B42318] text-white px-4 py-2 flex items-center justify-between text-xs font-medium shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFCC33] shrink-0" />
            <span>O caixa deste terminal encontra-se fechado. Para registrar pedidos e emitir NFC-e, realize a abertura.</span>
          </div>
          <button
            onClick={onOpenCashModal}
            className="px-3 py-1 bg-[#FFCC33] hover:bg-[#ffcf40] text-[#242424] rounded-lg font-black text-xs transition-colors shadow-sm"
          >
            Abrir Caixa Agora (F8)
          </button>
        </div>
      )}

      {/* Grid Principal do PDV */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Lado Esquerdo: Leitor / Código / SKU + Cardápio Rápido */}
        <div className="lg:col-span-7 flex flex-col p-3 overflow-hidden bg-[#F6F5F1] border-r border-[#E7E2D8]">
          {/* Campo de Leitura Rápida */}
          <form onSubmit={handleBarcodeSubmit} className="mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Barcode className="w-5 h-5 text-[#CF1020]" />
              </div>
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Código de barras ou código rápido (ex: 6*ESF-01 ou ESF-02) e tecle ENTER..."
                className="w-full pl-11 pr-28 py-3 bg-white border-2 border-[#E7E2D8] rounded-xl text-[#252525] placeholder-[#6B6862] text-sm font-mono focus:outline-none focus:border-[#FFCC33] focus:ring-4 focus:ring-[#FFCC33]/20 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3.5 bg-[#242424] hover:bg-black text-[#FFCC33] text-xs font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Lançar</span>
              </button>
            </div>
          </form>

          {/* Categorias Rápidas do Cardápio Farah */}
          <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 shrink-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-[#FFCC33] text-[#242424] shadow-sm border border-[#FFCC33]'
                  : 'bg-white text-[#252525] border border-[#E7E2D8] hover:bg-stone-50'
              }`}
            >
              Cardápio Completo
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-[#FFCC33] text-[#242424] shadow-sm border border-[#FFCC33] font-black'
                    : 'bg-white text-[#252525] border border-[#E7E2D8] hover:bg-stone-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Grid de Itens do Cardápio para Toque Rápido */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredProducts.map((p) => {
              const isLowStock = p.currentStock <= p.minStock;
              return (
                <button
                  key={p.id}
                  onClick={() => addToCart(p, 1)}
                  className="bg-white hover:bg-stone-50 border border-[#E7E2D8] hover:border-[#FFCC33] p-3 rounded-xl text-left flex flex-col justify-between transition-all group shadow-sm active:scale-98"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6B6862] mb-1.5">
                      <span className="font-mono font-semibold bg-stone-100 px-1.5 py-0.5 rounded text-[#242424]">
                        {p.sku}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                        isLowStock ? 'bg-amber-100 text-[#D97706]' : 'bg-emerald-100 text-[#26734D]'
                      }`}>
                        Estoque: {p.currentStock}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#252525] group-hover:text-[#CF1020] line-clamp-2 leading-tight transition-colors">
                      {p.name}
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#E7E2D8] flex items-center justify-between">
                    <span className="text-[10px] text-[#6B6862] uppercase font-semibold">{p.unit}</span>
                    <span className="text-sm font-black text-[#242424] font-mono group-hover:text-[#CF1020] transition-colors">
                      R$ {p.salePrice.toFixed(2)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Comanda / Carrinho de Compras & Totais da Venda */}
        <div className="lg:col-span-5 flex flex-col bg-white overflow-hidden shadow-lg">
          {/* Header da Venda Atual */}
          <div className="p-3.5 bg-[#242424] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFCC33] flex items-center justify-center text-[#242424] font-black">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs uppercase font-black text-[#FFCC33] tracking-wider block">
                  Comanda / Pedido Atual
                </span>
                <div className="text-[11px] text-stone-300 font-mono">
                  {cart.length} {cart.length === 1 ? 'item lançado' : 'itens lançados'}
                </div>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Deseja realmente limpar toda a comanda atual?')) setCart([]);
                }}
                className="flex items-center gap-1 text-xs text-red-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-red-950/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="font-bold">Limpar (F9)</span>
              </button>
            )}
          </div>

          {/* Lista de Itens da Comanda */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#F6F5F1]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#6B6862] text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E7E2D8] flex items-center justify-center mb-3 shadow-sm">
                  <Receipt className="w-8 h-8 text-stone-400" />
                </div>
                <p className="text-sm font-bold text-[#252525]">Frente de Caixa Pronta</p>
                <p className="text-xs text-[#6B6862] mt-1 max-w-xs">
                  Selecione as esfihas, pizzas ou bebidas ao lado, ou passe o código de barras para lançar na comanda.
                </p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={item.product.id}
                  className="bg-white border border-[#E7E2D8] p-3 rounded-xl flex items-center justify-between text-xs shadow-sm hover:border-[#FFCC33] transition-colors"
                >
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#242424] text-[#FFCC33] font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-[#252525] text-xs">{item.product.name}</span>
                    </div>
                    <div className="text-[11px] text-[#6B6862] mt-1">
                      <span className="font-mono text-[#252525] font-semibold">R$ {item.unitPrice.toFixed(2)}</span> / {item.product.unit}
                    </div>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-stone-200 text-[#252525] rounded transition-colors"
                        title="Diminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono font-black text-[#252525] text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-stone-200 text-[#252525] rounded transition-colors"
                        title="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-20 text-right font-mono font-black text-[#252525] text-sm">
                      R$ {item.total.toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-[#B42318] p-1 transition-colors"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Painel de Totais e Fechamento com Tokens Oficiais Farah */}
          <div className="p-4 bg-[#242424] text-white border-t border-[#333333] space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} itens):</span>
                <span className="font-mono font-bold">R$ {subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#FFCC33] font-bold">
                  <span>Desconto ({discountPercent}%):</span>
                  <span className="font-mono">- R$ {discountTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Display do Total em Destaque */}
            <div className="bg-[#1A1A1A] border border-[#3D3D3D] p-3.5 rounded-xl flex items-center justify-between shadow-inner">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#FFCC33] font-black block">
                  Total da Comanda
                </span>
                <span className="text-[10px] text-stone-400">Tributos aprox. NFC-e: 28.45%</span>
              </div>
              <div className="text-3xl font-black text-[#FFCC33] font-mono tracking-tight">
                R$ {grandTotal.toFixed(2)}
              </div>
            </div>

            {/* Ações Inferiores */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                disabled={cart.length === 0}
                onClick={() => setShowDiscountModal(true)}
                className="py-2.5 px-3 bg-[#333333] hover:bg-[#3D3D3D] text-[#FFCC33] text-xs font-black rounded-xl border border-stone-600 flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Percent className="w-4 h-4" />
                <span>Desconto (F4)</span>
              </button>

              <button
                disabled={cart.length === 0 || !cashRegister || cashRegister.status !== 'ABERTO'}
                onClick={() => setShowPaymentModal(true)}
                className="py-2.5 px-3 bg-[#CF1020] hover:bg-[#B4101E] text-white text-xs font-black rounded-xl shadow-lg shadow-red-950/60 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>PAGAMENTO (F10)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Busca Rápida de Produtos (F2) */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#242424] text-white flex items-center justify-between">
              <h3 className="font-black text-sm flex items-center gap-2 text-[#FFCC33]">
                <Search className="w-4 h-4" />
                <span>Localizar Item no Cardápio (F2)</span>
              </h3>
              <button onClick={() => setShowSearchModal(false)} className="text-stone-300 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1]">
              <input
                type="text"
                autoFocus
                placeholder="Digite o nome (ex: Esfiha de Carne), código de barras ou SKU..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border border-[#E7E2D8] rounded-xl px-4 py-2.5 text-[#252525] text-sm focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-[#FFCC33]/30"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    addToCart(p, 1);
                    setShowSearchModal(false);
                  }}
                  className="p-3 bg-[#F6F5F1] hover:bg-amber-50/60 border border-[#E7E2D8] hover:border-[#FFCC33] rounded-xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div>
                    <div className="font-bold text-[#252525] text-xs">{p.name}</div>
                    <div className="text-[11px] text-[#6B6862] font-mono mt-0.5">
                      SKU: {p.sku} • Código: {p.barcode} • Estoque: {p.currentStock} {p.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-black text-[#CF1020] text-sm">
                      R$ {p.salePrice.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-[#6B6862] font-medium">Clique para adicionar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Desconto (F4) */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#242424] text-white flex items-center justify-between">
              <h3 className="font-black text-sm flex items-center gap-2 text-[#FFCC33]">
                <Percent className="w-4 h-4" />
                <span>Aplicar Desconto no Pedido</span>
              </h3>
              <button onClick={() => setShowDiscountModal(false)} className="text-stone-300 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-[#6B6862] font-bold block mb-1.5">Percentual de Desconto (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  autoFocus
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full bg-[#F6F5F1] border-2 border-[#E7E2D8] rounded-xl p-3 text-[#252525] font-mono font-black text-xl text-center focus:outline-none focus:border-[#FFCC33]"
                />
              </div>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((perc) => (
                  <button
                    key={perc}
                    type="button"
                    onClick={() => setDiscountPercent(perc)}
                    className="flex-1 py-1.5 bg-[#F6F5F1] hover:bg-stone-200 border border-[#E7E2D8] text-[#252525] rounded-lg text-xs font-bold font-mono transition-colors"
                  >
                    {perc}%
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="px-5 py-2.5 bg-[#242424] hover:bg-black text-[#FFCC33] text-xs font-black rounded-xl transition-colors shadow-sm"
                >
                  Confirmar Desconto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ajuda de Teclas de Atalho (F1) */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#242424] text-white flex items-center justify-between">
              <h3 className="font-black text-sm flex items-center gap-2 text-[#FFCC33]">
                <HelpCircle className="w-5 h-5" />
                <span>Teclas de Atalho do PDV Farah</span>
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-stone-300 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-2.5 text-xs bg-[#F6F5F1]">
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#E7E2D8] rounded-xl">
                <span className="text-[#252525] font-medium">Ajuda e Legenda</span>
                <kbd className="bg-[#FFCC33] text-[#242424] px-2 py-0.5 rounded font-black font-mono">F1</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#E7E2D8] rounded-xl">
                <span className="text-[#252525] font-medium">Localizar Produto / Cardápio</span>
                <kbd className="bg-[#333333] text-[#FFCC33] px-2 py-0.5 rounded font-black font-mono">F2</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#E7E2D8] rounded-xl">
                <span className="text-[#252525] font-medium">Aplicar Desconto no Pedido</span>
                <kbd className="bg-[#333333] text-[#FFCC33] px-2 py-0.5 rounded font-black font-mono">F4</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#E7E2D8] rounded-xl">
                <span className="text-[#252525] font-medium">Sangria / Suprimento de Caixa</span>
                <kbd className="bg-[#242424] text-white px-2 py-0.5 rounded font-black font-mono">F7</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white border border-[#E7E2D8] rounded-xl">
                <span className="text-[#252525] font-medium">Abertura e Fechamento de Caixa</span>
                <kbd className="bg-[#242424] text-white px-2 py-0.5 rounded font-black font-mono">F8</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-red-50 border border-red-200 rounded-xl text-[#B42318] font-bold">
                <span>Cancelar Pedido Atual</span>
                <kbd className="bg-[#B42318] text-white px-2 py-0.5 rounded font-black font-mono">F9</kbd>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-white font-bold">
                <span>Finalizar Pedido / Pagamento</span>
                <kbd className="bg-[#CF1020] text-white px-2 py-0.5 rounded font-black font-mono">F10</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <PaymentModal
          cart={cart}
          subtotal={subtotal}
          discountTotal={discountTotal}
          additionTotal={additionTotal}
          total={grandTotal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={(sale, invoice) => {
            setShowPaymentModal(false);
            setCart([]);
            setDiscountPercent(0);
            setProducts(StorageService.getProducts()); // atualizar estoque visual
            setCompletedSale({ sale, invoice });
          }}
        />
      )}

      {/* Modal de Cupom Térmico NFC-e Concluído */}
      {completedSale && (
        <ThermalReceiptModal
          sale={completedSale.sale}
          invoice={completedSale.invoice}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
};
