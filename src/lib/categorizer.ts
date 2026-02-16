import type { TransactionCategory } from './types';

interface CategoryRule {
  category: TransactionCategory;
  keywords: string[];
  exactMatch?: string[];
}

const RULES: CategoryRule[] = [
  {
    category: 'housing',
    keywords: ['aribau 9', 'piso', 'renta junio', 'renta sept', 'renta agosto', 'renta oct', 'renta nov'],
    exactMatch: ['WEON BALMES'],
  },
  {
    category: 'supermarket',
    keywords: [
      'coaliment', 'aldi', 'lidl', 'eroski', 'sorli', 'mercadona', 'charter', 'primaprix',
      'proxim', 'condis', 'alcampo', 'casa ametller', 'nick fruit', 'peixnot', 'macia ninot',
      'supermercat', 'supermercado', 'super shop', 'superestalvi', 'cife super',
      'montse y angel', 'escofet oliver', 'discount concejo', 'jespac',
    ],
  },
  {
    category: 'food',
    keywords: [
      'bar', 'restaurant', 'cafe', 'taverna', 'pizz', 'kebab', 'tapas', 'cervece',
      'grill', 'braseria', 'asador', 'taberna', 'bocata', 'empanada', 'creps',
      'gelat', 'heladeria', 'focacceria', 'makamaka', 'champanillo', 'ovella',
      'casa carmen', 'cu-cut', 'la cala', 'corallo', 'vinitus', 'tribeca',
      'vermuteca', 'noa noa', 'delacrem', 'sandwichez', 'milanesa', 'mingaton',
      'despensa', 'croq', 'forn mistral', 'roxy', 'jaleo', 'la rica kitchen',
      'doner', 'iskender', 'istanbul', 'rey de istanbul', 'savannah', 'caliente',
      'miramelindo', 'bilbao berria', 'dock', 'indian', 'ogham', 'kopas',
      'xativa', 'massamara', 'oassis', 'grandegracia', 'a prop', 'boys bar',
      'kostan', 'akelarre', 'snack', 'pecera', 'picaro', 'boa',
      'la fira', 'ideal cocktail', 'soma bar', 'arc de triomf',
      'comida', 'el copetin', 'torreon', 'spirale', 'hoppiness',
      'orxateria', 'anita helado', 'xoroi', 'ciao', 'peter cafe',
      'brasabuey', 'atseden', 'artajo', 'e.s. buenavista',
      'bonny and gava', 'decruzmorales', 'cottage', 'weon',
    ],
  },
  {
    category: 'subscriptions',
    keywords: ['spotify', 'apple.com/bill', 'openai', 'chatgpt', 'bicing', 'grit ventures'],
  },
  {
    category: 'transport',
    keywords: [
      'taxi', 'vueling', 'bicing', 'metropolitano', 'sata air', 'airasia',
      'bus/mrt', 'grab*', 'gasolina', 'e.s.', 'carburant', 'low cost fuel',
      'estacion servicio',
    ],
  },
  {
    category: 'shopping',
    keywords: [
      'decathlon', 'primark', 'zara', 'shein', 'intimissimi', 'c&a',
      'perfumeria primor', 'druni', 'bazar angela', 'armario y vida',
      'belles arts', 'skechers', 'buy non stop', 'fashion bug',
      'vistesdesalts', 'el corte ingles', 'crearte', 'plana y dieguez',
      'gran via 443', 'multimarca',
    ],
  },
  {
    category: 'health',
    keywords: [
      'farmacia', 'herbolario', 'herbolari', 'nusa medika', 'nawaloka',
      'hospital', 'productos parami', 'peak health', 'diet doctor',
      'gili air clinic',
    ],
  },
  {
    category: 'entertainment',
    keywords: [
      'fever', 'razzmatazz', 'discoteca', 'disco', 'sala', 'never bar',
      'miles away', 'entrapolis', 'dl palau', 'mooby', 'companyia central',
      'cova d', 'magic', 'garage beer', 'rei de copas', 'fira casanova',
      'instasorteos', 'iluzione', 'games',
    ],
  },
  {
    category: 'travel',
    keywords: [
      'gotogate', 'booking', 'agoda', 'hostel', 'hotel', 'equity point',
      'safestay', 'azores', 'marina bay', 'vueling', 'ruki dia',
      'enjoy it', 'sikim', 'jijonenca', 'ona', 'atlas tapas',
      'fanals', 'guille azores', 'monbus', 'tpi bandara',
      'payhere', 'adroit', 'aloft', 'mandapa', 'bali',
      'sol & luna', 'penida', 'lighthouse', 'deja\'vu',
      'fuvahmulah', 'pirates of maldiv', 'zola.com',
      'azorazul', 'catalonia barcelo', 'n n gromov',
      'ida-insurance',
    ],
  },
  {
    category: 'taxes',
    keywords: [
      'irpf', 'iva', 'tributos', 'impuesto renta', 'pagos a.e.a.t',
      'embargo', 'bsm dip grues', 'ajunt bcn',
    ],
  },
  {
    category: 'transfers',
    keywords: [
      'traspaso propio', 'transfer.hucha', 'revolut', 'transf.', 'trf.internacional',
      'bizum', 'wise', 'mycard', 'movimientos tarje', 'cuota dia a dia',
      'reint.cajero', 'ingreso cajero', 'complementos abri',
    ],
  },
  {
    category: 'income',
    keywords: ['transf. a su favor', 'arag s.e.', 'mm e.f. sant anto', 'divevolk'],
  },
  {
    category: 'diving',
    keywords: [
      'vertical freediv', 'divevolk', 'dream dive', 'aigua esport',
      'picornell', 'scuba', 'dive',
    ],
  },
  {
    category: 'technology',
    keywords: [
      'apple store', 'informatica', 'optikseis', 'name-cheap', 'go daddy',
      'sumup', 'happymovil', 'simyo', 'directf*',
      'pfs zacatrus', 'microfusa', 'lavado suave',
    ],
  },
];

export function categorizeTransaction(
  concept: string,
  amount: number,
): TransactionCategory {
  const lower = concept.toLowerCase();

  if (amount > 0) {
    const isTransfer = RULES.find((r) => r.category === 'transfers')?.keywords.some((k) =>
      lower.includes(k.toLowerCase()),
    );
    if (isTransfer) return 'transfers';
    return 'income';
  }

  for (const rule of RULES) {
    if (rule.exactMatch?.some((m) => concept === m)) {
      return rule.category;
    }
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return rule.category;
    }
  }

  return 'other';
}
