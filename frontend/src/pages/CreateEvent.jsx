import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import MainLayout from '../components/MainLayout';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    ticketLimit: '',
    approvalMode: 'manual',
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
      const payload = {
        ...formData,
        ticketLimit: parseInt(formData.ticketLimit),
        date: new Date(formData.date).toISOString(),
      };

      await api.post('/events', payload);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Failed to create event. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <MainLayout
      title="Create New Event"
      subtitle="Launch your next successful event. Configure details, capacity, and approval rules."
    >
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {error && <div className="mb-6"><Alert type="error" message={error} /></div>}

          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/50"
          >
            {/* Title Section */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Event Title <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition-all duration-200"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Tech Conference 2024"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Description <span className="text-blue-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition-all duration-200 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event, agenda, and what attendees can expect..."
                />
              </div>
            </div>

            <div className="h-px bg-slate-800/50 my-8" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Event Date & Time <span className="text-blue-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  required
                  min={minDateString}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition-all duration-200 [color-scheme:dark]"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Venue Location <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition-all duration-200"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Grand Convention Center, NY"
                />
              </div>

              <div>
                <label
                  htmlFor="ticketLimit"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Total Capacity <span className="text-blue-500">*</span>
                </label>
                <input
                  type="number"
                  id="ticketLimit"
                  name="ticketLimit"
                  required
                  min={1}
                  max={100000}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 placeholder:text-slate-600 transition-all duration-200"
                  value={formData.ticketLimit}
                  onChange={handleChange}
                  placeholder="Max attendees"
                />
              </div>

              <div>
                <label
                  htmlFor="approvalMode"
                  className="block text-sm font-medium text-blue-100 mb-2"
                >
                  Registration Approval <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="approvalMode"
                    name="approvalMode"
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-100 appearance-none transition-all duration-200"
                    value={formData.approvalMode}
                    onChange={handleChange}
                  >
                    <option value="manual">Manual Approval (Review each)</option>
                    <option value="auto">Automatic Approval (Instant)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Publish Event'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateEvent;

