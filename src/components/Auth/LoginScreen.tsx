import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  HelpCircle,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth';
import { User } from '../../types';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  defaultMode?: 'pin' | 'credentials';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
}) => {
  const users = StorageService.getUsers().filter(u => u.active);
  const operators = users.filter(u => u.role === 'OPERADOR_CAIXA' || u.role === 'GERENTE' || u.role === 'ADMIN');

  const [selectedUserId, setSelectedUserId] = useState<string>(
    operators[0]?.id || users[0]?.id || ''
  );
  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const [usernameOrEmail, setUsernameOrEmail] = useState<string>(selectedUser?.email || '');
  const [password, setPassword] = useState<string>('1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Quando o operador selecionado muda, atualiza o campo de e-mail e foca a senha
  const handleSelectOperator = (u: User) => {
    setSelectedUserId(u.id);
    setUsernameOrEmail(u.email);
    setPassword(u.pin || '1234');
    setError('');
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Por favor, informe a senha de acesso.');
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tenta autenticação por e-mail/usuário informado
      let res = await AuthService.loginWithEmail(usernameOrEmail, password);

      // 2. Se falhou e um operador estava selecionado, tenta validar pelo PIN do operador
      if (!res.success && selectedUserId) {
        res = await AuthService.loginWithPin(selectedUserId, password);
      }

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Credenciais inválidas. Verifique a senha e tente novamente.');
        setPassword('');
        passwordInputRef.current?.focus();
      }
    } catch (err: any) {
      setError('Falha ao autenticar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col md:flex-row bg-[#FFFAF2] font-sans selection:bg-[#FFCC33] selection:text-[#242424]">
      {/* Lado Esquerdo: Banner Fotográfico Gourmet da Farah Esfiharia e Pizzaria */}
      <div className="hidden md:block md:w-[52%] lg:w-[56%] h-full relative overflow-hidden bg-stone-900 select-none">
        <img
          src="/assets/aistudio/farah_login_banner.png"
          alt="Farah Esfiharia e Pizzaria - Esfihas e Pizzas Artesanais"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Lado Direito: Formulário de Acesso ao PDV com Seleção de Operador de Caixa */}
      <div className="flex-1 h-full overflow-y-auto bg-[#FFFAF2] flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Topo institucional para mobile */}
        <div className="md:hidden flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
          <span className="font-serif font-black text-xl text-[#242424]">Farah Esfiharia</span>
          <span className="text-[10px] font-mono bg-[#FFCC33] text-[#242424] font-black px-2 py-0.5 rounded">
            PDV CAIXA
          </span>
        </div>

        {/* Centro: Formulário Principal */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Cabeçalho do Formulário */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">
              Acessar o PDV
            </h1>
            <p className="text-stone-600 text-sm">
              Entre com suas credenciais para iniciar o atendimento.
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#B42318] flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B42318]" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Seleção do Operador de Caixa */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#CF1020]" />
                <span>Operador de Caixa:</span>
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Clique para alternar</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {operators.map((u) => {
                const isSelected = u.id === selectedUserId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectOperator(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#CF1020] ring-2 ring-[#CF1020]/20 shadow-sm'
                        : 'bg-white/80 border-[#E7E2D8] hover:bg-white text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected
                          ? 'bg-[#CF1020] text-white shadow-sm'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs truncate text-[#1A1A1A]">
                        {u.name.split(' ')[0]} {u.name.split(' ')[1] || ''}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {u.role === 'ADMIN'
                          ? 'Admin Geral'
                          : u.role === 'GERENTE'
                          ? 'Gerente'
                          : 'Operador'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulário de Credenciais */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Campo: Usuário ou e-mail */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1.5">
                Usuário ou e-mail
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="nome@farah.com.br"
                className="w-full px-4 py-3 bg-white border border-[#E7E2D8] rounded-xl text-sm text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#CF1020] focus:ring-2 focus:ring-[#CF1020]/10 shadow-sm transition-all"
                required
              />
            </div>

            {/* Campo: Senha com link de Esqueci minha senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#CF1020] hover:underline font-semibold cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso"
                  className="w-full px-4 pr-11 py-3 bg-white border border-[#E7E2D8] rounded-xl text-sm text-[#1A1A1A] placeholder-stone-400 font-mono focus:outline-none focus:border-[#CF1020] focus:ring-2 focus:ring-[#CF1020]/10 shadow-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 transition-colors p-0.5 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-stone-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de Ação: Entrar no caixa */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 bg-[#CF1020] hover:bg-[#B4101E] active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-xl text-base shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Validando acesso...</span>
              ) : (
                <span>Entrar no caixa</span>
              )}
            </button>
          </form>

          {/* Aviso de Acesso Restrito no rodapé do card */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-stone-500">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Acesso restrito a funcionários autorizados</span>
          </div>
        </div>

        {/* Rodapé da tela */}
        <div className="text-center text-[11px] text-stone-500 pt-6">
          Farah Esfiharia e Pizzaria • Terminal Operacional CX-01 • v2.0
        </div>
      </div>

      {/* Modal de Esqueci minha senha */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#242424] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2 text-[#FFCC33]">
                <HelpCircle className="w-4 h-4" />
                <span>Recuperação de Senha</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-stone-700">
              <p>
                Por motivos de conformidade fiscal e proteção do fechamento de caixa, a alteração de senhas deve ser solicitada à <strong>Gerência Geral</strong>.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                💡 Senha padrão para testes de demonstração: <strong>1234</strong>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full mt-2 py-2.5 bg-[#242424] hover:bg-black text-[#FFCC33] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
