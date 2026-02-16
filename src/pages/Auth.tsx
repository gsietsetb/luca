import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AuthPage({ onBack, onSuccess }: Props) {
  const { signInWithEmail, signUpWithEmail, signInWithMagicLink, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'magic') {
      const { error: err } = await signInWithMagicLink(email);
      if (err) setError(err);
      else setMagicSent(true);
    } else if (mode === 'login') {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err);
      else onSuccess();
    } else {
      const { error: err } = await signUpWithEmail(email, password);
      if (err) setError(err);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-luca-500/15 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="glass-strong rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-luca-500/30 to-purple-500/30">
              <Sparkles className="h-7 w-7 text-luca-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'signup' ? 'Crea tu cuenta' : 'Link mágico'}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {mode === 'magic'
                ? 'Te enviamos un link a tu email'
                : 'Guarda tus datos y accede desde cualquier lugar'}
            </p>
          </div>

          {magicSent ? (
            <div className="text-center py-6">
              <Mail className="mx-auto h-12 w-12 text-luca-400 mb-4" />
              <p className="text-white font-medium">Revisa tu email</p>
              <p className="text-sm text-white/50 mt-2">
                Hemos enviado un link a <span className="text-white">{email}</span>
              </p>
              <button
                onClick={() => { setMagicSent(false); setMode('login'); }}
                className="mt-6 text-sm text-luca-400 hover:text-luca-300"
              >
                Volver al login
              </button>
            </div>
          ) : (
            <>
              {/* Google Login */}
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-dark-900 px-3 text-xs text-white/30">o con email</span>
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-luca-500 focus:outline-none focus:ring-1 focus:ring-luca-500"
                    />
                  </div>
                </div>

                {mode !== 'magic' && (
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-luca-500 focus:outline-none focus:ring-1 focus:ring-luca-500"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-luca-500 to-luca-600 py-3 text-sm font-bold text-white shadow-lg shadow-luca-500/20 hover:shadow-xl hover:shadow-luca-500/30 transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Crear cuenta' : 'Enviar link'}
                </button>
              </form>

              {/* Switch modes */}
              <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                {mode === 'login' ? (
                  <>
                    <button onClick={() => setMode('signup')} className="text-luca-400 hover:text-luca-300">
                      ¿No tienes cuenta? Regístrate
                    </button>
                    <button onClick={() => setMode('magic')} className="text-white/40 hover:text-white/60">
                      Entrar con link mágico
                    </button>
                  </>
                ) : mode === 'signup' ? (
                  <button onClick={() => setMode('login')} className="text-luca-400 hover:text-luca-300">
                    ¿Ya tienes cuenta? Inicia sesión
                  </button>
                ) : (
                  <button onClick={() => setMode('login')} className="text-luca-400 hover:text-luca-300">
                    Volver al login con contraseña
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Tus datos nunca salen de tu cuenta. 100% privado.
        </p>
      </div>
    </div>
  );
}
