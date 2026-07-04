import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem('ngo_platform_session');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('ngo_platform_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('ngo_platform_session');
    }
  }, [session]);

  const login = (userData, role) => setSession({ ...userData, role }); // role: 'ngo' | 'volunteer'
  const logout = () => setSession(null);

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}