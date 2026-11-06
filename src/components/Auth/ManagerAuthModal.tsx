import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound, UserCheck } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface ManagerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const ManagerAuthModal: React.FC<ManagerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Autenticação da Gerência Obrigatória',
  description = 'Para acessar o Painel Administrativo e sair da Frente de Caixa, informe a senha de um gerente ou administrador autorizador.'
}) => {
  const managers = StorageService.getManagers();
  const currentUser = StorageService.getCurrentUser();

  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    managers[0]?.id || ''
  );
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Por favor, digite a senha da gerência.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      // Validação oficial de gerente do StorageService
      const result = StorageService.validateManagerPassword(password, selectedManagerId);

      if (result.valid) {
        StorageService.logAction(
          result.manager || currentUser,
          'ACESSO_PAINEL_ADMIN',
          'SISTEMA',
          `Operador autenticado pela gerência (${result.manager?.name || 'Administrador'}) para transição PDV -> Painel Administrativo`
        );

        setIsVerifying(false);
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setIsVerifying(false);
        setError(result.error || 'Senha de gerência incorreta. Acesso não autorizado.');
      }
    }, 200);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header Oficial Farah */}
        <div className="p-4 bg-[#242424] text-white flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCC33] text-[#242424] flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">{title}</h3>
              <p className="text-[11px] text-[#FFCC33] font-bold">Farah Esfiharia • Controle Gerencial</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#F6F5F1]">
          <div className="bg-white border border-[#E7E2D8] rounded-xl p-3.5 text-xs text-[#252525] leading-relaxed shadow-sm">
            {description}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-[#B42318] flex items-center gap-2 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Gerente Selecionado */}
          <div>
            <label className="block text-xs font-black text-[#252525] mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#CF1020]" />
              <span>Gerente / Responsável Autorizador</span>
            </label>
            <select
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#E7E2D8] rounded-xl text-[#252525] text-xs font-semibold focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-[#FFCC33]/30 shadow-sm"
            >
              {managers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'ADMIN' ? 'Administrador' : 'Gerente'})
                </option>
              ))}
            </select>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-black text-[#252525] mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#CF1020]" />
              <span>Senha da Gerência (Padrão: 1234)</span>
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha gerencial"
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#E7E2D8] rounded-xl text-[#252525] text-xs font-mono tracking-wider focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-[#FFCC33]/30 shadow-sm"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 bg-white hover:bg-stone-100 border border-[#E7E2D8] text-[#252525] rounded-xl text-xs font-bold transition-colors"
            >
              Permanecer no PDV
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 bg-[#242424] hover:bg-black disabled:opacity-50 text-[#FFCC33] rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-98"
            >
              {isVerifying ? (
                <span>Validando...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Liberar e Acessar Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
