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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-10 px-4 text-slate-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl relative z-10">

        {/* Ambient background effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-6 flex items-center justify-between print:hidden relative z-10 w-full">
          <div className="inline-flex items-center space-x-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-[11px] font-bold">
              ET
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100">
                Event Ticketing
              </p>
              <p className="text-[11px] text-slate-400">
                Verified attendee ticket
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all print:hidden"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print Ticket
          </button>
        </div>

        <div className="bg-slate-900/80 backend-blur-xl rounded-3xl border border-slate-800/60 p-0 shadow-2xl overflow-hidden print:shadow-none print:border print:bg-white print:text-black">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden print:bg-none print:text-black print:p-0 print:border-b">
            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold mb-2 print:text-black">Event Ticket</h1>
              <p className="text-blue-100 text-sm print:hidden">Please simulate printing or present this on entry</p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10 pointer-events-none"></div>
          </div>

          <div className="p-8">
            <div className="flex justify-center -mt-16 mb-8 relative z-10 print:mt-0 print:mb-4">
              <div className="bg-slate-900 p-1.5 rounded-2xl shadow-xl print:shadow-none print:bg-transparent">
                <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900 px-8 py-4 text-center print:border-black print:bg-white">
                  <p className="text-xs font-medium text-slate-400 mb-1 print:text-black">Ticket ID</p>
                  <p className="text-2xl font-mono font-bold tracking-widest text-blue-400 print:text-black">{ticket?.ticketId}</p>
                </div>
              </div>
            </div>

            {ticket && ticket.event && (
              <>
                <div className="text-center mb-8 border-b border-slate-800 pb-8 print:border-gray-300">
                  <h2 className="text-2xl font-bold text-white mb-2 print:text-black">
                    {ticket.event.title}
                  </h2>
                  <p className="text-slate-400 print:text-black">
                    {ticket.event.venue}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 print:text-black">Date</p>
                    <p className="text-lg font-medium text-slate-200 print:text-black">{new Date(ticket.event.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 print:text-black">Time</p>
                    <p className="text-lg font-medium text-slate-200 print:text-black">{new Date(ticket.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800/50 print:bg-gray-50 print:border-gray-200">
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4 print:text-black">
                    Attendee Details
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 print:text-black">Name</span>
                    <span className="text-slate-200 font-medium print:text-black">{ticket.userName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 print:text-black">Email</span>
                    <span className="text-slate-200 print:text-black">{ticket.userEmail}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800 print:border-gray-300 flex items-center justify-between">
                    <span className="text-slate-400 print:text-black">Status</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 print:bg-transparent print:ring-0 print:text-black print:px-0">
                      Confirmed
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 text-center print:hidden">
              <p className="text-xs text-slate-500">
                You will receive a copy of this ticket via email.
              </p>
            </div>
          </div>

          {/* Perforated edge effect for footer (visual only) */}
          <div className="h-4 bg-slate-950 relative print:hidden">
            <div className="absolute -top-2 w-full h-4 bg-slate-950" style={{ maskImage: 'radial-gradient(circle, transparent 6px, black 6.5px)', maskSize: '20px 20px', maskRepeat: 'repeat-x', WebkitMaskImage: 'radial-gradient(circle, transparent 6px, black 6.5px)', WebkitMaskSize: '20px 20px', WebkitMaskRepeat: 'repeat-x' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;

