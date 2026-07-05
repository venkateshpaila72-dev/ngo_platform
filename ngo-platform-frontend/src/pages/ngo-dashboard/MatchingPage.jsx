import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Badge from '../../components/common/Badge.jsx';
import MatchList from '../../components/matching/MatchList.jsx';
import SplitAssignForm from '../../components/matching/SplitAssignForm.jsx';
import { getNeed } from '../../api/needs.js';
import { getMatches } from '../../api/match.js';
import { splitAssignTask } from '../../api/tasks.js';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';
import { getSeverityBadgeClass } from '../../utils/severityColors.js';

export default function MatchingPage() {
  const { needId } = useParams();
  const navigate = useNavigate();
  const [need, setNeed] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [needRes, matchRes] = await Promise.all([getNeed(needId), getMatches(needId, 5)]);
      setNeed(needRes);
      setMatchData(matchRes);
    } catch (err) {
      setMatchData({ matches: [], candidates_in_range: 0 });
    } finally {
      setLoading(false);
    }
  }, [needId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (ngoId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ngoId)) {
        next.delete(ngoId);
      } else {
        next.add(ngoId);
      }
      return next;
    });
  };

  const selectedNgos = (matchData?.matches || [])
    .filter((m) => selected.has(m.ngo_id))
    .map((m) => ({ ngo_id: m.ngo_id, ngo_name: m.ngo_name }));

  const handleAssign = async (splits) => {
    setSubmitting(true);
    try {
      const result = await splitAssignTask(needId, splits);
      if (result.warning) toast.warn(result.warning);
      navigate(`/dashboard/tasks/${result.task_id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/needs')}
          className="text-sm font-semibold text-muted hover:text-primary mb-4"
        >
          &lt; Back to Needs
        </button>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">
          Match NGOs to need
        </h1>

        {loading || !need ? (
          <LoadingSpinner label="Finding candidates..." />
        ) : (
          <>
            <div className="bg-card border border-borderc rounded-xl p-5 mb-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-heading font-semibold text-foreground">
                  {NEED_TYPE_LABELS[need.need_type] || need.need_type}
                  {need.quantity != null && ` - ${need.quantity} ${need.unit || ''}`.trim()}
                </p>
                <p className="text-xs text-muted mt-1">
                  {need.location.lat.toFixed(3)}, {need.location.lng.toFixed(3)}
                </p>
              </div>
              <Badge color={getSeverityBadgeClass(need.severity)}>{need.severity}</Badge>
            </div>

            <p className="text-sm text-muted mb-3">
              {matchData.candidates_in_range} candidate
              {matchData.candidates_in_range === 1 ? '' : 's'} within range - select one or more
              to assign
            </p>

            <div className="mb-6">
              <MatchList matches={matchData.matches} selected={selected} onToggle={toggleSelect} />
            </div>

            <SplitAssignForm
              need={need}
              selectedNgos={selectedNgos}
              onSubmit={handleAssign}
              submitting={submitting}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}