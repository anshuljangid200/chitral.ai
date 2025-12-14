import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

const PublicEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/registrations/public/event/${id}`);
      setEvent(response.data.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Event not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await api.post(
        `/registrations/public/event/${id}/register`,
        formData
      );
      const { registration } = response.data.data;

      if (registration.status === 'approved') {
        setSuccess(
          `Registration successful! Your ticket ID is: ${registration.ticketId}. Redirecting to ticket page...`
        );
        setTimeout(() => {
          window.location.href = `/ticket/${registration.ticketId}`;
        }, 2000);
      } else {
        setSuccess(
          'Registration successful! Your request is pending approval. You will receive a confirmation email once approved.'
        );
        setFormData({ userName: '', userEmail: '' });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <Alert type="error" message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {event && (
          <>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                {event.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date & Time:</span>
                  <p className="text-gray-600">{formatDate(event.date)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Venue:</span>
                  <p className="text-gray-600">{event.venue}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Available Tickets:</span>
                  <p className="text-gray-600">
                    {event.availableTickets} / {event.ticketLimit}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Approval Mode:</span>
                  <p className="text-gray-600 capitalize">{event.approvalMode}</p>
                </div>
              </div>
            </div>

            {event.isSoldOut ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-medium">
                  This event is sold out. No more tickets available.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Register for this Event
                </h2>

                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      required
                      minLength={2}
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="userEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      name="userEmail"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.userEmail}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Registering...' : 'Register for Event'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicEvent;

