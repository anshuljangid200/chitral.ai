import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { setAuth } from '../utils/auth';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data.data;

      setAuth(token, user);
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Log full error for debugging
      console.error('[Login Error]', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === 'Network Error' || !err.response) {
        errorMessage = 'Cannot connect to server. Check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Brand / Marketing side */}
        <div className="hidden md:block">
          <div className="mb-6 inline-flex items-center space-x-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-xs font-bold">
              ET
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">
                Event Ticketing
              </p>
              <p className="text-xs text-slate-400">
                Built for serious organizers
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-slate-50 mb-4">
            Manage events like a modern SaaS product.
          </h1>
          <p className="text-sm text-slate-400 mb-6 max-w-md">
            Create events, control registrations with manual or automatic
            approvals, and issue secure tickets – all from a clean organizer
            console.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Real-time registration management with approval flows.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>Secure, human-readable ticket IDs for every attendee.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Designed with production-grade backend and security.</span>
            </li>
          </ul>
        </div>

        {/* Auth card */}
        <div className="max-w-md w-full mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
            <h2 className="text-xl font-semibold text-slate-50 text-center mb-1">
              Sign in to organizer console
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              Use your organizer credentials to access events and registrations.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <Alert type="error" message={error} />}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                New here?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Create an organizer account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

