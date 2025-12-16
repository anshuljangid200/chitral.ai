import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { setAuth } from '../utils/auth';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await api.post('/auth/signup', signupData);
      const { token, user } = response.data.data;

      setAuth(token, user);
      navigate('/dashboard');
    } catch (err) {
      let errorMessage = 'Signup failed. Please try again.';
      
      // Log full error for debugging
      console.error('[Signup Error]', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.join(', ');
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
        {/* Brand side */}
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
                Trusted by modern organizers
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-slate-50 mb-4">
            Create your organizer workspace in minutes.
          </h1>
          <p className="text-sm text-slate-400 mb-6 max-w-md">
            Powerful enough for production workloads, simple enough to use for
            your next launch, meetup, or conference.
          </p>
          <p className="text-xs text-slate-500 max-w-md">
            Your account is organizer-only. There is no public login — attendees
            register via public event links and receive secure tickets.
          </p>
        </div>

        {/* Signup card */}
        <div className="max-w-md w-full mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
            <h2 className="text-xl font-semibold text-slate-50 text-center mb-1">
              Create organizer account
            </h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              Set up your organizer profile to start creating and managing
              events.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <Alert type="error" message={error} />}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Chitral Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Work email
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
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Sign in instead
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

