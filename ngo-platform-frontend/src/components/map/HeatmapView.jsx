import { MapContainer, TileLayer } from 'react-leaflet';
import ClusterMarker from './ClusterMarker.jsx';

// Fallback center used only when there are no clusters yet to derive one from.
const DEFAULT_CENTER = [20.5937, 78.9629];

function computeCenter(clusters) {
  if (!clusters || clusters.length === 0) return DEFAULT_CENTER;
  const lat = clusters.reduce((sum, c) => sum + c.centroid.lat, 0) / clusters.length;
  const lng = clusters.reduce((sum, c) => sum + c.centroid.lng, 0) / clusters.length;
  return [lat, lng];
}

export default function HeatmapView({ clusters }) {
  const center = computeCenter(clusters);

  return (
    <div className="rounded-xl overflow-hidden border border-borderc" style={{ height: '600px' }}>
      <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clusters?.map((cluster) => (
          <ClusterMarker key={cluster.cluster_id} cluster={cluster} />
        ))}
      </MapContainer>
    </div>
  );
}