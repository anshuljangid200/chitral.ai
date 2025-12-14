import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Event
          </h2>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                minLength={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Event Date *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  required
                  min={minDateString}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  required
                  minLength={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter venue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="ticketLimit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ticket Limit *
                </label>
                <input
                  type="number"
                  id="ticketLimit"
                  name="ticketLimit"
                  required
                  min={1}
                  max={100000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.ticketLimit}
                  onChange={handleChange}
                  placeholder="Number of tickets"
                />
              </div>

              <div>
                <label
                  htmlFor="approvalMode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Approval Mode *
                </label>
                <select
                  id="approvalMode"
                  name="approvalMode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.approvalMode}
                  onChange={handleChange}
                >
                  <option value="manual">Manual Approval</option>
                  <option value="auto">Auto Approval</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

