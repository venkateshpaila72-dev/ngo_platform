import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerNgo } from '../../api/ngos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

export default function NgoRegisterForm() {
  const [form, setForm] = useState({
    name: '',
    district: '',
    contactEmail: '',
    password: '',
    lat: '',
    lng: '',
  });
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ngo = await registerNgo({
        name: form.name,
        district: form.district,
        location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        contact_email: form.contactEmail,
        password: form.password,
      });
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
        <label className="block text-sm font-medium text-foreground mb-1">Organization Name</label>
        <input
          required
          value={form.name}
          onChange={update('name')}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Hope Relief Foundation"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">District</label>
        <input
          required
          value={form.district}
          onChange={update('district')}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="e.g. Krishna"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Location</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            step="any"
            value={form.lat}
            onChange={update('lat')}
            className="rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Latitude"
          />
          <input
            required
            type="number"
            step="any"
            value={form.lng}
            onChange={update('lng')}
            className="rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Longitude"
          />
        </div>
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating}
          className="mt-2 text-xs font-semibold text-primary hover:underline disabled:opacity-60"
        >
          {locating ? 'Detecting...' : 'Use my current location'}
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Contact Email</label>
        <input
          required
          type="email"
          value={form.contactEmail}
          onChange={update('contactEmail')}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="you@ngo.org"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
        <input
          required
          type="password"
          minLength={6}
          value={form.password}
          onChange={update('password')}
          className="w-full rounded-lg border border-borderc px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="At least 6 characters"
        />
      </div>
      <Button type="submit" fullWidth loading={loading}>
        Create NGO Account
      </Button>
      <p className="text-sm text-muted text-center">
        Already registered?{' '}
        <Link to="/ngo/login" className="text-primary font-semibold hover:underline">
          Log in
        </Link>
      </p>
      <p className="text-xs text-muted text-center">
        You can set up capability profiles and invite volunteers after logging in.
      </p>
    </form>
  );
}