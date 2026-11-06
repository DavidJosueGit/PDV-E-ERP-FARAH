import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Clock,
  Lock,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  ShieldAlert,
  UserCheck,
  LogOut,
  KeyRound
} from 'lucide-react';
import { User as UserType, CashRegister } from '../../types';
import { FarahLogo } from '../Common/FarahLogo';

interface PdvHeaderProps {
  currentUser: UserType;
  cashRegister: CashRegister | null;
  onOpenCashModal: () => void;
  onOpenSangriaModal: () => void;
  onRequestAdminAccess: () => void;
  onSwitchOperator?: () => void;
  onLogout?: () => void;
}

export const PdvHeader: React.FC<PdvHeaderProps> = ({
  currentUser,
  cashRegister,
  onOpenCashModal,
  onOpenSangriaModal,
  onRequestAdminAccess,
  onSwitchOperator,
  onLogout,
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCashOpen = cashRegister && cashRegister.status === 'ABERTO';

  return (
    <header className="bg-[#242424] border-b border-stone-800 px-4 py-2.5 flex items-center justify-between text-stone-200 select-none shrink-0 shadow-md">
      {/* Esquerda: Identificação do Terminal e Marca Farah */}
      <div className="flex items-center gap-3">
        <FarahLogo size="sm" showText={false} />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-xl">
            <Monitor className="w-3.5 h-3.5 text-[#FFCC33]" />
            <span className="text-xs font-black tracking-wide text-white font-mono">
              FARAH <span className="text-[#FFCC33]">PDV</span>
            </span>
            <span className="text-[10px] bg-[#FFCC33] text-[#242424] px-1.5 py-0.2 rounded font-mono font-black">
              CX-01
            </span>
          </div>

          {/* Status do Turno de Caixa */}
          <div className="flex items-center gap-2">
            {isCashOpen ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#26734D]/20 border border-[#26734D]/40 rounded-lg text-xs">
                <span className="w-2 h-2 rounded-full bg-[#26734D] animate-pulse"></span>
                <span className="text-emerald-300 font-bold text-[11px]">Turno Aberto</span>
                <span className="text-stone-400 text-[10px] font-mono hidden md:inline">
                  (Início: {new Date(cashRegister.openedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#CF1020]/20 border border-[#CF1020]/40 rounded-lg text-xs">
                <span className="w-2 h-2 rounded-full bg-[#CF1020]"></span>
                <span className="text-red-300 font-bold text-[11px]">Caixa Fechado</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centro: Relógio Operacional & Ações de Sangria / Caixa */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 border border-stone-800 rounded-lg text-xs font-mono text-stone-300">
          <Clock className="w-3.5 h-3.5 text-[#FFCC33]" />
          <span>{time}</span>
        </div>

        {/* Botão de Sangria & Suprimento */}
        <button
          onClick={onOpenSangriaModal}
          className="px-2.5 py-1.5 bg-stone-850 hover:bg-stone-800 border border-stone-700 rounded-lg text-xs font-semibold text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Realizar Sangria ou Suprimento no Caixa (F7)"
        >
          <ArrowDownRight className="w-3.5 h-3.5 text-[#CF1020]" />
          <span className="hidden md:inline">Sangria</span>
          <span className="text-[10px] text-[#FFCC33] font-mono font-bold">(F7)</span>
        </button>

        {/* Botão de Controle de Turno/Caixa */}
        <button
          onClick={onOpenCashModal}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isCashOpen
              ? 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-700'
              : 'bg-[#26734D] hover:bg-[#1f5d3e] text-white shadow-md animate-pulse'
          }`}
          title="Abertura ou Fechamento de Caixa (F8)"
        >
          <Banknote className="w-3.5 h-3.5 text-[#FFCC33]" />
          <span>{isCashOpen ? 'Fechar / Gerenciar Caixa' : 'Abrir Caixa'}</span>
          <span className="text-[10px] text-stone-400 font-mono">(F8)</span>
        </button>
      </div>

      {/* Direita: Operador Ativo, Troca Rápida e Botão com Trava Gerencial */}
      <div className="flex items-center gap-2.5">
        {/* Operador de Caixa com ação de troca rápida */}
        <button
          onClick={onSwitchOperator}
          className="flex items-center gap-2 px-2.5 py-1 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-700 text-xs transition-colors cursor-pointer group"
          title="Trocar Operador de Caixa (F11)"
        >
          <div className="w-6 h-6 rounded-lg bg-[#FFCC33] text-[#242424] font-black flex items-center justify-center text-[10px]">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-left hidden lg:block">
            <div className="font-bold text-stone-100 leading-tight text-[11px] truncate max-w-[110px]">
              {currentUser.name}
            </div>
            <div className="text-[9px] text-[#FFCC33] leading-none font-semibold flex items-center gap-1">
              <span>Operador</span>
              <span className="text-[8px] bg-stone-800 text-stone-300 px-1 py-0.2 rounded font-mono">F11</span>
            </div>
          </div>
        </button>

        {/* Botão Sair / Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 bg-stone-900 hover:bg-red-950/60 hover:text-red-300 text-stone-400 border border-stone-800 hover:border-red-800/50 rounded-xl text-xs transition-colors cursor-pointer"
            title="Encerrar Sessão e Voltar para Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

        {/* Botão de Retorno Protegido ao Painel Administrativo */}
        <button
          onClick={onRequestAdminAccess}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group"
          title="Sair do Caixa e Acessar o Painel de Gestão (Exige Senha de Gerente) [F2]"
        >
          <Lock className="w-3.5 h-3.5 text-[#FFCC33] group-hover:scale-110 transition-transform" />
          <span>Sair para Admin</span>
          <span className="text-[9px] bg-[#CF1020] text-white px-1.5 py-0.2 rounded font-mono font-bold">
            SENHA
          </span>
        </button>
      </div>
    </header>
  );
};
