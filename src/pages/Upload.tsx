import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import FileDropZone from '../components/FileDropZone';
import type { FileUpload, Transaction } from '../lib/types';
import { parseCaixaBankCSV } from '../lib/parsers/caixabank';
import { parseRevolutCSV } from '../lib/parsers/revolut';

interface Props {
  onTransactionsLoaded: (transactions: Transaction[]) => void;
  hasData: boolean;
  onGoToDashboard: () => void;
}

async function parseFile(file: File): Promise<FileUpload> {
  const id = `upload-${Date.now()}`;
  const uploadedAt = new Date();

  if (file.name.endsWith('.csv')) {
    const text = await file.text();
    const source = detectSource(file.name, text);
    
    let transactions: Transaction[];
    if (source === 'revolut') {
      transactions = parseRevolutCSV(text);
    } else {
      transactions = parseCaixaBankCSV(text);
    }

    return {
      id,
      name: file.name,
      type: 'csv',
      source,
      status: 'done',
      transactions,
      uploadedAt,
    };
  }

  return {
    id,
    name: file.name,
    type: 'pdf',
    source: 'manual',
    status: 'error',
    transactions: [],
    error: 'Los PDFs se soportarán pronto. Por ahora, usa CSV.',
    uploadedAt,
  };
}

function detectSource(filename: string, content: string): FileUpload['source'] {
  const lower = filename.toLowerCase();
  if (lower.includes('caixa')) return 'caixabank';
  if (lower.includes('revolut') || lower.includes('consolidated')) return 'revolut';
  if (lower.includes('ing')) return 'ing';
  
  if (content.includes('Summary for Savings') || content.includes('Revolut')) return 'revolut';
  if (content.includes('Concepto;Fecha;Importe;Saldo')) return 'caixabank';
  
  return 'caixabank';
}

export default function Upload({ onTransactionsLoaded, hasData, onGoToDashboard }: Props) {
  const handleFileParsed = (upload: FileUpload) => {
    if (upload.status === 'done' && upload.transactions.length > 0) {
      onTransactionsLoaded(upload.transactions);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-luca-500/30 bg-luca-500/10 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-luca-400" />
          <span className="text-xs font-medium text-luca-400">
            Analiza tus finanzas con IA
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Sube tus extractos
        </h1>
        <p className="mt-3 text-lg text-neutral">
          Arrastra el CSV de tu banco y Luca te analiza todo al instante
        </p>
      </div>

      <FileDropZone onFileParsed={handleFileParsed} parseFile={parseFile} />

      <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Bancos soportados</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: 'CaixaBank', status: 'live', format: 'CSV ;' },
            { name: 'Revolut', status: 'live', format: 'CSV ,' },
            { name: 'ING', status: 'soon', format: '' },
            { name: 'N26', status: 'soon', format: '' },
          ].map((bank) => (
            <div
              key={bank.name}
              className="flex flex-col items-center gap-1 rounded-xl border border-dark-600 bg-dark-700 p-3"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-neutral" />
                <span className="text-sm text-white">{bank.name}</span>
                {bank.status === 'live' ? (
                  <span className="h-2 w-2 rounded-full bg-income" />
                ) : (
                  <span className="text-[10px] text-neutral">pronto</span>
                )}
              </div>
              {bank.format && (
                <span className="text-[10px] text-neutral">{bank.format}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How to export guides */}
      <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Como exportar tu CSV</h3>
        <div className="space-y-3">
          <details className="group">
            <summary className="cursor-pointer text-sm text-neutral hover:text-white transition-colors">
              CaixaBank / CaixaBankNow
            </summary>
            <p className="mt-2 text-xs text-neutral pl-4">
              App CaixaBank Now → Cuentas → Movimientos → Exportar (icono descargar arriba derecha) → CSV
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer text-sm text-neutral hover:text-white transition-colors">
              Revolut
            </summary>
            <p className="mt-2 text-xs text-neutral pl-4">
              App Revolut → Perfil → Extracto de cuenta → Seleccionar período → Generar extracto → CSV
            </p>
          </details>
        </div>
      </div>

      {hasData && (
        <button
          onClick={onGoToDashboard}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luca-500 py-4 text-lg font-semibold text-white transition-all hover:bg-luca-600 hover:shadow-lg hover:shadow-luca-500/25"
        >
          Ver tu dashboard
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
