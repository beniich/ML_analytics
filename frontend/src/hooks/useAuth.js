import { useState, useEffect, createContext, useContext } from 'react';
import { ApiService } from '../services/api';

const AuthContext = createContext();

// ─── DEV BYPASS ──────────────────────────────────────────────────────────────
// Authentication is bypassed for local development.
// The dashboard loads immediately with a mock admin user.
// To re-enable auth, set DEV_BYPASS = false and ensure the backend is running.
const DEV_BYPASS = true;
const MOCK_USER  = { username: 'Admin', userId: 'dev-001', role: 'admin', plan: 'Pro' };
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user,            setUser]            = useState(DEV_BYPASS ? MOCK_USER : null);
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_BYPASS);
  const [loading,         setLoading]         = useState(!DEV_BYPASS);

  useEffect(() => {
    if (DEV_BYPASS) return; // skip token check in dev mode

    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Simple base64 JWT decode (no library needed)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setUser({ username: payload.sub, userId: payload.user_id });
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('access_token');
        }
      } catch {
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    if (DEV_BYPASS) return { success: true };
    try {
      const response = await ApiService.auth.login(username, password);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      setUser({ username: payload.sub, userId: payload.user_id });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    if (DEV_BYPASS) return { success: true };
    try {
      await ApiService.auth.register({ username, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    if (!DEV_BYPASS) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
