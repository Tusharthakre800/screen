// Client-side API helper hooks for auth, content, playlist, and player statuses.
export function useApi() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const authHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handle = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.message || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.response = { data };
      throw err;
    }
    return { data };
  };

  const login = (email, password) =>
    fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(handle);

  const listContent = () =>
    fetch(`${baseUrl}/api/content`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    }).then(handle);

  const uploadContent = (file, expiryAt = null) => {
    const form = new FormData();
    form.append('file', file);
    if (expiryAt) form.append('expiryAt', expiryAt);
    return fetch(`${baseUrl}/api/content/upload`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: form,
    }).then(handle);
  };

  const savePlaylist = (playlist) =>
    fetch(`${baseUrl}/api/player/playlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ playlist }),
    }).then(handle);

  const getPlaylist = () =>
    fetch(`${baseUrl}/api/player`, {
      headers: { 'Content-Type': 'application/json' },
    }).then(handle);

  const listPlayers = () =>
    fetch(`${baseUrl}/api/player/statuses`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    }).then(handle);

  return { login, listContent, uploadContent, savePlaylist, getPlaylist, listPlayers };
}
