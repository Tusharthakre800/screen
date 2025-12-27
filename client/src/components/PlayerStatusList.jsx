// Polls player heartbeat statuses and derives online/offline based on lastSeen threshold.
import { useEffect, useState } from "react";
import { useApi } from "../api";
import { nowMs } from "../utils/time";

const THRESHOLD_MS = 30000; // 30 seconds

export default function PlayerStatusList() {
  const { listPlayers } = useApi();
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await listPlayers();
        if (!mounted) return;

        const now = nowMs();
        const data = (res.data || []).map((p) => ({
          ...p,
          ua: p.info?.ua,
          derivedOnline: now - (p.lastSeen || 0) < THRESHOLD_MS,
        }));

        setPlayers(data);
        setError(null);
      } catch (e) {
        setError(
          e?.response?.data?.message || "Failed to load player statuses"
        );
      }
    };

    load();
    const id = setInterval(load, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="min-h-[calc(100vh-32rem)] bg-slate-50 px-4">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Player Status
        </h1>
        <p className="text-sm text-slate-500">
          Live connectivity status of all registered players
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
<div className="bg-white rounded-2xl border border-slate-200 shadow flex flex-col h-[440px]">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Connected Players
            </h3>
            <span className="text-sm text-slate-500">
              {players.length} total
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {!error && players.length === 0 && (
              <p className="text-sm text-slate-500">
                No players registered yet.
              </p>
            )}

            {players.map((p) => (
              <div
                key={p.playerId}
                className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-slate-50 hover:shadow transition"
              >
                {/* Left */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {p.playerId}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    UA: {p.ua || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Last seen:{" "}
                    {p.lastSeen
                      ? new Date(p.lastSeen).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.derivedOnline
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.derivedOnline ? "Online" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
