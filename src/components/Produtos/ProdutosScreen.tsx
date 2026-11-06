import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Barcode,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Product, Category, Brand } from '../../types';
import { StorageService } from '../../services/storage';

export const ProdutosScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts());
  const categories = StorageService.getCategories();
  const brands = StorageService.getBrands();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'NORMAL'>('ALL');

  // Modal de Cadastro/Edição
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formBrandId, setFormBrandId] = useState(brands[0]?.id || '');
  const [formCostPrice, setFormCostPrice] = useState<number>(0);
  const [formSalePrice, setFormSalePrice] = useState<number>(0);
  const [formCurrentStock, setFormCurrentStock] = useState<number>(10);
  const [formMinStock, setFormMinStock] = useState<number>(5);
  const [formUnit, setFormUnit] = useState('UN');
  const [formNcm, setFormNcm] = useState('1902.20.00');
  const [formCfop, setFormCfop] = useState('5.102');
  const [formCstCsosn, setFormCstCsosn] = useState('0102');
  const [formIcms, setFormIcms] = useState<number>(12.0);
  const [formPis, setFormPis] = useState<number>(1.65);
  const [formCofins, setFormCofins] = useState<number>(7.60);
  const [formDescription, setFormDescription] = useState('');

  const refreshProducts = () => {
    setProducts(StorageService.getProducts());
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku('ESF-' + Math.floor(100 + Math.random() * 900));
    setFormBarcode('7891' + Math.floor(100000000 + Math.random() * 900000000));
    setFormCategoryId(categories[0]?.id || '');
    setFormBrandId(brands[0]?.id || '');
    setFormCostPrice(3.0);
    setFormSalePrice(8.0);
    setFormCurrentStock(50);
    setFormMinStock(15);
    setFormUnit('UN');
    setFormNcm('1902.20.00');
    setFormCfop('5.102');
    setFormCstCsosn('0102');
    setFormIcms(12.0);
    setFormPis(1.65);
    setFormCofins(7.60);
    setFormDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBarcode(p.barcode);
    setFormCategoryId(p.categoryId);
    setFormBrandId(p.brandId || brands[0]?.id || '');
    setFormCostPrice(p.costPrice);
    setFormSalePrice(p.salePrice);
    setFormCurrentStock(p.currentStock);
    setFormMinStock(p.minStock);
    setFormUnit(p.unit);
    setFormNcm(p.ncm);
    setFormCfop(p.cfop);
    setFormCstCsosn(p.cstCsosn);
    setFormIcms(p.icmsAliquota);
    setFormPis(p.pisAliquota);
    setFormCofins(p.cofinsAliquota);
    setFormDescription(p.description || '');
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const margin = formCostPrice > 0 ? ((formSalePrice - formCostPrice) / formCostPrice) * 100 : 0;
    const selectedCategory = categories.find(c => c.id === formCategoryId);
    const selectedBrand = brands.find(b => b.id === formBrandId);

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formName,
      sku: formSku,
      barcode: formBarcode,
      categoryId: formCategoryId,
      categoryName: selectedCategory?.name || 'Geral',
      brandId: formBrandId,
      brandName: selectedBrand?.name || 'Farah Artesanal',
      costPrice: formCostPrice,
      salePrice: formSalePrice,
      marginPercent: margin,
      currentStock: formCurrentStock,
      minStock: formMinStock,
      unit: formUnit,
      active: true,
      ncm: formNcm,
      cfop: formCfop,
      cstCsosn: formCstCsosn,
      icmsAliquota: formIcms,
      pisAliquota: formPis,
      cofinsAliquota: formCofins,
      description: formDescription,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
    };

    StorageService.saveProduct(productData);
    refreshProducts();
    setShowModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Deseja realmente remover este item do cardápio?')) {
      StorageService.deleteProduct(id);
      refreshProducts();
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cardapio_farah_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    const isLow = p.currentStock <= p.minStock;
    const matchStock = stockFilter === 'ALL' || (stockFilter === 'LOW' ? isLow : !isLow);
    return matchSearch && matchCat && matchStock;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#CF1020]" />
              <span>Cardápio & Gestão de Produtos — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Cadastro de esfihas, pizzas, porções, bebidas, precificação, fichas técnicas e tributos (NCM/CFOP/ICMS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-[#FFFFFF] hover:bg-stone-50 text-[#242424] text-xs font-semibold rounded-xl border border-[#E7E2D8] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#242424]" />
            <span>Exportar Cardápio</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shadow-red-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Item do Cardápio</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-4 rounded-2xl flex flex-wrap items-center gap-3 shadow-sm">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-[#6B6862] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por sabor, código de barras EAN ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl pl-10 pr-4 py-2 text-xs text-[#252525] placeholder-[#6B6862] focus:outline-none focus:border-[#FFCC33]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-[#242424] font-medium focus:outline-none focus:border-[#FFCC33]"
          >
            <option value="ALL">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-[#242424] font-medium focus:outline-none focus:border-[#FFCC33]"
          >
            <option value="ALL">Status do Estoque (Todos)</option>
            <option value="LOW">Estoque Baixo / Reposição</option>
            <option value="NORMAL">Estoque Regular</option>
          </select>
        </div>
      </div>

      {/* Tabela de Produtos em Fundo Branco Limpo */}
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] bg-[#F6F5F1] text-[#6B6862] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item & Referência</th>
                <th className="py-3 px-4">Código EAN</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-right">Custo</th>
                <th className="py-3 px-4 text-right">Preço Venda</th>
                <th className="py-3 px-4 text-right">Margem</th>
                <th className="py-3 px-4 text-center">Estoque</th>
                <th className="py-3 px-4">Tributos (NCM/CFOP)</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {filtered.map((p) => {
                const isLowStock = p.currentStock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#242424] text-xs">{p.name}</div>
                      <div className="text-[10px] text-[#6B6862] font-mono">SKU: {p.sku} • {p.unit}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B6862]">
                      <span className="flex items-center gap-1">
                        <Barcode className="w-3.5 h-3.5 text-stone-400" />
                        {p.barcode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#F6F5F1] text-[#242424] font-medium px-2 py-0.5 rounded text-[10px] border border-[#E7E2D8]">
                        {p.categoryName || 'Geral'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#6B6862]">
                      R$ {p.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#CF1020] text-sm">
                      R$ {p.salePrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#26734D]">
                      {p.marginPercent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          isLowStock
                            ? 'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30'
                            : 'bg-[#26734D]/15 text-[#26734D]'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#6B6862] font-mono text-[10px]">
                      NCM: {p.ncm} • CFOP: {p.cfop}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-[#FFCC33]/20 text-[#242424] rounded transition-colors cursor-pointer"
                          title="Editar Item"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#242424]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 hover:bg-[#CF1020]/15 text-[#CF1020] rounded transition-colors cursor-pointer"
                          title="Excluir Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#FFCC33]" />
                <span>{editingProduct ? 'Editar Item do Cardápio' : 'Novo Item do Cardápio Farah'}</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#242424] font-semibold block mb-1">
                    Nome / Descrição Comercial do Item *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Esfiha Aberta de Carne com Limão"
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Código de Barras (EAN-13) *</label>
                  <input
                    type="text"
                    required
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="789..."
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Código SKU / Referência *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="ESF-001"
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Categoria:</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Marca / Linha:</label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seção Financeira e Estoque */}
              <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg p-2 text-xs text-[#242424] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#242424] font-bold block mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FFFFFF] border-2 border-[#CF1020] rounded-lg p-2 text-xs text-[#CF1020] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formCurrentStock}
                    onChange={(e) => setFormCurrentStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg p-2 text-xs text-[#242424] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg p-2 text-xs text-[#242424] font-mono"
                  />
                </div>
              </div>

              {/* Seção Fiscal (NFC-e / SPED) */}
              <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E7E2D8] space-y-3">
                <span className="text-xs font-bold text-[#242424] block">Parâmetros Fiscais (NFC-e / S@T)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-[#6B6862] block mb-1">NCM</label>
                    <input
                      type="text"
                      required
                      value={formNcm}
                      onChange={(e) => setFormNcm(e.target.value)}
                      className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded p-1.5 text-xs font-mono text-[#242424]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B6862] block mb-1">CFOP</label>
                    <input
                      type="text"
                      required
                      value={formCfop}
                      onChange={(e) => setFormCfop(e.target.value)}
                      className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded p-1.5 text-xs font-mono text-[#242424]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B6862] block mb-1">CST / CSOSN</label>
                    <input
                      type="text"
                      required
                      value={formCstCsosn}
                      onChange={(e) => setFormCstCsosn(e.target.value)}
                      className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded p-1.5 text-xs font-mono text-[#242424]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6B6862] block mb-1">Alíquota ICMS (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formIcms}
                      onChange={(e) => setFormIcms(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded p-1.5 text-xs font-mono text-[#242424]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Descrição Comercial e Ingredientes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva a composição, ingredientes e observações de preparo..."
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar no Cardápio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
