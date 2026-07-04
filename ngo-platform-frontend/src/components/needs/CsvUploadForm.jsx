import { useState, useRef } from 'react';
import { ingestCsv } from '../../api/ingest.js';
import Button from '../common/Button.jsx';

export default function CsvUploadForm({ onIngested }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await ingestCsv(file);
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      onIngested?.();
    } catch (err) {
      // axiosClient's interceptor already surfaces a toast with the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-borderc rounded-xl p-6">
      <p className="font-heading font-semibold text-foreground mb-1">Upload Survey Data</p>
      <p className="text-sm text-muted mb-4">
        CSV must include lat, lng, need_type, and severity columns. Optional: quantity, unit, notes.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="flex-1 text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer"
        />
        <Button type="submit" loading={loading} disabled={!file}>
          Upload
        </Button>
      </form>

      {result && (
        <div className="mt-4 text-sm border-t border-borderc pt-4">
          <p className="text-success font-semibold">
            {result.records_ingested} record{result.records_ingested === 1 ? '' : 's'} ingested
          </p>
          {result.records_skipped > 0 && (
            <div className="mt-2">
              <p className="text-warning font-semibold">
                {result.records_skipped} row{result.records_skipped === 1 ? '' : 's'} skipped
              </p>
              <ul className="mt-1 list-disc list-inside text-muted space-y-0.5">
                {result.skip_reasons.slice(0, 5).map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
                {result.skip_reasons.length > 5 && (
                  <li>and {result.skip_reasons.length - 5} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}