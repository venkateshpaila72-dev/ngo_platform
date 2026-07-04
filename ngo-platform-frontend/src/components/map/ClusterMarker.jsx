import { CircleMarker, Popup } from 'react-leaflet';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';

// Severity score is 0-10 (see backend clustering_service.py). Map it to a
// color and radius so worse hotspots are both redder and bigger.
function severityColor(score) {
  if (score >= 7) return '#DC2626'; // critical
  if (score >= 4) return '#EA580C'; // warning
  return '#059669'; // success
}

export default function ClusterMarker({ cluster }) {
  const radius = 10 + Math.min(cluster.need_count, 20) * 1.5;

  return (
    <CircleMarker
      center={[cluster.centroid.lat, cluster.centroid.lng]}
      radius={radius}
      pathOptions={{
        color: severityColor(cluster.severity_score),
        fillColor: severityColor(cluster.severity_score),
        fillOpacity: 0.5,
        weight: 2,
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold mb-1">
            {NEED_TYPE_LABELS[cluster.dominant_need] || cluster.dominant_need} hotspot
          </p>
          <p>{cluster.need_count} open need{cluster.need_count === 1 ? '' : 's'}</p>
          <p>Severity score: {cluster.severity_score} / 10</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}