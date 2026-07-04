import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginNgo } from '../../api/ngos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

export default function NgoLoginForm() {
  const [contactEmail, setContactEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ngo = await loginNgo(contactEmail, password);
      login(ngo, 'ngo');
      navigate('/dashboard');
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
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="you@ngo.org"
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
      <p className="text-sm text-muted text-center">
        New NGO?{' '}
        <Link to="/ngo/register" className="text-primary font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </form>
  );
}