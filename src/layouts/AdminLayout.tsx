import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar, ActiveTab } from '../components/Sidebar';
import { ProdutosScreen } from '../components/Produtos/ProdutosScreen';
import { EstoqueScreen } from '../components/Estoque/EstoqueScreen';
import { CaixaScreen } from '../components/Caixa/CaixaScreen';
import { CaixaModal, SangriaSuprimentoModal } from '../components/Caixa/CaixaModal';
import { TefScreen } from '../components/TEF/TefScreen';
import { FiscalScreen } from '../components/Fiscal/FiscalScreen';
import { ClientesScreen } from '../components/Clientes/ClientesScreen';
import { FinanceiroScreen } from '../components/Financeiro/FinanceiroScreen';
import { DashboardScreen } from '../components/Dashboard/DashboardScreen';
import { UsuariosScreen } from '../components/Usuarios/UsuariosScreen';
import { JavaSwaggerScreen } from '../components/JavaSwagger/JavaSwaggerScreen';
import { User, CashRegister } from '../types';

interface AdminLayoutProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  cashRegister: CashRegister | null;
  onRefresh: () => void;
  onNavigateToPdv: () => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onUserChange,
  cashRegister,
  onRefresh,
  onNavigateToPdv,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('relatorios');
  const [showCaixaModal, setShowCaixaModal] = useState<boolean>(false);
  const [showSangriaModal, setShowSangriaModal] = useState<boolean>(false);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'pdv') {
      onNavigateToPdv();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F6F5F1] text-[#252525] overflow-hidden font-sans">
      {/* Top Navbar Administrativo */}
      <Navbar
        currentUser={currentUser}
        onUserChange={onUserChange}
        cashRegister={cashRegister}
        onOpenCashModal={() => setShowCaixaModal(true)}
        onRefresh={onRefresh}
        onNavigateToPdv={onNavigateToPdv}
        onLogout={onLogout}
      />

      {/* Main Layout com Barra Lateral e Conteúdo do ERP */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Administrativo */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={currentUser.role}
        />

        {/* Dynamic Main Workspace Administrativo */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#F6F5F1] text-[#252525]">
          {activeTab === 'relatorios' && <DashboardScreen />}
          {activeTab === 'produtos' && <ProdutosScreen />}
          {activeTab === 'estoque' && <EstoqueScreen />}
          {activeTab === 'caixa' && (
            <CaixaScreen
              onOpenCaixaModal={() => setShowCaixaModal(true)}
              onOpenSangriaModal={() => setShowSangriaModal(true)}
            />
          )}
          {activeTab === 'tef' && <TefScreen />}
          {activeTab === 'fiscal' && <FiscalScreen />}
          {activeTab === 'clientes' && <ClientesScreen />}
          {activeTab === 'financeiro' && <FinanceiroScreen />}
          {activeTab === 'usuarios' && <UsuariosScreen />}
          {activeTab === 'java_swagger' && <JavaSwaggerScreen />}
        </main>
      </div>

      {/* Modais de Caixa e Sangria disponíveis para o Administrador */}
      {showCaixaModal && (
        <CaixaModal
          cashRegister={cashRegister}
          onClose={() => setShowCaixaModal(false)}
          onUpdated={onRefresh}
        />
      )}

      {showSangriaModal && cashRegister && (
        <SangriaSuprimentoModal
          cashRegister={cashRegister}
          onClose={() => setShowSangriaModal(false)}
          onUpdated={onRefresh}
        />
      )}
    </div>
  );
};
