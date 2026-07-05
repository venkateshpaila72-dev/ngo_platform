import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import VolunteerForm from '../../components/common/volunteers/VolunteerForm.jsx';
import VolunteerList from '../../components/common/volunteers/VolunteerList.jsx';
import { listVolunteers } from '../../api/volunteers.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function VolunteersPage() {
  const { session } = useAuth();
  const [volunteers, setVolunteers] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.id) return;
    setLoading(true);
    try {
      const res = await listVolunteers(session.id);
      setVolunteers(res.volunteers);
    } catch (err) {
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreated = (volunteer) => {
    setVolunteers((prev) => [...(prev || []), volunteer]);
  };

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Volunteers</h1>
        <p className="text-sm text-muted mb-6">
          Add volunteers to your NGO and share their login with them. Volunteers pick up open
          tasks and submit proof of completed work from their own dashboard.
        </p>

        <div className="mb-8">
          <VolunteerForm ngoId={session?.id} onCreated={handleCreated} />
        </div>

        {loading ? <LoadingSpinner label="Loading volunteers..." /> : <VolunteerList volunteers={volunteers} />}
      </div>
    </DashboardLayout>
  );
}