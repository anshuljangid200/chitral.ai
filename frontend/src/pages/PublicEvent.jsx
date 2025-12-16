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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-10 px-4 text-slate-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl relative z-10">

        {/* Ambient background effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* App badge */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 mb-3 transform rotate-3">
            ET
          </div>
          <div>
            <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
              Event Ticketing
            </p>
          </div>
        </div>

        {event && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Event Details Card */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" /></svg>
                </div>

                <div className="relative z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-4">
                    {event.availableTickets > 0 ? "Registration Open" : "Sold Out"}
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    {event.title}
                  </h1>

                  <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                    {event.description}
                  </p>

                  <div className="space-y-4 border-t border-slate-800/60 pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-800/50 text-blue-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Date & Time</p>
                        <p className="text-slate-100 font-semibold text-lg">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-800/50 text-indigo-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Venue Location</p>
                        <p className="text-slate-100 font-semibold text-lg">{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-slate-800/50 text-purple-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Availability</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, ((event.ticketLimit - event.availableTickets) / event.ticketLimit) * 100)}%` }}
                            />
                          </div>
                          <p className="text-slate-100 font-semibold">{event.availableTickets} tickets left</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                {event.isSoldOut ? (
                  <div className="rounded-3xl border border-red-500/30 bg-red-900/10 backdrop-blur-xl p-8 text-center shadow-xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-200 mb-2">Sold Out</h3>
                    <p className="text-red-300/80">
                      All tickets for this event have been claimed.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
                      Secure your spot
                    </h2>
                    <p className="text-slate-400 mb-8 text-sm relative z-10">
                      Fill out the form below to register immediately.
                      {event.approvalMode === 'auto' ? ' Instant confirmation.' : ' Subject to approval.'}
                    </p>

                    {error && <div className="mb-6"><Alert type="error" message={error} /></div>}
                    {success && <div className="mb-6"><Alert type="success" message={success} /></div>}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                      <div>
                        <label
                          htmlFor="userName"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                        >
                          Full name
                        </label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          required
                          minLength={2}
                          maxLength={100}
                          className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                          value={formData.userName}
                          onChange={handleChange}
                          placeholder="Checking Name..."
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="userEmail"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          id="userEmail"
                          name="userEmail"
                          required
                          className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                          value={formData.userEmail}
                          onChange={handleChange}
                          placeholder="you@company.com"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-2"
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </span>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                      <p className="text-center text-xs text-slate-500 mt-4">
                        By registering, you agree to our Terms & Conditions.
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEvent;

