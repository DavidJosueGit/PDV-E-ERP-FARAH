import React, { useState } from 'react';
import {
  Banknote,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  X,
  Printer,
  ArrowDownRight,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { CashRegister, CashMovement } from '../../types';
import { StorageService } from '../../services/storage';
import { PrintService } from '../../services/printService';

interface CaixaModalProps {
  cashRegister: CashRegister | null;
  onClose: () => void;
  onUpdated: () => void;
}

export const CaixaModal: React.FC<CaixaModalProps> = ({
  cashRegister,
  onClose,
  onUpdated,
}) => {
  const currentUser = StorageService.getCurrentUser();
  const managers = StorageService.getManagers();
  const [initialBalance, setInitialBalance] = useState<number>(150);
  const [terminalNumber, setTerminalNumber] = useState<number>(1);
  const [closingNotes, setClosingNotes] = useState<string>('');
  const [countedCash, setCountedCash] = useState<number>(cashRegister ? cashRegister.currentBalance : 0);
  const [closingManagerId, setClosingManagerId] = useState<string>(managers[0]?.id || '');
  const [closingPassword, setClosingPassword] = useState<string>('');
  const [showClosePassword, setShowClosePassword] = useState<boolean>(false);
  const [closeError, setCloseError] = useState<string>('');
  const [closedReceipt, setClosedReceipt] = useState<CashRegister | null>(null);

  const isAberto = cashRegister && cashRegister.status === 'ABERTO';
  const expectedCash = cashRegister ? cashRegister.currentBalance : 0;
  const cashDifference = countedCash - expectedCash;

  const handleOpenCaixa = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      StorageService.openCashRegister(initialBalance, terminalNumber);
      onUpdated();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCloseCaixa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashRegister) return;
    setCloseError('');

    let authorizedManagerName: string | undefined = undefined;

    // Se houver divergência entre o esperado e o contado ou se for digitada a senha
    if (cashDifference !== 0 || closingPassword.trim().length > 0) {
      if (!closingPassword.trim()) {
        setCloseError('Existe divergência entre o saldo esperado e o contado na gaveta. É obrigatória a validação por senha da gerente para homologar.');
        return;
      }
      const validation = StorageService.validateManagerPassword(closingPassword, closingManagerId);
      if (!validation.valid) {
        setCloseError(validation.error || 'Senha da gerente incorreta para autorização do fechamento.');
        return;
      }
      authorizedManagerName = validation.manager?.name;
    }

    try {
      const closed = StorageService.closeCashRegister(
        cashRegister.id,
        closingNotes,
        countedCash,
        authorizedManagerName
      );
      setClosedReceipt(closed);
      onUpdated();
    } catch (err: any) {
      setCloseError(err.message || 'Erro ao processar fechamento.');
    }
  };

  const handlePrintReceipt = () => {
    PrintService.printElementViaIframe('closing-receipt');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${closedReceipt ? 'bg-[#FFCC33] text-[#242424]' : isAberto ? 'bg-[#CF1020]' : 'bg-[#26734D]'}`}>
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">
                {closedReceipt
                  ? `Fechamento Concluído - Terminal #${closedReceipt.terminalNumber}`
                  : isAberto
                  ? `Fechamento de Caixa — Terminal #${cashRegister.terminalNumber}`
                  : 'Abertura de Caixa — Farah'}
              </h2>
              <p className="text-xs text-stone-300">Operador Responsável: {currentUser.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto space-y-4">
          {closedReceipt ? (
            /* Comprovante / Relatório de Fechamento Emitido */
            <div className="space-y-4">
              <div className="p-4 bg-[#26734D]/10 border border-[#26734D]/30 rounded-xl flex items-center gap-3 text-[#26734D]">
                <CheckCircle2 className="w-6 h-6 text-[#26734D] shrink-0" />
                <div>
                  <h3 className="font-bold text-sm">Caixa Encerrado com Sucesso!</h3>
                  <p className="text-xs text-[#6B6862] font-mono">Protocolo de Fechamento: {closedReceipt.closingProtocol}</p>
                </div>
              </div>

              {/* Cupom Térmico / Leitura Z */}
              <div id="closing-receipt" className="bg-[#F6F5F1] p-5 rounded-2xl border border-[#E7E2D8] font-mono text-xs space-y-3 text-[#242424] shadow-inner">
                <div className="text-center border-b border-dashed border-[#E7E2D8] pb-3">
                  <div className="font-black text-sm text-[#CF1020]">FARAH ESFIHARIA & PIZZARIA</div>
                  <div className="text-[10px] text-[#6B6862]">CNPJ: 12.345.678/0001-90 - IE: 123.456.789.110</div>
                  <div className="text-[11px] font-bold text-[#242424] mt-1 bg-[#FFCC33]/30 py-0.5 rounded">
                    LEITURA Z / FECHAMENTO DE TURNO
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-dashed border-[#E7E2D8]">
                  <div>Terminal: #{closedReceipt.terminalNumber}</div>
                  <div className="text-right">Operador: {currentUser.name}</div>
                  <div>Abertura: {new Date(closedReceipt.openedAt).toLocaleTimeString('pt-BR')}</div>
                  <div className="text-right">Fechamento: {closedReceipt.closedAt ? new Date(closedReceipt.closedAt).toLocaleTimeString('pt-BR') : '-'}</div>
                </div>

                <div className="space-y-1.5 py-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Fundo de Troco Inicial:</span>
                    <span className="font-bold text-[#242424]">R$ {closedReceipt.initialBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Total Vendas Brutas:</span>
                    <span className="font-bold text-[#26734D]">+ R$ {closedReceipt.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Total Sangrias (Retiradas):</span>
                    <span className="font-bold text-[#CF1020]">- R$ {closedReceipt.totalSangria.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6862]">Total Suprimentos:</span>
                    <span className="font-bold text-[#242424]">+ R$ {closedReceipt.totalSuprimento.toFixed(2)}</span>
                  </div>
                </div>

                {/* Conciliação Física da Gaveta */}
                <div className="pt-2 border-t border-dashed border-[#E7E2D8] space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Saldo Contábil Esperado:</span>
                    <span className="text-[#242424]">R$ {closedReceipt.currentBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Saldo Físico Contado:</span>
                    <span className="text-[#242424]">R$ {(closedReceipt.countedCash ?? closedReceipt.currentBalance).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-[#E7E2D8]">
                    <span>Diferença / Quebra:</span>
                    <span className={(closedReceipt.cashDifference || 0) === 0 ? 'text-[#26734D]' : (closedReceipt.cashDifference || 0) > 0 ? 'text-[#D97706]' : 'text-[#CF1020]'}>
                      {(closedReceipt.cashDifference || 0) === 0
                        ? 'R$ 0,00 (Exato)'
                        : (closedReceipt.cashDifference || 0) > 0
                        ? `+ R$ ${(closedReceipt.cashDifference || 0).toFixed(2)} (Sobra)`
                        : `- R$ ${Math.abs(closedReceipt.cashDifference || 0).toFixed(2)} (Falta)`}
                    </span>
                  </div>
                  {closedReceipt.closedByManager && (
                    <div className="text-[10px] text-[#6B6862] pt-1">
                      Homologação Gerencial: <strong className="text-[#242424]">{closedReceipt.closedByManager}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 bg-[#F6F5F1] hover:bg-stone-200 text-[#242424] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-[#E7E2D8] cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#242424]" />
                  <span>Imprimir Comprovante</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#26734D] hover:bg-[#1f5d3e] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <span>Concluir e Fechar</span>
                </button>
              </div>
            </div>
          ) : !isAberto ? (
            /* Formulário de Abertura */
            <form onSubmit={handleOpenCaixa} className="space-y-4">
              <div className="p-3 bg-[#FFCC33]/15 border border-[#FFCC33]/40 rounded-xl text-xs text-[#242424]">
                Informe o valor inicial de dinheiro (Fundo de Troco) para abrir as operações do caixa no terminal.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6862] font-semibold block mb-1">Número do Terminal (PDV):</label>
                  <input
                    type="number"
                    min="1"
                    value={terminalNumber}
                    onChange={(e) => setTerminalNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-[#242424] text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#242424] font-bold block mb-1">Fundo de Troco Inicial (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#F6F5F1] border-2 border-[#26734D] rounded-lg p-2.5 text-[#26734D] font-mono font-bold text-base"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#26734D] hover:bg-[#1f5d3e] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>CONFIRMAR ABERTURA DE TURNO</span>
              </button>
            </form>
          ) : (
            /* Formulário de Fechamento de Caixa */
            <form onSubmit={handleCloseCaixa} className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8]">
                  <span className="text-[10px] text-[#6B6862] uppercase block font-semibold">Fundo Inicial:</span>
                  <span className="text-sm font-mono font-bold text-[#242424]">
                    R$ {cashRegister.initialBalance.toFixed(2)}
                  </span>
                </div>
                <div className="bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8]">
                  <span className="text-[10px] text-[#6B6862] uppercase block font-semibold">Total de Vendas:</span>
                  <span className="text-sm font-mono font-bold text-[#26734D]">
                    R$ {cashRegister.totalSales.toFixed(2)}
                  </span>
                </div>
                <div className="bg-[#F6F5F1] p-3 rounded-xl border border-[#E7E2D8]">
                  <span className="text-[10px] text-[#6B6862] uppercase block font-semibold">Saldo Contábil:</span>
                  <span className="text-sm font-mono font-bold text-[#242424]">
                    R$ {cashRegister.currentBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Contagem Cega da Gaveta */}
              <div className="bg-[#F6F5F1] p-4 rounded-xl border border-[#E7E2D8] space-y-2">
                <label className="text-xs font-bold text-[#242424] block">
                  Contagem Física do Dinheiro na Gaveta (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={countedCash}
                  onChange={(e) => setCountedCash(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FFFFFF] border-2 border-[#242424] rounded-lg p-2.5 text-[#242424] font-mono font-bold text-lg"
                />
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#6B6862]">Diferença calculada:</span>
                  <span
                    className={`font-mono font-bold ${
                      cashDifference === 0 ? 'text-[#26734D]' : cashDifference > 0 ? 'text-[#D97706]' : 'text-[#CF1020]'
                    }`}
                  >
                    {cashDifference === 0
                      ? 'R$ 0,00 (Sem quebra)'
                      : cashDifference > 0
                      ? `+ R$ ${cashDifference.toFixed(2)} (Sobra)`
                      : `- R$ ${Math.abs(cashDifference).toFixed(2)} (Falta)`}
                  </span>
                </div>
              </div>

              {/* Se houver divergência, exige validação de senha da gerente */}
              {cashDifference !== 0 && (
                <div className="bg-[#CF1020]/10 border border-[#CF1020]/30 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#CF1020]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Homologação Gerencial de Divergência
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B6862]">
                    Como há divergência entre a contagem física e o contábil, é necessária a validação da gerente.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-[#6B6862] block mb-1">Gerente Homologadora:</label>
                      <select
                        value={closingManagerId}
                        onChange={(e) => setClosingManagerId(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg p-2 text-xs text-[#242424]"
                      >
                        {managers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6B6862] block mb-1">Senha da Gerente:</label>
                      <div className="relative">
                        <input
                          type={showClosePassword ? 'text' : 'password'}
                          required
                          value={closingPassword}
                          onChange={(e) => {
                            setClosingPassword(e.target.value);
                            setCloseError('');
                          }}
                          placeholder="Digite a senha (1234)"
                          className="w-full bg-[#FFFFFF] border border-[#CF1020] rounded-lg p-2 pr-8 text-xs text-[#242424] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowClosePassword(!showClosePassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showClosePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Observações */}
              <div>
                <label className="text-xs text-[#6B6862] font-semibold block mb-1">Observações do Fechamento:</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Turno de almoço encerrado normalmente."
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
                />
              </div>

              {/* Erro */}
              {closeError && (
                <div className="p-3 bg-[#CF1020]/15 border border-[#CF1020]/40 rounded-xl text-[#CF1020] text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#CF1020]" />
                  <span>{closeError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#CF1020] hover:bg-[#b00e1b] text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>CONFIRMAR E PROCESSAR FECHAMENTO DE CAIXA</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface SangriaModalProps {
  cashRegister: CashRegister;
  onClose: () => void;
  onUpdated: () => void;
}

export const SangriaSuprimentoModal: React.FC<SangriaModalProps> = ({
  cashRegister,
  onClose,
  onUpdated,
}) => {
  const managers = StorageService.getManagers();
  const [type, setType] = useState<'SANGRIA' | 'SUPRIMENTO'>('SANGRIA');
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState<string>('Sangria para depósito em cofre central');
  const [selectedManagerId, setSelectedManagerId] = useState<string>(managers[0]?.id || '');
  const [managerPassword, setManagerPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const quickAmounts = [50, 100, 200, 500];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    if (type === 'SANGRIA' && amount > cashRegister.currentBalance) {
      setError(`Saldo em caixa (R$ ${cashRegister.currentBalance.toFixed(2)}) insuficiente para a retirada solicitada.`);
      return;
    }

    let authorizingManagerName: string | undefined = undefined;

    // A sangria exige obrigatoriamente validação gerencial por senha
    if (type === 'SANGRIA') {
      if (!managerPassword.trim()) {
        setError('A liberação da sangria requer a senha da gerente.');
        return;
      }

      const validation = StorageService.validateManagerPassword(managerPassword, selectedManagerId);
      if (!validation.valid) {
        setError(validation.error || 'Senha incorreta. Apenas a gerência autorizada pode liberar a sangria.');
        return;
      }

      authorizingManagerName = validation.manager?.name;
    }

    try {
      StorageService.addCashMovement(cashRegister.id, type, amount, reason, authorizingManagerName);
      setSuccessMsg(
        type === 'SANGRIA'
          ? `Sangria de R$ ${amount.toFixed(2)} autorizada com sucesso por ${authorizingManagerName}!`
          : `Suprimento de R$ ${amount.toFixed(2)} registrado com sucesso!`
      );
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar movimentação de caixa.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#242424] border-b border-stone-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'SANGRIA' ? (
              <div className="w-8 h-8 rounded-lg bg-[#CF1020]/20 text-[#CF1020] flex items-center justify-center border border-[#CF1020]/30">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#26734D]/20 text-[#26734D] flex items-center justify-center border border-[#26734D]/30">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-base leading-tight">
                {type === 'SANGRIA' ? 'Sangria de Caixa (Retirada)' : 'Suprimento de Caixa (Aporte)'}
              </h2>
              <span className="text-[11px] text-stone-400">Terminal de Vendas #{cashRegister.terminalNumber}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-[#26734D]/15 border border-[#26734D]/40 rounded-xl text-[#26734D] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#26734D]" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('SANGRIA');
                setReason('Sangria para cofre de segurança');
                setError('');
              }}
              className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                type === 'SANGRIA'
                  ? 'bg-[#CF1020]/15 border-[#CF1020] text-[#CF1020] shadow-sm'
                  : 'bg-[#F6F5F1] border-[#E7E2D8] text-[#6B6862] hover:text-[#242424]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-[#CF1020]" />
              <span>SANGRIA (Exige Gerente)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('SUPRIMENTO');
                setReason('Aporte complementar de moedas para troco');
                setError('');
              }}
              className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                type === 'SUPRIMENTO'
                  ? 'bg-[#26734D]/15 border-[#26734D] text-[#26734D] shadow-sm'
                  : 'bg-[#F6F5F1] border-[#E7E2D8] text-[#6B6862] hover:text-[#242424]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-[#26734D]" />
              <span>SUPRIMENTO (Entrada)</span>
            </button>
          </div>

          {/* Current Balance Display */}
          <div className="p-3 bg-[#F6F5F1] rounded-xl text-xs flex items-center justify-between border border-[#E7E2D8]">
            <div className="flex items-center gap-2 text-[#6B6862]">
              <Banknote className="w-4 h-4 text-[#26734D]" />
              <span>Saldo em dinheiro na gaveta:</span>
            </div>
            <span className="font-mono font-bold text-[#242424] text-sm">
              R$ {cashRegister.currentBalance.toFixed(2)}
            </span>
          </div>

          {/* Amount Input and Quick Buttons */}
          <div>
            <label className="text-xs text-[#242424] font-semibold block mb-1">
              Valor da Operação (R$):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6862] font-bold text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount || ''}
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value) || 0);
                  setError('');
                }}
                className="w-full bg-[#FFFFFF] border-2 border-[#242424] rounded-xl py-2.5 pl-10 pr-3 text-[#242424] font-mono font-bold text-lg focus:outline-none focus:border-[#FFCC33]"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-[#6B6862] uppercase font-semibold">Atalhos:</span>
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2.5 py-1 rounded-lg bg-[#F6F5F1] hover:bg-stone-200 border border-[#E7E2D8] text-[11px] font-mono text-[#242424] font-semibold transition-colors cursor-pointer"
                >
                  +R$ {val}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="text-xs text-[#6B6862] font-semibold block mb-1">Motivo / Justificativa:</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#F6F5F1] border border-[#E7E2D8] rounded-xl p-2.5 text-xs text-[#242424] focus:outline-none focus:border-[#FFCC33]"
              placeholder="Ex: Sangria para depósito em cofre central"
            />
          </div>

          {/* Manager Authorization Section for SANGRIA */}
          {type === 'SANGRIA' && (
            <div className="bg-[#CF1020]/10 border border-[#CF1020]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#CF1020] shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-[#CF1020] uppercase tracking-wide">
                      Autorização da Gerência Obrigatória
                    </h3>
                    <p className="text-[11px] text-[#6B6862]">
                      A sangria exige a liberação e senha de uma gerente para validar a retirada física.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#CF1020]/20 text-[#CF1020] border border-[#CF1020]/30">
                  REQUER SENHA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs text-[#242424] font-semibold block mb-1">
                    Gerente Responsável:
                  </label>
                  <select
                    value={selectedManagerId}
                    onChange={(e) => {
                      setSelectedManagerId(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg p-2 text-xs text-[#242424]"
                  >
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-1">
                    <label className="text-xs text-[#242424] font-semibold">Senha da Gerente:</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={managerPassword}
                      onChange={(e) => {
                        setManagerPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Senha gerencial (1234)"
                      className="w-full bg-[#FFFFFF] border border-[#CF1020] rounded-lg p-2 pr-9 text-xs text-[#242424] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#CF1020]/15 border border-[#CF1020]/40 rounded-xl text-[#CF1020] text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#CF1020]" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!!successMsg}
              className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                type === 'SANGRIA'
                  ? 'bg-[#CF1020] hover:bg-[#b00e1b]'
                  : 'bg-[#26734D] hover:bg-[#1f5d3e]'
              }`}
            >
              {type === 'SANGRIA' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTORIZAR E CONFIRMAR SANGRIA (R$ {amount.toFixed(2)})</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>CONFIRMAR SUPRIMENTO (R$ {amount.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
