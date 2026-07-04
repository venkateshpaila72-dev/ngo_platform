import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function NgoDirectoryGrid({ ngos }) {
  if (!ngos || ngos.length === 0) {
    return (
      <EmptyState
        title="No NGOs registered yet"
        subtitle="Organizations that join the platform will appear here, ranked by tasks completed."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {ngos.map((ngo) => (
        <Card key={ngo.ngo_id} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-heading font-semibold text-foreground">{ngo.name}</h4>
              <p className="text-sm text-muted">{ngo.district}</p>
            </div>
            <Badge color="bg-primary/10 text-primary">
              {ngo.reliability_score ? ngo.reliability_score.toFixed(0) : '0'} rel.
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {(ngo.capabilities || []).map((cap) => (
              <Badge key={cap} color="bg-accent/10 text-accent">
                {cap}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted mt-3">
            <span className="font-semibold text-foreground">{ngo.tasks_completed}</span> of{' '}
            {ngo.tasks_total} tasks completed
          </p>
        </Card>
      ))}
    </div>
  );
}