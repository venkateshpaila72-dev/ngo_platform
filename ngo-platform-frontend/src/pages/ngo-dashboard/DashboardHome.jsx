import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import KpiCard from '../../components/common/KpiCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { listNeeds } from '../../api/needs.js';
import { getClusters } from '../../api/clusters.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardHome() {
  const { session } = useAuth();
  const [needs, setNeeds] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [needsRes, clustersRes] = await Promise.all([listNeeds(), getClusters()]);
        setNeeds(needsRes.needs);
        setClusters(clustersRes.clusters);
      } catch (err) {
        setNeeds([]);
        setClusters([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openCount = needs?.filter((n) => n.status === 'open').length ?? 0;
  const assignedCount = needs?.filter((n) => n.status === 'assigned').length ?? 0;
  const resolvedCount = needs?.filter((n) => n.status === 'resolved').length ?? 0;
  const topCluster = clusters?.[0];

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">
          Welcome back{session?.name ? `, ${session.name}` : ''}
        </h1>
        <p className="text-sm text-muted mb-8">
          Here's a snapshot of current relief activity in your area.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading dashboard..." />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <KpiCard label="Open Needs" value={openCount} accent="text-critical" />
              <KpiCard label="Assigned" value={assignedCount} accent="text-warning" />
              <KpiCard label="Resolved" value={resolvedCount} accent="text-success" />
              <KpiCard label="Active Hotspots" value={clusters?.length ?? 0} accent="text-primary" />
            </div>

            {topCluster && (
              <div className="bg-card border border-borderc rounded-xl p-6 mb-10">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                  Highest priority hotspot
                </p>
                <p className="font-heading font-semibold text-lg text-foreground mb-1">
                  {topCluster.need_count} needs - dominant type: {topCluster.dominant_need}
                </p>
                <p className="text-sm text-muted">
                  Severity score {topCluster.severity_score} / 10 - centroid (
                  {topCluster.centroid.lat.toFixed(3)}, {topCluster.centroid.lng.toFixed(3)})
                </p>
                <Link
                  to="/dashboard/heatmap"
                  className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  View on heatmap
                </Link>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/dashboard/needs"
                className="bg-card border border-borderc rounded-xl p-6 hover:border-primary transition-colors"
              >
                <p className="font-heading font-semibold text-foreground mb-1">Manage Needs</p>
                <p className="text-sm text-muted">Upload survey data and review the full needs list.</p>
              </Link>
              <Link
                to="/dashboard/heatmap"
                className="bg-card border border-borderc rounded-xl p-6 hover:border-primary transition-colors"
              >
                <p className="font-heading font-semibold text-foreground mb-1">View Heatmap</p>
                <p className="text-sm text-muted">See geographic hotspots ranked by severity.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}