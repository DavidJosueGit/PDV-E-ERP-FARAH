import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, UserCheck, X, CheckCircle2, AlertCircle, Keyboard } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth';
import { User } from '../../types';

interface QuickOperatorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOperator: User) => void;
  currentUserId?: string;
}

export const QuickOperatorPinModal: React.FC<QuickOperatorPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUserId,
}) => {
  const users = StorageService.getUsers().filter(u => u.active);
  const operators = users.filter(u => u.role === 'OPERADOR_CAIXA' || u.role === 'GERENTE' || u.role === 'ADMIN');

  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUserId || operators[0]?.id || ''
  );
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, selectedUserId]);

  if (!isOpen) return null;

  const handleConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedUserId) {
      setError('Selecione um operador.');
      return;
    }
    if (!pin || pin.length < 4) {
      setError('Digite o PIN de 4 dígitos no teclado.');
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await AuthService.loginWithPin(selectedUserId, pin);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'PIN incorreto.');
        setPin('');
        inputRef.current?.focus();
      }
    } catch (e: any) {
      setError('Erro ao validar operador: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#242424] text-white flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFCC33] text-[#242424] flex items-center justify-center font-black">
              <KeyRound className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Trocar Operador de Caixa</h3>
              <p className="text-[10px] text-[#FFCC33] font-bold">Identificação Rápida via Teclado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4 bg-[#F6F5F1]">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#B42318] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#252525] block mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#CF1020]" />
              <span>Operador:</span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setPin('');
                setError('');
                inputRef.current?.focus();
              }}
              className="w-full px-3 py-2 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#252525] font-semibold focus:outline-none focus:border-[#FFCC33]"
            >
              {operators.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'OPERADOR_CAIXA' ? 'Operador' : u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Input Direto de PIN com Teclado Físico */}
          <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 text-center space-y-2">
            <span className="text-[11px] font-bold text-[#6B6862] flex items-center justify-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-[#CF1020]" />
              <span>Digite o PIN no seu teclado e tecle ENTER:</span>
            </span>
            <div className="max-w-[180px] mx-auto">
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={6}
                autoFocus
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPin(val);
                  setError('');
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] font-mono font-black text-xl py-2.5 px-3 bg-[#F6F5F1] border-2 border-[#E7E2D8] rounded-xl text-[#252525] focus:outline-none focus:border-[#FFCC33] focus:ring-4 focus:ring-[#FFCC33]/20 shadow-inner"
              />
            </div>
            <p className="text-[10px] text-stone-500">PIN padrão: 1234</p>
          </div>

          {/* Ações */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white hover:bg-stone-100 border border-[#E7E2D8] text-[#252525] rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="flex-1 py-2.5 bg-[#CF1020] hover:bg-[#B4101E] disabled:opacity-40 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
