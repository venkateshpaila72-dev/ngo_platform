import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getNgo } from '../../api/ngos.js';
import ReliabilityBadge from './ReliabilityBadge.jsx';
import EventModeBar from '../events/EventModeBar.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/dashboard/needs', label: 'Needs' },
  { to: '/dashboard/heatmap', label: 'Heatmap' },
  { to: '/dashboard/events', label: 'Event Mode' },
  { to: '/dashboard/logistics', label: 'Logistics' },
];

// Screens planned for later phases - shown so the sidebar reads as a
// complete map of the product, but not yet clickable. Matching and task
// detail are live now, but reached contextually from the Needs table
// rather than a standalone nav item.
const UPCOMING_ITEMS = [{ label: 'Unclaimed Tasks' }, { label: 'Proof Review' }];

export default function DashboardLayout({ children }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [reliability, setReliability] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (session?.id) {
      getNgo(session.id)
        .then((data) => {
          if (!cancelled) setReliability(data.reliability_score);
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [session?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 bg-card border-r border-borderc flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-borderc">
          <span className="font-heading font-bold text-lg text-primary">NGO Dashboard</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-primary/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-1 text-xs font-semibold text-muted uppercase tracking-wide">
            Coming soon
          </p>
          {UPCOMING_ITEMS.map((item) => (
            <span
              key={item.label}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted/60 cursor-not-allowed"
            >
              {item.label}
            </span>
          ))}
        </nav>

        <div className="p-4 border-t border-borderc">
          <p className="text-sm font-semibold text-foreground truncate">{session?.name}</p>
          <p className="text-xs text-muted truncate mb-2">{session?.contact_email}</p>
          <div className="mb-3">
            <ReliabilityBadge score={reliability} />
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm font-semibold text-critical hover:underline text-left"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <EventModeBar />
        <div className="flex-1 min-w-0">{children}</div>
      </main>
    </div>
  );
}