/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './layouts/AdminLayout';
import { PdvLayout } from './layouts/PdvLayout';
import { LoginScreen } from './components/Auth/LoginScreen';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { User, CashRegister } from './types';

export type AppRoute = 'admin' | 'pdv' | 'login';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Tenta recuperar sessão ativa persistida no AuthService
    const authUser = AuthService.getUser();
    if (authUser && authUser.active) {
      return authUser;
    }
    // Caso padrão de fallback inicial
    const storageUser = StorageService.getCurrentUser();
    if (storageUser && storageUser.active) {
      // Se não havia sessão explícita, cria uma para sincronizar
      return storageUser;
    }
    return null;
  });

  const [activeCashRegister, setActiveCashRegister] = useState<CashRegister | null>(
    StorageService.getActiveCashRegister()
  );

  // Inicialização de rota SPA
  const getInitialRoute = (): AppRoute => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login' || path.startsWith('/login')) {
        return 'login';
      }
      if (path === '/pdv' || path.startsWith('/pdv')) {
        return 'pdv';
      }
    }
    return 'admin';
  };

  const [route, setRoute] = useState<AppRoute>(() => {
    // Se não há usuário autenticado, força a rota /login
    if (!AuthService.isAuthenticated() && !currentUser) {
      return 'login';
    }
    return getInitialRoute();
  });

  const [showCaixaModal, setShowCaixaModal] = useState<boolean>(false);
  const [showSangriaModal, setShowSangriaModal] = useState<boolean>(false);
  const [showManagerAuthModal, setShowManagerAuthModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = useCallback(() => {
    const updatedUser = AuthService.getUser() || StorageService.getCurrentUser();
    setCurrentUser(updatedUser);
    setActiveCashRegister(StorageService.getActiveCashRegister());
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleUserChange = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    handleRefresh();
  };

  // Transição de rotas SPA sincronizada com a URL
  const navigateTo = (newRoute: AppRoute) => {
    setRoute(newRoute);
    window.history.pushState({ route: newRoute }, '', `/${newRoute}`);
  };

  // Sincronização inicial da URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = `/${route}`;
    if (currentPath !== targetPath) {
      window.history.replaceState({ route }, '', targetPath);
    }
  }, [route]);

  // Suporte a navegação por histórico do navegador (PopState)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login' || path.startsWith('/login')) {
        setRoute('login');
      } else if (path === '/pdv' || path.startsWith('/pdv')) {
        if (!currentUser) {
          navigateTo('login');
        } else {
          setRoute('pdv');
        }
      } else {
        // Se estava no PDV e tentou voltar ao Admin pelo histórico, intercepta com autorização gerencial
        if (route === 'pdv') {
          window.history.pushState({ route: 'pdv' }, '', '/pdv');
          setShowManagerAuthModal(true);
        } else if (!currentUser) {
          navigateTo('login');
        } else {
          setRoute('admin');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [route, currentUser]);

  // Teclas de Atalho Globais (Ex: F2 para alternar entre PDV e Admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (route === 'admin') {
          navigateTo('pdv');
        } else if (route === 'pdv') {
          // No PDV, aciona o modal de senha para sair
          setShowManagerAuthModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [route]);

  // Manipulador de Login com Sucesso
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);

    // Operadores de caixa são direcionados diretamente para o PDV
    if (user.role === 'OPERADOR_CAIXA') {
      navigateTo('pdv');
    } else {
      // Gerentes e Administradores vão para o Painel Administrativo ou mantêm preferência
      navigateTo('admin');
    }
    handleRefresh();
  };

  // Manipulador de Logout
  const handleLogout = () => {
    if (confirm('Deseja realmente encerrar a sessão e sair do terminal?')) {
      AuthService.logout();
      setCurrentUser(null);
      navigateTo('login');
    }
  };

  return (
    <div key={refreshKey} className="w-screen h-screen overflow-hidden bg-[#F6F5F1]">
      {/* Guarda de Rota: Se deslogado ou rota for login, exibe tela de login */}
      {(!currentUser || route === 'login') ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          defaultMode="pin"
        />
      ) : route === 'pdv' ? (
        <PdvLayout
          currentUser={currentUser}
          cashRegister={activeCashRegister}
          showCaixaModal={showCaixaModal}
          setShowCaixaModal={setShowCaixaModal}
          showSangriaModal={showSangriaModal}
          setShowSangriaModal={setShowSangriaModal}
          showManagerAuthModal={showManagerAuthModal}
          setShowManagerAuthModal={setShowManagerAuthModal}
          onAdminAuthorized={() => {
            setShowManagerAuthModal(false);
            navigateTo('admin');
          }}
          onRefresh={handleRefresh}
          onUserChange={handleUserChange}
          onLogout={handleLogout}
        />
      ) : (
        <AdminLayout
          currentUser={currentUser}
          onUserChange={handleUserChange}
          cashRegister={activeCashRegister}
          onRefresh={handleRefresh}
          onNavigateToPdv={() => navigateTo('pdv')}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
