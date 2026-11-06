import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  History,
  Key,
  Lock,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User, AuditLog, UserRole } from '../../types';

export const UsuariosScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());
  const [activeTab, setActiveTab] = useState<'USUARIOS' | 'AUDITORIA' | 'PERMISSOES'>('USUARIOS');

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#242424]" />
              <span>Segurança, Controle de Acesso (RBAC) & Auditoria — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Gestão de perfis de operadores, senhas de sangria e trilha imutável de auditoria das vendas e turnos.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E7E2D8] p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('USUARIOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'USUARIOS'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            Operadores ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('PERMISSOES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'PERMISSOES'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            Matriz de Permissões
          </button>
          <button
            onClick={() => setActiveTab('AUDITORIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'AUDITORIA'
                ? 'bg-[#CF1020] text-white shadow-xs'
                : 'text-[#6B6862] hover:text-[#242424]'
            }`}
          >
            Logs de Auditoria ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Conteúdo Aba Usuários */}
      {activeTab === 'USUARIOS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-[#FFFFFF] border border-[#E7E2D8] p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFCC33] text-[#242424] flex items-center justify-center font-black text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#242424] text-sm">{u.name}</h3>
                    <div className="text-xs text-[#6B6862] font-mono">{u.email}</div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    u.role === 'ADMIN'
                      ? 'bg-[#CF1020]/15 text-[#CF1020] border-[#CF1020]/30'
                      : u.role === 'GERENTE'
                      ? 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/30'
                      : u.role === 'OPERADOR_CAIXA'
                      ? 'bg-[#FFCC33]/25 text-[#242424] border-[#FFCC33]'
                      : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <div className="text-xs text-[#6B6862] bg-[#F6F5F1] p-2.5 rounded-xl border border-[#E7E2D8] flex justify-between items-center">
                <span>Status: <strong className="text-[#26734D]">ATIVO</strong></span>
                {(u.role === 'GERENTE' || u.role === 'ADMIN') ? (
                  <span className="text-[11px] text-[#242424] bg-[#FFCC33]/20 px-2 py-0.5 rounded border border-[#FFCC33]/40 font-semibold">
                    Senha Gerencial de Sangria: <strong className="text-[#CF1020] font-mono">1234</strong>
                  </span>
                ) : (
                  <span>Acesso: <strong className="font-mono text-[#242424]">Frente de Caixa</strong></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conteúdo Aba Matriz de Permissões */}
      {activeTab === 'PERMISSOES' && (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1]">
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Matriz de Autorização por Cargo na Farah
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Módulo / Ação</th>
                  <th className="py-3 px-4 text-center">ADMIN GERAL</th>
                  <th className="py-3 px-4 text-center">GERENTE DE TURNO</th>
                  <th className="py-3 px-4 text-center">OPERADOR CAIXA</th>
                  <th className="py-3 px-4 text-center">COZINHA/ESTOQUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {[
                  { module: 'PDV - Realizar Vendas', admin: true, gerente: true, caixa: true, estoque: false },
                  { module: 'PDV - Cancelar Venda / Itens', admin: true, gerente: true, caixa: false, estoque: false },
                  { module: 'Caixa - Abertura e Fechamento', admin: true, gerente: true, caixa: true, estoque: false },
                  { module: 'Caixa - Sangria (Requer Senha da Gerente)', admin: true, gerente: true, caixa: false, estoque: false },
                  { module: 'Caixa - Suprimento (Aporte de Troco)', admin: true, gerente: true, caixa: true, estoque: false },
                  { module: 'Cardápio - Cadastrar e Editar Itens', admin: true, gerente: true, caixa: false, estoque: true },
                  { module: 'Estoque - Movimentação Manual', admin: true, gerente: true, caixa: false, estoque: true },
                  { module: 'Fiscal - Emissão e Cancelamento NFC-e', admin: true, gerente: true, caixa: true, estoque: false },
                  { module: 'Financeiro - Contas a Pagar/Receber', admin: true, gerente: true, caixa: false, estoque: false },
                  { module: 'Relatórios - Dashboard e DRE', admin: true, gerente: true, caixa: false, estoque: false },
                  { module: 'Segurança - Usuários e Auditoria', admin: true, gerente: false, caixa: false, estoque: false },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FBF9F5]">
                    <td className="py-3 px-4 font-semibold text-[#242424]">{row.module}</td>
                    <td className="py-3 px-4 text-center">
                      {row.admin ? <CheckCircle2 className="w-4 h-4 text-[#26734D] mx-auto" /> : <XCircle className="w-4 h-4 text-stone-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.gerente ? <CheckCircle2 className="w-4 h-4 text-[#26734D] mx-auto" /> : <XCircle className="w-4 h-4 text-stone-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.caixa ? <CheckCircle2 className="w-4 h-4 text-[#26734D] mx-auto" /> : <XCircle className="w-4 h-4 text-stone-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.estoque ? <CheckCircle2 className="w-4 h-4 text-[#26734D] mx-auto" /> : <XCircle className="w-4 h-4 text-stone-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Aba Auditoria */}
      {activeTab === 'AUDITORIA' && (
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E7E2D8] bg-[#F6F5F1]">
            <h2 className="text-xs font-bold text-[#242424] flex items-center gap-2 uppercase tracking-wider">
              <History className="w-4 h-4 text-[#242424]" />
              <span>Trilha de Auditoria (Logs do Sistema)</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E7E2D8] bg-[#FFFFFF] text-[#6B6862] font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Data/Hora</th>
                  <th className="py-3 px-4">Operador</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Ação</th>
                  <th className="py-3 px-4">Detalhes da Operação</th>
                  <th className="py-3 px-4 text-right">Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#6B6862]">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#242424]">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#F6F5F1] px-2 py-0.5 rounded font-mono text-[10px] text-[#242424] border border-[#E7E2D8]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#CF1020]">{log.action}</td>
                    <td className="py-3 px-4 text-[#6B6862]">{log.details}</td>
                    <td className="py-3 px-4 text-right font-mono text-stone-400 text-[10px]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
