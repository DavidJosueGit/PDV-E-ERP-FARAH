import React, { useState, useEffect } from 'react';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronDown,
  ShoppingCart,
  LogOut
} from 'lucide-react';
import { User, CashRegister, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { FarahLogo } from './Common/FarahLogo';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  cashRegister: CashRegister | null;
  onOpenCashModal: () => void;
  onRefresh: () => void;
  onNavigateToPdv?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  cashRegister,
  onOpenCashModal,
  onRefresh,
  onNavigateToPdv,
  onLogout,
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const users = StorageService.getUsers();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResetData = () => {
    if (confirm('Deseja restaurar a base da Farah Esfiharia & Pizzaria para os dados originais?')) {
      StorageService.resetDatabase();
      onRefresh();
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-700/50">
            ADMIN GERAL
          </span>
        );
      case 'GERENTE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/50">
            GERENTE DE TURNO
          </span>
        );
      case 'OPERADOR_CAIXA':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-300 border border-yellow-700/50">
            OPERADOR DE CAIXA
          </span>
        );
      case 'ESTOQUISTA':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-600">
            COZINHA & ESTOQUE
          </span>
        );
    }
  };

  return (
    <header className="bg-[#242424] border-b border-stone-800 text-stone-100 px-4 py-2.5 flex items-center justify-between shadow-md select-none sticky top-0 z-40">
      {/* Esquerda: Identidade Visual Oficial Farah */}
      <div className="flex items-center gap-3">
        <FarahLogo size="sm" showText={false} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black tracking-wider text-base uppercase text-[#CF1020]">
              FARAH
            </span>
            <span className="text-sm font-semibold tracking-wide text-stone-200">
              Esfiharia & Pizzaria
            </span>
            <span className="bg-[#FFCC33] text-[#242424] text-[10px] font-black px-1.5 py-0.2 rounded font-mono">
              ERP & PDV
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Building2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Matriz Gastronômica • CNPJ 12.345.678/0001-90</span>
          </div>
        </div>
      </div>

      {/* Direita: Ações, Caixa, Relógio e Usuário */}
      <div className="flex items-center gap-3">
        {/* Acesso em Destaque à Frente de Caixa */}
        {onNavigateToPdv && (
          <button
            onClick={onNavigateToPdv}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#CF1020] hover:bg-[#b00e1b] text-white shadow-md shadow-red-950/40 border border-red-500/30 cursor-pointer"
            title="Ir para Frente de Caixa (PDV) [F2]"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>Frente de Caixa (PDV)</span>
            <span className="text-[10px] bg-[#FFCC33] text-[#242424] font-black px-1.5 py-0.5 rounded font-mono">
              F2
            </span>
          </button>
        )}

        {/* Status do Caixa */}
        <button
          onClick={onOpenCashModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
            cashRegister && cashRegister.status === 'ABERTO'
              ? 'bg-[#26734D]/20 border-[#26734D]/50 text-emerald-300 hover:bg-[#26734D]/30'
              : 'bg-[#CF1020]/20 border-[#CF1020]/40 text-red-300 hover:bg-[#CF1020]/30'
          }`}
          title="Gerenciar abertura e fechamento de caixa"
        >
          {cashRegister && cashRegister.status === 'ABERTO' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>CAIXA #{cashRegister.terminalNumber} ABERTO (R$ {cashRegister.currentBalance.toFixed(2)})</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-[#CF1020]" />
              <span>CAIXA FECHADO - ABRIR TURNO</span>
            </>
          )}
        </button>

        {/* Relógio Operacional */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-300 bg-stone-900/80 px-2.5 py-1.5 rounded-lg border border-stone-800 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#FFCC33]" />
          <span>{time}</span>
        </div>

        {/* Alternador de Perfil / Usuário */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-850 border border-stone-700 px-3 py-1.5 rounded-lg transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#FFCC33] text-[#242424] flex items-center justify-center font-black text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-stone-200">{currentUser.name.split(' ')[0]}</div>
              <div>{getRoleBadge(currentUser.role)}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#242424] border border-stone-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-2 border-b border-stone-800">
                <p className="text-[11px] text-[#FFCC33] uppercase tracking-wider font-bold">Alternar Operador / Perfil</p>
                <p className="text-xs text-stone-400">Controle de acesso por cargo:</p>
              </div>
              <div className="p-1 space-y-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onUserChange(u);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex flex-col gap-1 transition-colors cursor-pointer ${
                      currentUser.id === u.id
                        ? 'bg-stone-800 text-[#FFCC33] border border-[#FFCC33]/30'
                        : 'text-stone-300 hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{u.name}</span>
                      {getRoleBadge(u.role)}
                    </div>
                    <span className="text-[10px] text-stone-400">{u.email}</span>
                  </button>
                ))}
              </div>

              {onLogout && (
                <div className="p-1 border-t border-stone-800 mt-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Encerrar Sessão (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Restaurar Dados de Demonstração */}
        <button
          onClick={handleResetData}
          className="p-1.5 text-stone-400 hover:text-[#FFCC33] hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title="Restaurar Cardápio e Dados Padrão da Farah"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
