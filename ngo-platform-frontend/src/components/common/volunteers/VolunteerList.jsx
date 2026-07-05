import Badge from '../Badge.jsx';
import EmptyState from '../EmptyState.jsx';

export default function VolunteerList({ volunteers }) {
  if (!volunteers || volunteers.length === 0) {
    return (
      <EmptyState
        title="No volunteers yet"
        subtitle="Add your first volunteer using the form above."
      />
    );
  }

  return (
    <div className="bg-card border border-borderc rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-borderc text-left">
            <th className="px-5 py-3 font-semibold text-muted">Name</th>
            <th className="px-5 py-3 font-semibold text-muted">Email</th>
            <th className="px-5 py-3 font-semibold text-muted">Status</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v.id} className="border-b border-borderc last:border-0">
              <td className="px-5 py-3 font-medium text-foreground">{v.name}</td>
              <td className="px-5 py-3 text-muted">{v.email}</td>
              <td className="px-5 py-3">
                <Badge color={v.status === 'active' ? 'bg-success text-white' : 'bg-muted text-white'}>
                  {v.status === 'active' ? 'Active' : v.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}