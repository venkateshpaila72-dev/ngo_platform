import { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import HeatmapView from '../../components/map/HeatmapView.jsx';
import NeedTypeToggle from '../../components/map/NeedTypeToggle.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { getClusters } from '../../api/clusters.js';

export default function HeatmapPage() {
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needType, setNeedType] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getClusters();
        setClusters(data.clusters);
      } catch (err) {
        setClusters([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredClusters = useMemo(() => {
    if (!clusters) return [];
    if (!needType) return clusters;
    return clusters.filter((c) => c.dominant_need === needType);
  }, [clusters, needType]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Heatmap</h1>
        <p className="text-sm text-muted mb-6">
          Open needs are grouped into geographic hotspots and ranked by severity. Circle size
          reflects need count; color reflects severity.
        </p>

        <div className="mb-6">
          <NeedTypeToggle active={needType} onChange={setNeedType} />
        </div>

        {loading ? (
          <LoadingSpinner label="Loading hotspots..." />
        ) : filteredClusters.length === 0 ? (
          <EmptyState
            title="No hotspots to show"
            subtitle="Upload needs data or clear your filter to see the heatmap populate."
          />
        ) : (
          <HeatmapView clusters={filteredClusters} />
        )}
      </div>
    </DashboardLayout>
  );
}