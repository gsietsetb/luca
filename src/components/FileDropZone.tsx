import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { FileUpload } from '../lib/types';

interface Props {
  onFileParsed: (file: FileUpload) => void;
  parseFile: (file: File) => Promise<FileUpload>;
}

export default function FileDropZone({ onFileParsed, parseFile }: Props) {
  const [processing, setProcessing] = useState<string[]>([]);
  const [results, setResults] = useState<{ name: string; status: 'done' | 'error'; count?: number }[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        setProcessing((prev) => [...prev, file.name]);
        try {
          const result = await parseFile(file);
          onFileParsed(result);
          setResults((prev) => [...prev, { name: file.name, status: 'done', count: result.transactions.length }]);
        } catch {
          setResults((prev) => [...prev, { name: file.name, status: 'error' }]);
        } finally {
          setProcessing((prev) => prev.filter((n) => n !== file.name));
        }
      }
    },
    [onFileParsed, parseFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-12
          transition-all duration-300 cursor-pointer group
          ${isDragActive
            ? 'border-luca-500 bg-luca-500/10 scale-[1.02]'
            : 'border-dark-500 bg-dark-800/50 hover:border-luca-500/50 hover:bg-dark-800'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`
              rounded-2xl p-4 transition-all duration-300
              ${isDragActive ? 'bg-luca-500/20 text-luca-400' : 'bg-dark-700 text-neutral group-hover:text-luca-400'}
            `}
          >
            <Upload className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {isDragActive ? 'Suelta tus archivos aquí' : 'Arrastra tus extractos bancarios'}
            </p>
            <p className="mt-1 text-sm text-neutral">
              CSV de CaixaBank, Revolut, ING... o PDFs de nóminas
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-dark-600 px-3 py-1 text-xs font-medium text-neutral">
              .csv
            </span>
            <span className="rounded-full bg-dark-600 px-3 py-1 text-xs font-medium text-neutral">
              .pdf
            </span>
          </div>
        </div>
        {isDragActive && (
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-luca-500/5" />
        )}
      </div>

      {(processing.length > 0 || results.length > 0) && (
        <div className="space-y-2">
          {processing.map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-xl bg-dark-800 p-3">
              <Loader2 className="h-4 w-4 animate-spin text-luca-400" />
              <FileText className="h-4 w-4 text-neutral" />
              <span className="text-sm text-white">{name}</span>
              <span className="ml-auto text-xs text-neutral">Analizando...</span>
            </div>
          ))}
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-dark-800 p-3">
              {r.status === 'done' ? (
                <CheckCircle className="h-4 w-4 text-income" />
              ) : (
                <AlertCircle className="h-4 w-4 text-expense" />
              )}
              <FileText className="h-4 w-4 text-neutral" />
              <span className="text-sm text-white">{r.name}</span>
              {r.status === 'done' && (
                <span className="ml-auto text-xs text-income">{r.count} transacciones</span>
              )}
              {r.status === 'error' && (
                <span className="ml-auto text-xs text-expense">Error al parsear</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
