import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function VolunteerLayout({ children }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 bg-card border-b border-borderc flex items-center justify-between px-6">
        <NavLink to="/volunteer" className="font-heading font-bold text-lg text-primary">
          Volunteer
        </NavLink>
        <div className="flex items-center gap-4">
          <p className="text-sm text-foreground hidden sm:block">{session?.name}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-critical hover:underline"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}