import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import EnRouteForm from '../../components/logistics/EnRouteForm.jsx';
import SynergyAlerts from '../../components/logistics/SynergyAlerts.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getNgo } from '../../api/ngos.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LogisticsPage() {
  const { session } = useAuth();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.id) return;
    setLoading(true);
    try {
      const data = await getNgo(session.id);
      setNgo(data);
    } finally {
      setLoading(false);
    }
  }, [session?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Logistics</h1>
        <p className="text-sm text-muted mb-6">
          Declare when you're en route to a distribution point so nearby NGOs heading the same way
          around the same time can coordinate shared transport.
        </p>

        <div className="mb-8">
          {loading ? (
            <LoadingSpinner label="Loading your travel status..." />
          ) : (
            <EnRouteForm ngoId={session?.id} enRoute={ngo?.en_route} onUpdated={load} />
          )}
        </div>

        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
          Shared-transport suggestions
        </p>
        <SynergyAlerts />
      </div>
    </DashboardLayout>
  );
}