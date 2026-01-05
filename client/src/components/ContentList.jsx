// Lists uploaded content, grouped by expiry status. Includes thumbnails and countdown.
import { useEffect, useState } from 'react';
import { useApi } from '../api';

function Countdown({ expiryAt }) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    if (!expiryAt) return;
    const tick = () => {
      const ms = new Date(expiryAt).getTime() - Date.now();
      if (ms <= 0) { setLeft('Expired'); return; }
      const d = Math.floor(ms / (1000 * 60 * 60 * 24));
      const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
      const m = Math.floor((ms / (1000 * 60)) % 60);
      const parts = [];
      if (d) parts.push(`${d}d`);
      if (h) parts.push(`${h}h`);
      if (m) parts.push(`${m}m`);
      setLeft(parts.join(' ') || '1m');
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [expiryAt]);
  return <span className="text-xs text-slate-500">{left}</span>;
}

export default function ContentList() {
  const { listContent } = useApi();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listContent();
        setItems(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDateTime = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  };

  const computeStatus = (expiryAt, isExpired) => {
    if (isExpired) return { label: 'Expired', tone: 'bg-red-100 text-red-700' };
    if (!expiryAt) return { label: 'No expiry', tone: 'bg-slate-100 text-slate-700' };
    const exp = new Date(expiryAt).getTime();
    const diff = exp - Date.now();
    if (diff <= 0) return { label: 'Expired', tone: 'bg-red-100 text-red-700' };
    if (diff <= 24 * 60 * 60 * 1000) return { label: 'Expires soon', tone: 'bg-amber-100 text-amber-700' };
    return { label: 'Active', tone: 'bg-green-100 text-green-700' };
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0,1].map((col) => (
            <div key={col} className="bg-white rounded-2xl shadow border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-200">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-200 animate-pulse"></div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-5 w-24 bg-slate-200 rounded-full animate-pulse"></div>
                          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  const now = Date.now();
  const expiredItems = items.filter((item) => (item.isExpired) || (item.expiryAt && new Date(item.expiryAt).getTime() <= now));
  const activeItems = items.filter((item) => !(item.isExpired) && (!item.expiryAt || new Date(item.expiryAt).getTime() > now));


const Card = ({ title, data }) => (
  <div className="bg-white rounded-2xl shadow border border-slate-200 flex flex-col">
    
    {/* Card Header */}
    <div className="px-5 py-4 border-b border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>
    </div>

    {/* Scrollable Content */}
    <div className="px-5 py-4 space-y-3 overflow-auto max-h-[60vh]">
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No items available.</p>
      ) : (
        data.map((item) => {
          const status = computeStatus(item.expiryAt, item.isExpired);
          const isImage = item.mimeType?.startsWith("image/");

          return (
            <div
              key={item._id}
              className="rounded-xl border border-slate-200 p-3 hover:shadow-md transition bg-slate-50"
            >
              <div className="flex gap-3">
                
                {/* Thumbnail */}
                {isImage && (
                  <img
                    src={`http://localhost:5000${item.publicUrl}`}
                    alt="thumb"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.originalFilename}
                  </p>

                  <p className="text-xs text-slate-600">{item.mimeType}</p>
                  <p className="text-xs text-slate-600">
                    {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <p className="text-xs text-slate-500">
                    {formatDateTime(item.expiryAt)}
                  </p>

                  {/* Status Row */}
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${status.tone}`}
                    >
                      {status.label}
                    </span>

                    {title === "Active & Upcoming" && item.expiryAt && (
                      <Countdown expiryAt={item.expiryAt} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);
return (
  <section className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Active & Upcoming" data={activeItems} />
      <Card title="Expired" data={expiredItems} />
    </div>
  </section>
);

}
