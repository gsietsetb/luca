import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  plan: 'free' | 'pro' | 'autonomos';
}

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

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
    return { error: error?.message ?? null };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
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
