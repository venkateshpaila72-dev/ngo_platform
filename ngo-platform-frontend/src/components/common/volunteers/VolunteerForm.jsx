import { useState } from 'react';
import Button from '../common/Button.jsx';
import { registerVolunteer } from '../../api/volunteers.js';

export default function VolunteerForm({ ngoId, onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const volunteer = await registerVolunteer({ ngoId, name, email, password });
      setName('');
      setEmail('');
      setPassword('');
      onCreated?.(volunteer);
    } catch (err) {
      // axiosClient's interceptor already surfaces a toast with the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-borderc rounded-xl p-6">
      <p className="font-heading font-semibold text-foreground mb-4">Add a volunteer</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Temporary password
          </label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Share this with them"
          />
        </div>
      </div>

      <Button type="submit" loading={loading}>
        Add volunteer
      </Button>
    </form>
  );
}