import Card from '../common/Card.jsx';
import { useStaggerReveal } from '../../hooks/useScrollReveal.js';

export default function ImpactScorecards({ gallery, ngos }) {
  const containerRef = useStaggerReveal();

  const needsResolved = gallery ? gallery.length : 0;
  const activeNgos = ngos ? ngos.length : 0;
  const tasksCompleted = ngos
    ? ngos.reduce((sum, n) => sum + (n.tasks_completed || 0), 0)
    : 0;
  const districts = new Set((ngos || []).map((n) => n.district)).size;

  const stats = [
    { label: 'Needs Resolved', value: needsResolved },
    { label: 'Active NGOs', value: activeNgos },
    { label: 'Tasks Completed', value: tasksCompleted },
    { label: 'Districts Covered', value: districts },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
      <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} hoverLift={false} className="p-5 text-center">
            <p className="font-heading font-bold text-3xl text-primary">{s.value}</p>
            <p className="text-sm text-muted mt-1">{s.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}