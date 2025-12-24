// Authentication context handling JWT storage, user info, and route protection.
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [restoring, setRestoring] = useState(true);   // <-- NEW
  const navigate = useNavigate();

  const login = (newToken) => {
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      // const userData = { email: payload.email, role: payload.role };
      localStorage.setItem('auth_token', newToken);
      // localStorage.setItem('auth_user', JSON.stringify(userData));
      setToken(newToken);
      // setUser(userData);
      const expiresAt = payload.exp * 1000;
      const timeout = expiresAt - Date.now();
      setTimeout(() => logout(), timeout);
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        const expiresAt = payload.exp * 1000;
        if (expiresAt <= Date.now()) {
          logout();
        } else {
          setToken(savedToken);
          setUser({ email: payload.email, role: payload.role });
          const timeout = expiresAt - Date.now();
          setTimeout(() => logout(), timeout);
        }
      } catch {
        logout();
      }
    }
    setRestoring(false);   // <-- finished restoring
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    restoring,            // <-- expose flag
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
