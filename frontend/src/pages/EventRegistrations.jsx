import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import MainLayout from '../components/MainLayout';

const EventRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get(`/registrations/event/${id}`);
      setRegistrations(response.data.data.registrations);
      setStats(response.data.data.stats);

      // Fetch event details
      const eventResponse = await api.get(`/events/${id}`);
      setEvent(eventResponse.data.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId, status) => {
    try {
      await api.put(`/registrations/${registrationId}/status`, { status });
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <MainLayout
      title={event?.title || 'Event registrations'}
      subtitle="Review attendees, approve or reject manual requests, and keep track of event demand."
      actions={
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          ← Back to dashboard
        </button>
      }
    >
      {event && (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h1 className="text-lg font-semibold text-slate-50 mb-2">
            {event.title}
          </h1>
          <p className="text-xs text-slate-400 mb-3 line-clamp-3">
            {event.description}
          </p>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-50">
              {stats.total}
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
            <p className="text-xs text-amber-300">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-amber-200">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4">
            <p className="text-xs text-emerald-300">Approved</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-200">
              {stats.approved}
            </p>
          </div>
          <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-4">
            <p className="text-xs text-red-300">Rejected</p>
            <p className="mt-2 text-2xl font-semibold text-red-200">
              {stats.rejected}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
          <p className="text-sm text-slate-300 mb-1">No registrations yet.</p>
          <p className="text-xs text-slate-500">
            Share the public event link with your attendees to start collecting
            registrations.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900/80">
                  <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Registered
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-300 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {registrations.map((registration) => (
                  <tr key={registration._id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-100">
                      {registration.userName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {registration.userEmail}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                      {registration.ticketId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-[11px] font-semibold rounded-full ${
                          registration.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                            : registration.status === 'rejected'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/10 text-amber-200 border border-amber-500/40'
                        }`}
                      >
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {formatDate(registration.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                      {registration.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(registration._id, 'approved')
                            }
                            className="text-emerald-300 hover:text-emerald-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(registration._id, 'rejected')
                            }
                            className="text-red-300 hover:text-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {registration.status === 'approved' && (
                        <a
                          href={`/ticket/${registration.ticketId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200"
                        >
                          View ticket
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EventRegistrations;

