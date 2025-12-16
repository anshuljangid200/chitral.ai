import { useNavigate } from 'react-router-dom';
import { clearAuth, getAuth } from '../utils/auth';

const MainLayout = ({ title, subtitle, actions, children }) => {
  const navigate = useNavigate();
  const { user } = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-xs font-bold">
              ET
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm sm:text-base">
                Event Ticketing
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Organizer Console
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-400">Signed in as</span>
                <span className="font-medium text-slate-100 truncate max-w-[150px]">
                  {user.name}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="border-b border-slate-900 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-400 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;


