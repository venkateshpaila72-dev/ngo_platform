import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProofReviewCard from '../../components/proofs/ProofReviewCard.jsx';
import { listProofs, verifyProof } from '../../api/proofs.js';
import { listNgos } from '../../api/ngos.js';
import { useAuth } from '../../context/AuthContext.jsx';

const TABS = [
  { key: 'pending_verification', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function ProofReviewPage() {
  const { session } = useAuth();
  const [tab, setTab] = useState('pending_verification');
  const [proofs, setProofs] = useState(null);
  const [ngoNames, setNgoNames] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [proofsRes, ngosRes] = await Promise.all([
        listProofs({ status: tab, ngoId: session?.id }),
        listNgos(),
      ]);
      setProofs(proofsRes.proofs);
      setNgoNames(Object.fromEntries(ngosRes.ngos.map((n) => [n.id, n.name])));
    } catch (err) {
      setProofs([]);
    } finally {
      setLoading(false);
    }
  }, [tab, session?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (proofId) => {
    await verifyProof(proofId, true);
    await load();
  };

  const handleReject = async (proofId) => {
    await verifyProof(proofId, false);
    await load();
  };

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Proof Review</h1>
        <p className="text-sm text-muted mb-6">
          Review photo proof submitted by volunteers before marking work complete.
        </p>

        <div className="flex gap-2 mb-6 border-b border-borderc">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading proofs..." />
        ) : !proofs || proofs.length === 0 ? (
          <EmptyState
            title="Nothing here"
            subtitle={
              tab === 'pending_verification'
                ? 'No submissions are waiting on review right now.'
                : `No ${TABS.find((t) => t.key === tab)?.label.toLowerCase()} submissions yet.`
            }
          />
        ) : (
          <div className="space-y-4">
            {proofs.map((proof) => (
              <ProofReviewCard
                key={proof.id}
                proof={proof}
                ngoName={ngoNames[proof.ngo_id]}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}