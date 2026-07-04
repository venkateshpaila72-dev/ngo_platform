import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ role, children }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to={role === 'volunteer' ? '/volunteer/login' : '/ngo/login'} replace />;
  }
  if (session.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}