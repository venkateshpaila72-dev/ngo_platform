import { useState } from 'react';
import Button from '../common/Button.jsx';

export default function ResolveWithGapButton({ onResolve, busy }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold text-critical hover:underline"
      >
        No replacement available - close task with gap
      </button>
    );
  }

  return (
    <div className="bg-critical/5 border border-critical/30 rounded-xl p-4">
      <p className="text-sm text-foreground mb-3">
        This closes the task even though part of it is uncovered. The gap will be recorded on the
        need and task for reporting. This can't be undone.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setConfirming(false)} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onResolve} disabled={busy}>
          Confirm - close with gap
        </Button>
      </div>
    </div>
  );
}