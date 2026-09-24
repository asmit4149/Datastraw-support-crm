import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/tickets/:ticket_id" element={<TicketDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
