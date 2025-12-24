// App routes: login, protected layout, feature pages, and 404 fallback.
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedLayout from './layouts/ProtectedLayout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import PlayerStatus from './pages/PlayerStatus';
import NotFound from './pages/NotFound';

function Protected({ children }) {
  const { isAuthenticated, restoring } = useAuth();
  const location = useLocation();
  if (restoring) return null;                     // ← blank while checking
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AutoRedirectLogin() {
  const { isAuthenticated, restoring } = useAuth();
  const location = useLocation();
  if (restoring) return null;
  if (isAuthenticated) return <Navigate to="/library" replace />;
  return <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AutoRedirectLogin />} />
      <Route
        path="/"
        element={
          <Protected>
            <ProtectedLayout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/upload" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="library" element={<Library />} />
        <Route path="playlist" element={<Playlist />} />
        <Route path="status" element={<PlayerStatus />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
