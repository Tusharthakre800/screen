import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-100vh grid place-items-center bg-slate-50 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow border border-slate-200 p-6 text-center">
        <p className="text-6xl font-bold text-slate-800">404</p>
        <p className="mt-2 text-slate-600">Page not found</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Upload
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
