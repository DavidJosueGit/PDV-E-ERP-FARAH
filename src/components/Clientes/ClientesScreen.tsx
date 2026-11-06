import React, { useState } from 'react';
import {
  Users,
  Building2,
  Plus,
  Search,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Customer, Supplier } from '../../types';

export const ClientesScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(StorageService.getCustomers());
  const [suppliers, setSuppliers] = useState<Supplier[]>(StorageService.getSuppliers());
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'FORNECEDORES'>('CLIENTES');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Form Cliente
  const [custName, setCustName] = useState('');
  const [custCpf, setCustCpf] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('São Paulo');
  const [custState, setCustState] = useState('SP');
  const [custCreditLimit, setCustCreditLimit] = useState<number>(2000);

  // Form Fornecedor
  const [supCorpName, setSupCorpName] = useState('');
  const [supTradeName, setSupTradeName] = useState('');
  const [supCnpj, setSupCnpj] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supCategory, setSupCategory] = useState('Farinhas e Grãos');

  const refreshData = () => {
    setCustomers(StorageService.getCustomers());
    setSuppliers(StorageService.getSuppliers());
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      name: custName,
      cpfCnpj: custCpf,
      email: custEmail,
      phone: custPhone,
      address: custAddress,
      city: custCity,
      state: custState,
      creditLimit: custCreditLimit,
      creditUsed: 0,
      totalPurchases: 0,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveCustomer(newCustomer);
    refreshData();
    setShowCustomerModal(false);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: 'sup-' + Date.now(),
      corporateName: supCorpName,
      tradeName: supTradeName,
      cnpj: supCnpj,
      email: supEmail,
      phone: supPhone,
      contactPerson: supContact,
      category: supCategory,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveSupplier(newSupplier);
    refreshData();
    setShowSupplierModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#242424]" />
              <span>Clientes & Fornecedores — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Cadastro de clientes para entregas, convênios de crediário e fornecedores de insumos gastronômicos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FFFFFF] border border-[#E7E2D8] p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('CLIENTES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'CLIENTES'
                  ? 'bg-[#CF1020] text-white shadow-xs'
                  : 'text-[#6B6862] hover:text-[#242424]'
              }`}
            >
              Clientes ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('FORNECEDORES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'FORNECEDORES'
                  ? 'bg-[#CF1020] text-white shadow-xs'
                  : 'text-[#6B6862] hover:text-[#242424]'
              }`}
            >
              Fornecedores ({suppliers.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'CLIENTES') setShowCustomerModal(true);
              else setShowSupplierModal(true);
            }}
            className="px-4 py-2 bg-[#242424] hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FFCC33]" />
            <span>Novo {activeTab === 'CLIENTES' ? 'Cliente' : 'Fornecedor'}</span>
          </button>
        </div>
      </div>

      {/* Lista de Clientes */}
      {activeTab === 'CLIENTES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((c) => (
            <div key={c.id} className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#242424] text-sm">{c.name}</h3>
                  <div className="text-xs text-[#6B6862] font-mono mt-0.5">CPF/CNPJ: {c.cpfCnpj}</div>
                </div>
                <span className="bg-[#26734D]/15 text-[#26734D] text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  CLIENTE ATIVO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#242424] bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8]">
                <div>
                  <span className="text-[10px] text-[#6B6862] block font-semibold">Limite de Crediário:</span>
                  <span className="font-mono font-bold text-[#26734D]">R$ {c.creditLimit.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6862] block font-semibold">Crédito Utilizado:</span>
                  <span className="font-mono font-bold text-[#CF1020]">R$ {c.creditUsed.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#6B6862] pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#242424]" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#242424]" />
                  <span>{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#242424]" />
                  <span>{c.address} • {c.city}/{c.state}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Lista de Fornecedores */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#242424] text-sm">{s.tradeName}</h3>
                  <div className="text-xs text-[#6B6862] font-mono mt-0.5">{s.corporateName}</div>
                </div>
                <span className="bg-[#FFCC33]/25 text-[#242424] text-[10px] px-2 py-0.5 rounded font-bold border border-[#FFCC33]">
                  {s.category}
                </span>
              </div>

              <div className="text-xs text-[#6B6862] font-mono bg-[#F6F5F1] p-2.5 rounded-xl border border-[#E7E2D8]">
                CNPJ: {s.cnpj} • Contato: <strong className="text-[#242424]">{s.contactPerson}</strong>
              </div>

              <div className="space-y-1 text-xs text-[#6B6862] pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#242424]" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#242424]" />
                  <span>{s.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo Cliente */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FFCC33]" />
                <span>Novo Cadastro de Cliente</span>
              </h2>
              <button onClick={() => setShowCustomerModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[#242424] font-semibold block mb-1">Nome Completo / Razão Social *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">CPF ou CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={custCpf}
                    onChange={(e) => setCustCpf(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">E-mail</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                />
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Endereço de Entrega</label>
                <input
                  type="text"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Fornecedor */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#FFCC33]" />
                <span>Novo Fornecedor de Alimentos / Insumos</span>
              </h2>
              <button onClick={() => setShowSupplierModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-[#242424] font-semibold block mb-1">Nome Fantasia *</label>
                <input
                  type="text"
                  required
                  value={supTradeName}
                  onChange={(e) => setSupTradeName(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                />
              </div>

              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Razão Social *</label>
                <input
                  type="text"
                  required
                  value={supCorpName}
                  onChange={(e) => setSupCorpName(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={supCnpj}
                    onChange={(e) => setSupCnpj(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Categoria de Fornecimento</label>
                  <input
                    type="text"
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CF1020] hover:bg-[#b00e1b] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
