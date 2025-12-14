import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

const Ticket = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/registrations/ticket/${ticketId}`);
      setTicket(response.data.data.ticket);
    } catch (err) {
      setError(err.response?.data?.message || 'Ticket not found');
    } finally {
      setLoading(false);
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Ticket</h1>
            <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md">
              <p className="text-sm font-medium">Ticket ID</p>
              <p className="text-2xl font-bold font-mono">{ticket?.ticketId}</p>
            </div>
          </div>

          {ticket && ticket.event && (
            <>
              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {ticket.event.title}
                </h2>
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {ticket.event.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Date & Time:</span>
                    <p className="text-gray-900">{formatDate(ticket.event.date)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Venue:</span>
                    <p className="text-gray-900">{ticket.event.venue}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attendee Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{ticket.userName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{ticket.userEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Print Ticket
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;

