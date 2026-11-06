import React from 'react';
import {
  ShoppingCart,
  UtensilsCrossed,
  Layers,
  Banknote,
  CreditCard,
  FileText,
  Users,
  PieChart,
  BarChart3,
  ShieldCheck,
  Code2,
  Server
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'pdv'
  | 'produtos'
  | 'estoque'
  | 'caixa'
  | 'tef'
  | 'fiscal'
  | 'clientes'
  | 'financeiro'
  | 'relatorios'
  | 'usuarios'
  | 'java_swagger';

interface SidebarItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  badge?: string;
  shortcut?: string;
  highlight?: boolean;
  allowedRoles: UserRole[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userRole }) => {
  const sections: SidebarSection[] = [
    {
      title: 'Frente & Atendimento',
      items: [
        {
          id: 'pdv' as ActiveTab,
          label: 'Frente de Caixa (PDV)',
          icon: ShoppingCart,
          color: 'text-[#FFCC33]',
          allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR_CAIXA', 'ESTOQUISTA'],
          shortcut: 'F2',
          highlight: true,
        },
        {
          id: 'caixa' as ActiveTab,
          label: 'Caixa & Turnos',
          icon: Banknote,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR_CAIXA'],
        },
        {
          id: 'tef' as ActiveTab,
          label: 'TEF & Pagamentos',
          icon: CreditCard,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR_CAIXA'],
        },
      ],
    },
    {
      title: 'Cardápio & Produção',
      items: [
        {
          id: 'produtos' as ActiveTab,
          label: 'Cardápio & Preços',
          icon: UtensilsCrossed,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE', 'ESTOQUISTA'],
        },
        {
          id: 'estoque' as ActiveTab,
          label: 'Estoque & Insumos',
          icon: Layers,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE', 'ESTOQUISTA'],
        },
      ],
    },
    {
      title: 'Fiscal & Vendas',
      items: [
        {
          id: 'fiscal' as ActiveTab,
          label: 'NFC-e & Documentos',
          icon: FileText,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR_CAIXA'],
        },
        {
          id: 'clientes' as ActiveTab,
          label: 'Clientes & Fornecedores',
          icon: Users,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE'],
        },
      ],
    },
    {
      title: 'Gestão & Backoffice',
      items: [
        {
          id: 'financeiro' as ActiveTab,
          label: 'Financeiro & DRE',
          icon: PieChart,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE'],
        },
        {
          id: 'relatorios' as ActiveTab,
          label: 'Relatórios & Gráficos',
          icon: BarChart3,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN', 'GERENTE'],
        },
        {
          id: 'usuarios' as ActiveTab,
          label: 'Usuários & Auditoria',
          icon: ShieldCheck,
          color: 'text-stone-300',
          allowedRoles: ['ADMIN'],
        },
        {
          id: 'java_swagger' as ActiveTab,
          label: 'API Java Spring Boot',
          icon: Code2,
          color: 'text-stone-300',
          badge: 'REST API',
          allowedRoles: ['ADMIN', 'GERENTE', 'OPERADOR_CAIXA', 'ESTOQUISTA'],
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#242424] border-r border-stone-800 flex flex-col shrink-0 select-none">
      <div className="p-3 border-b border-stone-800">
        <div className="text-[11px] font-bold tracking-wider text-stone-400 uppercase px-3 py-1 flex items-center justify-between">
          <span>Módulos de Gestão</span>
          <span className="text-[9px] text-[#FFCC33] bg-stone-800 px-1.5 py-0.5 rounded font-mono">FARAH v2.0</span>
        </div>
      </div>

      <nav className="p-2 space-y-4 flex-1 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isAllowed = item.allowedRoles.includes(userRole);
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  disabled={!isAllowed}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFCC33]/15 text-[#FFCC33] border-l-4 border-[#FFCC33] shadow-sm'
                      : item.highlight
                      ? 'bg-[#CF1020]/20 text-stone-100 hover:bg-[#CF1020]/30 border border-[#CF1020]/40'
                      : isAllowed
                      ? 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                      : 'text-stone-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFCC33]' : item.highlight ? 'text-[#FFCC33]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.shortcut && (
                      <span className="text-[10px] bg-[#FFCC33] text-[#242424] font-black px-1.5 py-0.5 rounded font-mono">
                        {item.shortcut}
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[9px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono font-bold border border-stone-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Rodapé do Sistema */}
      <div className="p-3 border-t border-stone-800 bg-stone-900/60">
        <div className="flex items-center gap-2 text-[11px] text-stone-300">
          <Server className="w-3.5 h-3.5 text-[#FFCC33]" />
          <span>Spring Boot 3.4 • PostgreSQL 16</span>
        </div>
        <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#26734D]"></span>
          <span>NFC-e / S@T Farah • Homologação</span>
        </div>
      </div>
    </aside>
  );
};
