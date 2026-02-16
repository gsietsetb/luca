import { useState, useCallback } from 'react';
import { Wallet, Upload as UploadIcon, BarChart3, FileText, Brain, ArrowLeft } from 'lucide-react';
import type { Transaction } from './lib/types';
import Landing from './pages/Landing';
import UploadPage from './pages/Upload';
import Dashboard from './pages/Dashboard';

type View = 'landing' | 'upload' | 'dashboard';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<View>('landing');

  const handleTransactionsLoaded = useCallback((newTx: Transaction[]) => {
    setTransactions((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const unique = newTx.filter((t) => !existingIds.has(t.id));
      return [...prev, ...unique];
    });
  }, []);

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
            <button
              onClick={() => setView('upload')}
              className="rounded-lg bg-luca-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-luca-600"
            >
              Empezar gratis
            </button>
          </div>
        </header>
        <Landing onGetStarted={() => setView('upload')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* App Header */}
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
              <NavButton
                icon={<BarChart3 className="h-4 w-4" />}
                label="Dashboard"
                active={view === 'dashboard'}
                onClick={() => setView('dashboard')}
              />
              <NavButton
                icon={<Brain className="h-4 w-4" />}
                label="IA Advisor"
                active={false}
                onClick={() => setView('dashboard')}
              />
              <NavButton
                icon={<UploadIcon className="h-4 w-4" />}
                label="Subir"
                active={view === 'upload'}
                onClick={() => setView('upload')}
              />
            </nav>
          )}

          <div className="flex items-center gap-3">
            {transactions.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5">
                <FileText className="h-3.5 w-3.5 text-neutral" />
                <span className="text-xs text-neutral">
                  {transactions.length} tx
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {view === 'upload' && (
          <UploadPage
            onTransactionsLoaded={handleTransactionsLoaded}
            hasData={transactions.length > 0}
            onGoToDashboard={() => setView('dashboard')}
          />
        )}
        {view === 'dashboard' && <Dashboard transactions={transactions} />}
      </main>

      <footer className="border-t border-dark-700/50 py-6 text-center">
        <p className="text-xs text-neutral">
          Luca — Tu dinero, claro. Tus datos nunca salen de tu navegador.
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
