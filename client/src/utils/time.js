let delta = 0;

export function nowMs() {
  return Date.now() + delta;
}

export async function syncTime(apiBase) {
  try {
    const res = await fetch(`${apiBase}/api/time`, { headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (typeof data.now === 'number') {
      delta = data.now - Date.now();
    }
  } catch {
    // ignore network errors; delta remains 0
  }
}
