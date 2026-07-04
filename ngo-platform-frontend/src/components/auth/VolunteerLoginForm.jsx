import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginVolunteer } from '../../api/volunteers.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

export default function VolunteerLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const volunteer = await loginVolunteer(email, password);
      login(volunteer, 'volunteer');
      navigate('/volunteer');
    } catch (err) {
      // axiosClient's interceptor already surfaces a toast with the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="********"
        />
      </div>
      <Button type="submit" fullWidth loading={loading}>
        Log In
      </Button>
      <p className="text-xs text-muted text-center">
        Don't have an account? Ask your NGO's admin to add you as a volunteer.
      </p>
    </form>
  );
}