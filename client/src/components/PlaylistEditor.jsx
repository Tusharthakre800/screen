// Editor for building the active playlist from the media library; supports durations for images.
import { useEffect, useState } from "react";
import { useApi } from "../api";

export default function PlaylistEditor() {
  const { listContent, savePlaylist, getPlaylist } = useApi();
  const [library, setLibrary] = useState([]);
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [libRes, plRes] = await Promise.all([
          listContent(),
          getPlaylist().catch(() => ({ data: null })),
        ]);
        setLibrary(libRes.data || []);
        setEntries(plRes?.data?.playlist || []);
      } catch {
        /* silent */
      }
    };
    load();
  }, []);

  const addEntry = (contentId) => {
    const item = library.find((x) => x._id === contentId);
    if (!item) return;

    setEntries((prev) => [
      ...prev,
      {
        contentId,
        type: item.mimeType.startsWith("video") ? "video" : "image",
        durationSec: item.mimeType.startsWith("video") ? null : 10,
      },
    ]);
  };

  const updateDuration = (idx, val) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, durationSec: val } : e))
    );
  };

  const removeEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSave = async () => {
    try {
      await savePlaylist(entries);
      setStatus({ ok: true, message: "Playlist saved successfully" });
    } catch (err) {
      setStatus({
        ok: false,
        message: err?.response?.data?.message || "Save failed",
      });
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Playlist Editor
        </h1>
        <p className="text-sm text-slate-500">
          Build and manage the playback sequence for screens
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Library */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow flex flex-col h-[540px]">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              Media Library
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {library.length === 0 && (
              <p className="text-sm text-slate-500">No media available</p>
            )}

            {library.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50 hover:shadow transition"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.originalFilename}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.mimeType}
                  </p>
                </div>

                <button
                  onClick={() => addEntry(item._id)}
                  className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow flex flex-col h-[540px]">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              Playlist Timeline
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {entries.length === 0 && (
              <p className="text-sm text-slate-500">
                Playlist is empty
              </p>
            )}

            {entries.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50 hover:shadow transition"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-200 text-slate-700 font-medium">
                    {e.type}
                  </span>

                  {e.durationSec !== null && (
                    <input
                      type="number"
                      min={1}
                      value={e.durationSec}
                      onChange={(ev) =>
                        updateDuration(idx, Number(ev.target.value))
                      }
                      className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    />
                  )}
                </div>

                <button
                  onClick={() => removeEntry(idx)}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-4 border-t border-slate-200 flex items-center gap-4">
            <button
              onClick={onSave}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Save Playlist
            </button>

            {status && (
              <span
                className={`text-sm ${
                  status.ok ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
