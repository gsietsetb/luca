import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

// ---- Friendly error messages ----
const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos',
  'Email not confirmed': 'Revisa tu email y confirma tu cuenta antes de entrar',
  'User already registered': 'Este email ya tiene cuenta. ¿Quieres iniciar sesión?',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Signup requires a valid password': 'Introduce una contraseña válida',
  'Unable to validate email address: invalid format': 'El formato del email no es válido',
  'Email rate limit exceeded': 'Demasiados intentos. Espera un minuto y vuelve a probar',
  'For security purposes, you can only request this after': 'Por seguridad, espera un momento antes de reintentar',
  'Auth session missing': 'Tu sesión ha expirado. Inicia sesión de nuevo',
  'New password should be different from the old password': 'La nueva contraseña debe ser diferente',
  'Token has expired or is invalid': 'El enlace ha expirado. Solicita uno nuevo',
};

function friendlyError(error: AuthError | null): string | null {
  if (!error) return null;
  const msg = error.message;

  // Exact match
  if (ERROR_MAP[msg]) return ERROR_MAP[msg];

  // Partial match
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }

  // OAuth / exchange errors
  if (msg.includes('Unable to exchange')) {
    return 'Hubo un problema con Google. Inténtalo de nuevo o usa email.';
  }
  if (msg.includes('server_error') || msg.includes('unexpected_failure')) {
    return 'Error del servidor. Inténtalo de nuevo en unos segundos.';
  }

  // Generic fallback (still clean)
  if (msg.includes('rate limit')) return 'Demasiados intentos. Espera un momento.';
  if (msg.includes('network')) return 'Error de conexión. Comprueba tu internet.';

  return `Algo salió mal: ${msg}`;
}

// ---- Parse OAuth errors from URL ----
export function parseAuthErrorFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace('#', ''));

  const errorDesc =
    params.get('error_description') ||
    hash.get('error_description') ||
    null;

  if (!errorDesc) return null;

  const decoded = decodeURIComponent(errorDesc);

  if (decoded.includes('Unable to exchange')) {
    return 'No se pudo completar el login con Google. Por favor inténtalo de nuevo.';
  }
  if (decoded.includes('expired')) {
    return 'El enlace ha expirado. Solicita uno nuevo.';
  }
  return `Error de autenticación: ${decoded}`;
}

export function clearAuthErrorFromURL() {
  if (window.location.search.includes('error') || window.location.hash.includes('error')) {
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ---- Types ----
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  plan: 'free' | 'pro' | 'autonomos';
}

interface SignUpResult {
  error: string | null;
  needsConfirmation: boolean;
}

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<SignUpResult>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const SITE_URL = import.meta.env.PROD
  ? 'https://luca-seven.vercel.app'
  : window.location.origin;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    plan: 'free',
  });

  const fetchPlan = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    const { data } = await supabase
      .from('luca_subscriptions')
      .select('plan')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    if (data?.plan) {
      setState((s) => ({ ...s, plan: data.plan as AuthState['plan'] }));
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) fetchPlan(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) fetchPlan(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [fetchPlan]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: friendlyError(error) };
  };

  const signUpWithEmail = async (email: string, password: string): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { error: friendlyError(error), needsConfirmation: false };
    }

    // Supabase returns user but with no session if email confirmation is required
    const needsConfirmation = !!data.user && !data.session;
    return { error: null, needsConfirmation };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: SITE_URL },
    });
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: SITE_URL },
    });
    return { error: friendlyError(error) };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, loading: false, plan: 'free' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithMagicLink,
        signOut,
        isAuthenticated: !!state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
