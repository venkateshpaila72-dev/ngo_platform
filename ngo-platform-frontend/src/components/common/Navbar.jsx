import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-borderc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-xl text-primary">
          NGO Coordination Platform
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/volunteer/login"
            className={
              isActive('/volunteer/login')
                ? 'text-sm font-medium pb-1 transition-colors text-primary border-b-2 border-primary'
                : 'text-sm font-medium pb-1 transition-colors text-foreground hover:text-primary'
            }
          >
            Volunteer Login
          </Link>
          <Link
            to="/ngo/login"
            className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            NGO Login
          </Link>
        </div>
      </div>
    </nav>
  );
}