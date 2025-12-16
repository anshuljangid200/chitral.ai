import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getAuth } from '../utils/auth';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import MainLayout from '../components/MainLayout';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = getAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
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

  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (e) => new Date(e.date) > new Date()
  ).length;
  const totalCapacity = events.reduce(
    (sum, e) => sum + (e.ticketLimit || 0),
    0
  );

  return (
    <MainLayout
      title="My Events"
      subtitle="Create, manage and track registrations for all your experiences in one place."
      actions={
        <Link
          to="/events/create"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          + New Event
        </Link>
      }
    >
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
          <p className="text-xs font-medium text-slate-400">Total Events</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {totalEvents}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            All events created under your organizer account.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
          <p className="text-xs font-medium text-slate-400">Upcoming</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {upcomingEvents}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Events scheduled for a future date.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
          <p className="text-xs font-medium text-slate-400">
            Total Ticket Capacity
          </p>
          <p className="mt-2 text-2xl font-semibold text-blue-400">
            {totalCapacity.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Sum of ticket limits across all events.
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            You haven&apos;t created any events yet
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Launch your first event in minutes. Set up capacity, approval
            rules, and start accepting registrations.
          </p>
          <Link
            to="/events/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-blue-500/60 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-slate-50 line-clamp-2">
                  {event.title}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    event.approvalMode === 'auto'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {event.approvalMode === 'auto' ? 'Auto-approve' : 'Manual'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <p>
                  <span className="text-slate-500">Date:</span>{' '}
                  {formatDate(event.date)}
                </p>
                <p>
                  <span className="text-slate-500">Venue:</span> {event.venue}
                </p>
                <p>
                  <span className="text-slate-500">Capacity:</span>{' '}
                  {event.ticketLimit} tickets
                </p>
              </div>

              <div className="flex gap-2 mt-auto">
                <Link
                  to={`/events/${event._id}/registrations`}
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                >
                  View registrations
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="inline-flex items-center justify-center rounded-md border border-red-500/60 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-600/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;

