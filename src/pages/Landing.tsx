import {
  Upload,
  Brain,
  Shield,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Zap,
  Check,
  Star,
  ArrowRight,
  BarChart3,
  Wallet,
  AlertTriangle,
  Building2,
  Eye,
  Lock,
  Repeat,
  Target,
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

const MOCK_MONTHS = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
const MOCK_INCOME = [3800, 4200, 3500, 5100, 3900, 4600, 3200];
const MOCK_EXPENSE = [2900, 3100, 2800, 3400, 4200, 2600, 2100];
const MOCK_CATEGORIES = [
  { name: 'Restaurantes', pct: 28, color: '#f59e0b', amount: '€340/mes' },
  { name: 'Vivienda', pct: 22, color: '#8b5cf6', amount: '€1.236/mes' },
  { name: 'Supermercado', pct: 15, color: '#84cc16', amount: '€180/mes' },
  { name: 'Transporte', pct: 12, color: '#3b82f6', amount: '€145/mes' },
  { name: 'Ocio', pct: 10, color: '#ec4899', amount: '€120/mes' },
  { name: 'Suscripciones', pct: 8, color: '#06b6d4', amount: '€56/mes' },
  { name: 'Otros', pct: 5, color: '#6b7280', amount: '€60/mes' },
];

export default function Landing({ onGetStarted }: Props) {
  return (
    <div className="relative overflow-hidden">
      {/* === HERO === */}
      <section className="relative min-h-[100vh] flex items-center px-4 py-20">
        {/* Gradient Mesh Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-luca-500/20 blur-[150px] animate-pulse-glow" />
          <div className="absolute top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[130px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white/80">
                  Tu asesor financiero con IA
                </span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.1]">
                Tu dinero,{' '}
                <span className="bg-gradient-to-r from-luca-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  claro.
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/60 max-w-lg leading-relaxed">
                Arrastra tu extracto bancario y en segundos descubre: cuánto gastas realmente, 
                en qué se va tu dinero, qué se lleva Hacienda, y cuánto podrías ahorrar.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-luca-500 to-luca-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-luca-500/20 transition-all hover:shadow-2xl hover:shadow-luca-500/30 hover:scale-[1.02]"
                >
                  <Zap className="h-5 w-5" />
                  Analiza gratis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center gap-3 text-sm text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Sin registro
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    100% privado
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Dashboard Preview */}
            <div className="animate-slide-up-delay relative">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* === AI INSIGHT FLOATING DEMO === */}
      <section className="relative px-4 -mt-10 mb-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass-strong rounded-2xl p-6 shadow-2xl animate-float-slow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-luca-500/30 to-purple-500/30">
                <Brain className="h-6 w-6 text-luca-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-white">Luca AI dice:</span>
                  <span className="rounded-full bg-luca-500/20 px-2 py-0.5 text-[10px] font-semibold text-luca-300">Gemini</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  "Gastas <span className="font-semibold text-amber-400">€340/mes</span> en restaurantes — un 18% más que la media de Barcelona. 
                  Tus suscripciones suman <span className="font-semibold text-cyan-400">€56/mes</span> (€672/año). 
                  Tu IRPF efectivo es del <span className="font-semibold text-red-400">28.5%</span>. 
                  Con 3 ajustes podrías ahorrar <span className="font-semibold text-emerald-400">€380/mes</span>."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS (3 steps visual) === */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-luca-400">Así funciona</span>
            <h2 className="mt-3 text-4xl font-bold text-white">3 pasos. 30 segundos.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Upload className="h-7 w-7" />,
                title: 'Arrastra tu CSV',
                desc: 'Exporta de CaixaBank, Revolut, ING... y suéltalo aquí. Drag & drop.',
                gradient: 'from-luca-500/20 to-blue-500/20',
                iconColor: 'text-luca-300',
                visual: (
                  <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-white/20 mb-2" />
                    <div className="text-[10px] text-white/30">CaixaBank_2026.csv</div>
                    <div className="mt-2 flex justify-center gap-1">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/30">.csv</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/30">.pdf</span>
                    </div>
                  </div>
                ),
              },
              {
                step: '02',
                icon: <Brain className="h-7 w-7" />,
                title: 'IA analiza todo',
                desc: 'Gemini categoriza, detecta patrones, calcula impuestos y encuentra ahorro.',
                gradient: 'from-purple-500/20 to-pink-500/20',
                iconColor: 'text-purple-300',
                visual: (
                  <div className="mt-4 space-y-2">
                    {['Categorizando 604 transacciones...', 'Detectando suscripciones...', 'Calculando IRPF estimado...', 'Generando insights...'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]" style={{ opacity: 1 - i * 0.2 }}>
                        <div className={`h-1.5 w-1.5 rounded-full ${i < 3 ? 'bg-emerald-400' : 'bg-luca-400 animate-pulse'}`} />
                        <span className="text-white/40">{t}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: '03',
                icon: <Eye className="h-7 w-7" />,
                title: 'Tu diagnóstico',
                desc: 'Dashboard visual con todo: gastos, ahorro, impuestos, alertas y plan de acción.',
                gradient: 'from-emerald-500/20 to-teal-500/20',
                iconColor: 'text-emerald-300',
                visual: (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5">
                      <div className="text-[9px] text-emerald-300/60">Score</div>
                      <div className="text-lg font-bold text-emerald-300">72</div>
                    </div>
                    <div className="rounded-lg bg-amber-500/10 p-2.5">
                      <div className="text-[9px] text-amber-300/60">Ahorro</div>
                      <div className="text-lg font-bold text-amber-300">€380</div>
                    </div>
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-white/20">{item.step}</span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/50">{item.desc}</p>
                {item.visual}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === VISUAL FEATURES SHOWCASE === */}
      <section className="relative px-4 py-24">
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/8 blur-[150px]" />
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Features</span>
            <h2 className="mt-3 text-4xl font-bold text-white">Lo que ninguna app te daba</h2>
            <p className="mt-3 text-white/50">IA real. No categorías básicas.</p>
          </div>

          {/* Feature 1: Category breakdown visual */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-3xl p-8 animate-float-slow">
              <h3 className="text-sm font-bold text-white/60 mb-4">Desglose por categorías</h3>
              <div className="space-y-3">
                {MOCK_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-white/70 w-28">{cat.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full animate-bar-grow"
                        style={{ width: `${cat.pct}%`, backgroundColor: cat.color, animationDelay: `${MOCK_CATEGORIES.indexOf(cat) * 0.1}s` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white/50 w-20 text-right">{cat.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 w-fit mb-4">
                <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-amber-300">Categorización automática</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Sabes exactamente a dónde va cada euro</h3>
              <p className="mt-3 text-white/50">La IA categoriza cada transacción automáticamente. Restaurantes, super, transporte, suscripciones... todo desglosado.</p>
            </div>
          </div>

          {/* Feature 2: Tax estimator */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 w-fit mb-4">
                <Receipt className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-red-300">Estimador fiscal</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Cuánto se lleva Hacienda</h3>
              <p className="mt-3 text-white/50">IRPF, Seguridad Social, retenciones... calculado sobre tus datos reales. Con tips para optimizar legalmente.</p>
            </div>
            <div className="glass-card rounded-3xl p-8 animate-float order-1 lg:order-2">
              <h3 className="text-sm font-bold text-white/60 mb-5">Estimación fiscal 2025</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl bg-red-500/10 p-4">
                  <div className="text-[10px] text-red-300/60 mb-1">IRPF estimado</div>
                  <div className="text-2xl font-extrabold text-red-300">€11.230</div>
                </div>
                <div className="rounded-2xl bg-amber-500/10 p-4">
                  <div className="text-[10px] text-amber-300/60 mb-1">Tipo efectivo</div>
                  <div className="text-2xl font-extrabold text-amber-300">28.5%</div>
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-white/40">Tip: Los gastos de tu actividad profesional (IAE 763) son deducibles. Podrías reducir la base imponible en ~€2.400.</p>
              </div>
            </div>
          </div>

          {/* Feature 3: AI Insights */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-8 animate-float-slow">
              <h3 className="text-sm font-bold text-white/60 mb-4">Insights de IA</h3>
              <div className="space-y-3">
                {[
                  { icon: <PiggyBank className="h-4 w-4" />, text: 'Reduciendo restaurantes un 20% ahorras €68/mes', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: <Repeat className="h-4 w-4" />, text: 'Spotify + ChatGPT + Apple = €56/mes (€672/año)', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { icon: <AlertTriangle className="h-4 w-4" />, text: 'Noviembre gasté un 40% más de lo normal', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { icon: <Target className="h-4 w-4" />, text: 'A este ritmo llegas a €5.000 ahorrados en mayo', color: 'text-luca-400', bg: 'bg-luca-500/10' },
                ].map((insight, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-xl ${insight.bg} p-3`}>
                    <div className={insight.color}>{insight.icon}</div>
                    <span className="text-xs text-white/60">{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 w-fit mb-4">
                <Brain className="h-3.5 w-3.5 text-luca-400" />
                <span className="text-xs text-luca-300">Powered by Gemini</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Tu asesor financiero personal</h3>
              <p className="mt-3 text-white/50">No es un chatbot genérico. Analiza TUS transacciones reales y te da consejos personalizados con cantidades exactas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === SOCIAL PROOF === */}
      <section className="relative px-4 py-24">
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[600px] rounded-full bg-luca-500/5 blur-[150px]" />
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">La gente ya lo pide</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { quote: '"Fas servir alguna app per seguir les despeses? La que feia servir avui no va..."', name: 'Albert R.', tag: 'Barcelona' },
              { quote: '"Estic fart de les apps que hi han. Necessito algo amb IA de veritat."', name: 'Guille S.', tag: 'Engineer' },
              { quote: '"No sé cuánto me quedo después de impuestos. Necesito algo que me lo calcule."', name: 'María L.', tag: 'Autónoma' },
            ].map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 transition-all hover:scale-[1.02]">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 italic leading-relaxed">{t.quote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-luca-500/30 to-purple-500/30 text-xs font-bold text-white/80">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-[10px] text-white/30">{t.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PRICING === */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pricing</span>
            <h2 className="mt-3 text-4xl font-bold text-white">Simple y transparente</h2>
            <p className="mt-3 text-white/50">Como tu dinero debería ser.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              name="Gratis"
              price="€0"
              period="para siempre"
              features={['1 extracto CSV', 'Dashboard básico', 'Categorización auto', '100 transacciones']}
              cta="Empezar gratis"
              onCta={onGetStarted}
              accent={false}
            />
            <PricingCard
              name="Pro"
              price="€5"
              period="/mes"
              popular
              features={['CSV ilimitados', 'IA análisis profundo', 'Estimador fiscal IRPF', 'Multi-banco', 'Detector de ahorro', 'Alertas inteligentes', 'Historial completo']}
              cta="14 días gratis"
              onCta={onGetStarted}
              accent
            />
            <PricingCard
              name="Autónomos"
              price="€12"
              period="/mes"
              features={['Todo de Pro', 'Simulador de renta', 'Gastos deducibles auto', 'Modelo 130/303', 'Export para gestor', 'Soporte prioritario']}
              cta="Próximamente"
              onCta={() => {}}
              accent={false}
            />
          </div>
        </div>
      </section>

      {/* === BANKS === */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs text-white/30 mb-6 uppercase tracking-widest font-bold">Compatible con</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'CaixaBank', live: true },
              { name: 'Revolut', live: true },
              { name: 'ING', live: false },
              { name: 'N26', live: false },
              { name: 'BBVA', live: false },
              { name: 'Santander', live: false },
              { name: 'Wise', live: false },
            ].map((b) => (
              <div key={b.name} className={`glass rounded-xl px-4 py-2.5 flex items-center gap-2 ${b.live ? 'border-luca-500/20' : ''}`}>
                <Building2 className={`h-4 w-4 ${b.live ? 'text-white/60' : 'text-white/20'}`} />
                <span className={`text-sm ${b.live ? 'text-white/80 font-medium' : 'text-white/30'}`}>{b.name}</span>
                {b.live && <div className="h-2 w-2 rounded-full bg-emerald-400" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="relative glass-strong rounded-3xl p-12 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-luca-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-[80px]" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-luca-500/30 to-purple-500/30">
                <Wallet className="h-8 w-8 text-luca-300" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Deja de adivinar.<br />Empieza a saber.
              </h2>
              <p className="mt-3 text-white/50">
                Tu dinero merece claridad.
              </p>
              <button
                onClick={onGetStarted}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-luca-500 to-luca-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-luca-500/20 transition-all hover:shadow-2xl hover:shadow-luca-500/30 hover:scale-[1.02]"
              >
                <Zap className="h-5 w-5" />
                Analiza tus finanzas
              </button>
              <p className="mt-4 text-xs text-white/30">Gratis. Sin registro. 100% privado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-luca-400" />
            <span className="font-bold text-white">Luca</span>
          </div>
          <p className="text-xs text-white/30">
            © 2026 Luca. Tus datos nunca salen de tu navegador.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ===========================
   DASHBOARD PREVIEW COMPONENT
   =========================== */
function DashboardPreview() {
  const maxIncome = Math.max(...MOCK_INCOME);
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-luca-500/10 to-purple-500/10 blur-xl" />
      
      <div className="relative glass-strong rounded-3xl p-5 shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-luca-500 to-luca-600 flex items-center justify-center">
              <Wallet className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-bold text-white/80">Mi Dashboard</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/40" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Ingresos', value: '€4.600', icon: <TrendingUp className="h-3 w-3" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Gastos', value: '€2.600', icon: <TrendingDown className="h-3 w-3" />, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Ahorro', value: '€380', icon: <PiggyBank className="h-3 w-3" />, color: 'text-luca-300', bg: 'bg-luca-500/10' },
            { label: 'Score', value: '72', icon: <Zap className="h-3 w-3" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} p-2.5`}>
              <div className="flex items-center gap-1 mb-1">
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-white/30">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl bg-white/[0.02] p-3 mb-3">
          <div className="text-[10px] text-white/30 mb-2">Ingresos vs Gastos</div>
          <div className="flex items-end gap-[3px] h-24">
            {MOCK_MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-[2px]">
                <div className="w-full flex gap-[1px]">
                  <div
                    className="flex-1 rounded-t-sm bg-emerald-400/50 animate-bar-grow"
                    style={{ height: `${(MOCK_INCOME[i] / maxIncome) * 80}px`, animationDelay: `${i * 0.08}s` }}
                  />
                  <div
                    className="flex-1 rounded-t-sm bg-red-400/40 animate-bar-grow"
                    style={{ height: `${(MOCK_EXPENSE[i] / maxIncome) * 80}px`, animationDelay: `${i * 0.08 + 0.04}s` }}
                  />
                </div>
                <span className="text-[8px] text-white/20">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini category donut + transactions */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/[0.02] p-3">
            <div className="text-[10px] text-white/30 mb-2">Categorías</div>
            <div className="space-y-1.5">
              {MOCK_CATEGORIES.slice(0, 4).map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-[9px] text-white/40 flex-1">{c.name}</span>
                  <span className="text-[9px] text-white/30">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.02] p-3">
            <div className="text-[10px] text-white/30 mb-2">Últimas</div>
            <div className="space-y-1.5">
              {[
                { name: 'Spotify', amount: '-€17.99', color: '#06b6d4' },
                { name: 'Coaliment', amount: '-€32.83', color: '#84cc16' },
                { name: 'Nómina', amount: '+€3.294', color: '#10b981' },
                { name: 'Alquiler', amount: '-€1.236', color: '#8b5cf6' },
              ].map((tx) => (
                <div key={tx.name} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tx.color }} />
                  <span className="text-[9px] text-white/40 flex-1">{tx.name}</span>
                  <span className={`text-[9px] font-medium ${tx.amount.startsWith('+') ? 'text-emerald-400/70' : 'text-white/30'}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI card */}
      <div className="absolute -bottom-6 -right-4 glass rounded-xl p-3 shadow-xl animate-float max-w-[200px]">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-3 w-3 text-luca-300" />
          <span className="text-[9px] font-bold text-white/70">AI Insight</span>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed">
          Podrías ahorrar <span className="text-emerald-400 font-semibold">€380/mes</span> con 3 cambios simples
        </p>
      </div>

      {/* Floating score */}
      <div className="absolute -top-3 -left-3 glass rounded-xl p-2.5 shadow-xl animate-float-delay">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="72, 100" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">72</span>
          </div>
          <div>
            <div className="text-[9px] font-bold text-white/70">Salud</div>
            <div className="text-[8px] text-emerald-400/60">Buena</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   PRICING CARD
   =========================== */
function PricingCard({
  name, price, period, features, cta, onCta, accent, popular,
}: {
  name: string; price: string; period: string; features: string[];
  cta: string; onCta: () => void; accent: boolean; popular?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl p-8 transition-all hover:scale-[1.02] ${
      accent ? 'glass-strong border-luca-500/30 shadow-xl shadow-luca-500/10' : 'glass-card'
    }`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-luca-500 to-purple-500 px-4 py-1 text-[10px] font-bold text-white shadow-lg">
          Popular
        </div>
      )}
      <h3 className="text-lg font-bold text-white">{name}</h3>
      <p className="mt-4">
        <span className="text-4xl font-extrabold text-white">{price}</span>
        <span className="text-sm text-white/30">{period}</span>
      </p>
      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/60">
            <Check className={`h-4 w-4 flex-shrink-0 ${accent ? 'text-luca-400' : 'text-white/20'}`} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
          accent
            ? 'bg-gradient-to-r from-luca-500 to-luca-600 text-white shadow-lg shadow-luca-500/20 hover:shadow-xl hover:shadow-luca-500/30'
            : 'glass text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
