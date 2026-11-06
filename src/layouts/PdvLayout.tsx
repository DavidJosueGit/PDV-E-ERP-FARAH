import React, { useState, useEffect } from 'react';
import { PdvHeader } from '../components/PDV/PdvHeader';
import { PdvScreen } from '../components/PDV/PdvScreen';
import { CaixaModal, SangriaSuprimentoModal } from '../components/Caixa/CaixaModal';
import { ManagerAuthModal } from '../components/Auth/ManagerAuthModal';
import { QuickOperatorPinModal } from '../components/Auth/QuickOperatorPinModal';
import { User, CashRegister } from '../types';

interface PdvLayoutProps {
  currentUser: User;
  cashRegister: CashRegister | null;
  showCaixaModal: boolean;
  setShowCaixaModal: (show: boolean) => void;
  showSangriaModal: boolean;
  setShowSangriaModal: (show: boolean) => void;
  showManagerAuthModal: boolean;
  setShowManagerAuthModal: (show: boolean) => void;
  onAdminAuthorized: () => void;
  onRefresh: () => void;
  onUserChange?: (user: User) => void;
  onLogout?: () => void;
}

export const PdvLayout: React.FC<PdvLayoutProps> = ({
  currentUser,
  cashRegister,
  showCaixaModal,
  setShowCaixaModal,
  showSangriaModal,
  setShowSangriaModal,
  showManagerAuthModal,
  setShowManagerAuthModal,
  onAdminAuthorized,
  onRefresh,
  onUserChange,
  onLogout,
}) => {
  const [showOperatorModal, setShowOperatorModal] = useState<boolean>(false);

  // Tecla F11 para troca rápida de operador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setShowOperatorModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOperatorChanged = (newOperator: User) => {
    if (onUserChange) {
      onUserChange(newOperator);
    }
    onRefresh();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#242424] text-[#252525] overflow-hidden font-sans">
      {/* Cabeçalho Exclusivo e Focado do PDV (Sem menus administrativos) */}
      <PdvHeader
        currentUser={currentUser}
        cashRegister={cashRegister}
        onOpenCashModal={() => setShowCaixaModal(true)}
        onOpenSangriaModal={() => setShowSangriaModal(true)}
        onRequestAdminAccess={() => setShowManagerAuthModal(true)}
        onSwitchOperator={() => setShowOperatorModal(true)}
        onLogout={onLogout}
      />

      {/* Área Principal de Vendas em Tela Cheia */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <PdvScreen
          cashRegister={cashRegister}
          onOpenCashModal={() => setShowCaixaModal(true)}
          onOpenSangriaModal={() => setShowSangriaModal(true)}
        />
      </main>

      {/* Modal de Abertura / Fechamento de Caixa */}
      {showCaixaModal && (
        <CaixaModal
          cashRegister={cashRegister}
          onClose={() => setShowCaixaModal(false)}
          onUpdated={onRefresh}
        />
      )}

      {/* Modal de Sangria e Suprimento com Autorização */}
      {showSangriaModal && cashRegister && (
        <SangriaSuprimentoModal
          cashRegister={cashRegister}
          onClose={() => setShowSangriaModal(false)}
          onUpdated={onRefresh}
        />
      )}

      {/* Modal de Autenticação Gerencial para Saída para o Admin */}
      <ManagerAuthModal
        isOpen={showManagerAuthModal}
        onClose={() => setShowManagerAuthModal(false)}
        onSuccess={onAdminAuthorized}
        title="Liberação de Acesso ao Painel Admin"
        description="Atenção: A transição da Frente de Caixa para a área de Gestão Administrativa exige a confirmação de senha de um Gerente ou Administrador."
      />

      {/* Modal de Troca Rápida de Operador com PIN */}
      <QuickOperatorPinModal
        isOpen={showOperatorModal}
        onClose={() => setShowOperatorModal(false)}
        onSuccess={handleOperatorChanged}
        currentUserId={currentUser.id}
      />
    </div>
  );
};
