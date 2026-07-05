import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VolunteerLayout from '../../components/common/VolunteerLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProofUploadForm from '../../components/proofs/ProofUploadForm.jsx';
import { getTask } from '../../api/tasks.js';
import { submitProof } from '../../api/proofs.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';

export default function ProofSubmitPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTask(taskId)
      .then((data) => {
        if (!cancelled) setTask(data);
      })
      .catch(() => {
        if (!cancelled) setTask(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [taskId]);

  const handleSubmit = async ({ photoUrl, location, storyText, feedbackRating }) => {
    setSubmitting(true);
    try {
      await submitProof({
        taskId,
        ngoId: session.ngo_id,
        photoUrl,
        location,
        volunteerId: session.id,
        storyText,
        feedbackRating,
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VolunteerLayout>
      <div className="px-6 sm:px-8 py-8 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/volunteer')}
          className="text-sm font-semibold text-muted hover:text-primary mb-4"
        >
          &lt; Back to my tasks
        </button>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Submit proof</h1>

        {loading ? (
          <LoadingSpinner label="Loading task..." />
        ) : !task ? (
          <EmptyState title="Task not found" subtitle="It may have been removed or reassigned." />
        ) : done ? (
          <div className="bg-success/10 border border-success/30 rounded-xl p-6 mt-6 text-center">
            <p className="font-heading font-semibold text-lg text-foreground mb-1">
              Proof submitted
            </p>
            <p className="text-sm text-muted mb-4">
              An NGO admin will review your submission shortly.
            </p>
            <button
              onClick={() => navigate('/volunteer')}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Back to my tasks
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-6">
              {NEED_TYPE_LABELS[task.need_type] || task.need_type} task
              {task.total_quantity != null && ` \u2013 ${task.total_quantity} ${task.unit || ''}`}
            </p>
            <ProofUploadForm onSubmit={handleSubmit} submitting={submitting} />
          </>
        )}
      </div>
    </VolunteerLayout>
  );
}