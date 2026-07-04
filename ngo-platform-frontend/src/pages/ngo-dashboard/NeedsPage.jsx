import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import CsvUploadForm from '../../components/needs/CsvUploadForm.jsx';
import NeedFilterBar from '../../components/needs/NeedFilterBar.jsx';
import NeedsTable from '../../components/needs/NeedsTable.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { listNeeds } from '../../api/needs.js';

export default function NeedsPage() {
  const [needs, setNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [needType, setNeedType] = useState('');

  const loadNeeds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listNeeds({ status, needType });
      setNeeds(data.needs);
    } catch (err) {
      setNeeds([]);
    } finally {
      setLoading(false);
    }
  }, [status, needType]);

  useEffect(() => {
    loadNeeds();
  }, [loadNeeds]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Needs</h1>
        <p className="text-sm text-muted mb-6">
          Upload survey data and review reported needs across your service area.
        </p>

        <div className="mb-8">
          <CsvUploadForm onIngested={loadNeeds} />
        </div>

        <div className="mb-4">
          <NeedFilterBar
            status={status}
            needType={needType}
            onStatusChange={setStatus}
            onNeedTypeChange={setNeedType}
          />
        </div>

        {loading ? <LoadingSpinner label="Loading needs..." /> : <NeedsTable needs={needs} />}
      </div>
    </DashboardLayout>
  );
}