import { useState, useCallback, useEffect } from 'react';
import {
  Wallet,
  Upload as UploadIcon,
  BarChart3,
  FileText,
  Brain,
  ArrowLeft,
  User,
  LogOut,
  Crown,
  Loader2,
} from 'lucide-react';
import type { Transaction } from './lib/types';
import { useAuth } from './lib/auth';
import { saveUpload, loadTransactions } from './lib/persistence';
import Landing from './pages/Landing';
import UploadPage from './pages/Upload';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/Auth';

type View = 'landing' | 'upload' | 'dashboard' | 'auth';

export default function App() {
  const { user, isAuthenticated, loading: authLoading, signOut, plan } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<View>('landing');
  const [loadingData, setLoadingData] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load transactions from Supabase when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setLoadingData(true);
    loadTransactions(user.id).then((txs) => {
      if (txs.length > 0) {
        setTransactions(txs);
        setView('dashboard');
      } else {
        setView('upload');
      }
      setLoadingData(false);
    });
  }, [isAuthenticated, user]);

  const handleTransactionsLoaded = useCallback(
    async (newTx: Transaction[], filename?: string, source?: string) => {
      setTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const unique = newTx.filter((t) => !existingIds.has(t.id));
        return [...prev, ...unique];
      });

      // Save to Supabase if authenticated
      if (user) {
        await saveUpload(user.id, filename ?? 'unknown.csv', source ?? 'unknown', newTx);
      }
    },
    [user]
  );

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setView(transactions.length > 0 ? 'dashboard' : 'upload');
    } else {
      setView('upload');
    }
  };

  // Auth page
  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-dark-950">
        <AuthPage
          onBack={() => setView('landing')}
          onSuccess={() => setView(transactions.length > 0 ? 'dashboard' : 'upload')}
        />
      </div>
    );
  }

  // Loading
  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-luca-400 mx-auto mb-3" />
          <p className="text-sm text-white/50">
            {authLoading ? 'Verificando sesión...' : 'Cargando tus datos...'}
          </p>
        </div>
      </div>
    );
  }

  // Landing
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-dark-950">
        <header className="sticky top-0 z-50 border-b border-dark-700/50 bg-dark-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <button onClick={() => setView('landing')} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luca-500">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Luca</span>
            </button>
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-sm text-neutral hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-neutral hover:text-white transition-colors">Precios</a>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.email?.split('@')[0]}</span>
                    {plan !== 'free' && <Crown className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl py-2 z-50">
                      <button
                        onClick={() => { setView('dashboard'); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        <BarChart3 className="h-4 w-4" /> Dashboard
                      </button>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                      >
                        <LogOut className="h-4 w-4" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setView('auth')}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="rounded-lg bg-luca-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-luca-600"
                  >
                    Empezar gratis
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
        <Landing
          onGetStarted={handleGetStarted}
          onLogin={() => setView('auth')}
        />
      </div>
    );
  }

  // App (upload + dashboard)
  return (
    <div className="min-h-screen bg-dark-950">
      <header className="sticky top-0 z-50 border-b border-dark-700/50 bg-dark-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 rounded-lg p-1.5 text-neutral transition-colors hover:bg-dark-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView(transactions.length > 0 ? 'dashboard' : 'upload')}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luca-500">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Luca</span>
            </button>
          </div>

          {transactions.length > 0 && (
            <nav className="flex items-center gap-1">
              <NavButton icon={<BarChart3 className="h-4 w-4" />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
              <NavButton icon={<Brain className="h-4 w-4" />} label="IA Advisor" active={false} onClick={() => setView('dashboard')} />
              <NavButton icon={<UploadIcon className="h-4 w-4" />} label="Subir" active={view === 'upload'} onClick={() => setView('upload')} />
            </nav>
          )}

          <div className="flex items-center gap-3">
            {transactions.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5">
                <FileText className="h-3.5 w-3.5 text-neutral" />
                <span className="text-xs text-neutral">{transactions.length} tx</span>
              </div>
            )}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  {plan !== 'free' && <Crown className="h-3 w-3 text-amber-400" />}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 text-xs text-white/40 border-b border-white/10">
                      {user?.email}
                    </div>
                    <div className="px-4 py-2 text-xs text-white/40">
                      Plan: <span className="text-luca-400 font-medium capitalize">{plan}</span>
                    </div>
                    <button
                      onClick={() => { signOut(); setView('landing'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setView('auth')}
                className="flex items-center gap-2 rounded-lg border border-luca-500/30 bg-luca-500/10 px-3 py-1.5 text-xs font-medium text-luca-400 hover:bg-luca-500/20 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                Guardar datos
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Banner for non-authenticated users with data */}
        {!isAuthenticated && transactions.length > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-luca-500/20 bg-luca-500/5 px-4 py-3">
            <User className="h-5 w-5 text-luca-400 flex-shrink-0" />
            <p className="text-sm text-white/70 flex-1">
              <button onClick={() => setView('auth')} className="font-medium text-luca-400 hover:text-luca-300">
                Crea una cuenta gratis
              </button>{' '}
              para guardar tus datos y no perderlos al cerrar.
            </p>
          </div>
        )}

        {view === 'upload' && (
          <UploadPage
            onTransactionsLoaded={(txs, filename, source) =>
              handleTransactionsLoaded(txs, filename, source)
            }
            hasData={transactions.length > 0}
            onGoToDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'dashboard' && <Dashboard transactions={transactions} />}
      </main>

      <footer className="border-t border-dark-700/50 py-6 text-center">
        <p className="text-xs text-neutral">
          Luca — Tu dinero, claro. {isAuthenticated ? 'Datos sincronizados con tu cuenta.' : 'Tus datos se guardan localmente.'}
        </p>
      </footer>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-luca-500/10 text-luca-400'
          : 'text-neutral hover:bg-dark-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
