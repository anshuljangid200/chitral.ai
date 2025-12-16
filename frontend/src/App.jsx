import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventRegistrations from './pages/EventRegistrations';
import PublicEvent from './pages/PublicEvent';
import Ticket from './pages/Ticket';
import api from './utils/api';

function App() {
  // Warm up backend serverless function on app load
  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        await api.get('/health');
        console.log('✓ Backend warmed up successfully');
      } catch (error) {
        console.warn('Backend warm-up failed:', error.message);
        // Don't block app loading on warm-up failure
      }
    };

    warmUpBackend();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/registrations"
          element={
            <ProtectedRoute>
              <EventRegistrations />
            </ProtectedRoute>
          }
        />
        <Route path="/event/:id" element={<PublicEvent />} />
        <Route path="/ticket/:ticketId" element={<Ticket />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

