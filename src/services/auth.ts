import { User, UserRole } from '../types';
import { StorageService } from './storage';

const AUTH_SESSION_KEY = 'FARAH_AUTH_SESSION';

export interface AuthSession {
  token: string;
  user: User;
  authenticatedAt: string;
}

type AuthListener = (user: User | null) => void;

class AuthServiceClass {
  private listeners: Set<AuthListener> = new Set();

  constructor() {
    // Inicialização segura: se já existir uma sessão salva, sincroniza com o StorageService
    if (typeof window !== 'undefined') {
      const session = this.getSession();
      if (session?.user) {
        // Assegura que o storage local do sistema tenha esse usuário ativo
        try {
          StorageService.setCurrentUser(session.user);
        } catch {
          // fallback silencioso
        }
      }
    }
  }

  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(AUTH_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthSession;
    } catch {
      return null;
    }
  }

  getUser(): User | null {
    return this.getSession()?.user || null;
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    return !!session && !!session.user && session.user.active;
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(user: User | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(user);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  private setSession(user: User): AuthSession {
    const session: AuthSession = {
      token: 'jwt-farah-' + user.id + '-' + Date.now(),
      user,
      authenticatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
    StorageService.setCurrentUser(user);
    this.notify(user);
    return session;
  }

  async loginWithPin(userId: string, pin: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simula pequena latência para naturalidade de toque de PIN pad
    await new Promise((resolve) => setTimeout(resolve, 150));

    const result = StorageService.authenticateWithPin(userId, pin);
    if (result.success && result.user) {
      this.setSession(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error || 'PIN inválido.' };
  }

  async loginWithEmail(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simula pequena latência de validação de credenciais
    await new Promise((resolve) => setTimeout(resolve, 200));

    const result = StorageService.authenticateWithEmail(email, password);
    if (result.success && result.user) {
      this.setSession(result.user);
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error || 'Credenciais inválidas.' };
  }

  logout(): void {
    const currentUser = this.getUser();
    if (currentUser) {
      StorageService.logAction(
        currentUser,
        'LOGOUT',
        'AUTENTICACAO',
        `Usuário ${currentUser.name} encerrou a sessão no sistema.`
      );
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
    this.notify(null);
  }

  canAccessAdmin(user: User | null): boolean {
    if (!user || !user.active) return false;
    return user.role === 'ADMIN' || user.role === 'GERENTE' || user.role === 'ESTOQUISTA';
  }

  canAccessPdv(user: User | null): boolean {
    if (!user || !user.active) return false;
    return true; // Todos os colaboradores autorizados podem operar ou supervisionar o PDV
  }
}

export const AuthService = new AuthServiceClass();
