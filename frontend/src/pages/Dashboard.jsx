import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, Inbox, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      let url = '/tickets?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (search) url += `search=${search}`;
      
      const [ticketsRes, statsRes] = await Promise.all([
        apiClient.get(url),
        apiClient.get('/tickets/stats')
      ]);
      
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Unable to load tickets. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and respond to customer inquiries.</p>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card-panel px-4 py-5 flex flex-col justify-center">
          <dt className="text-sm font-medium text-slate-500 truncate">Total Tickets</dt>
          <dd className="mt-1 text-3xl font-semibold text-slate-900">{stats.total}</dd>
        </div>
        <div className="card-panel px-4 py-5 flex flex-col justify-center">
          <dt className="text-sm font-medium text-slate-500 truncate">Open</dt>
          <dd className="mt-1 text-3xl font-semibold text-emerald-600">{stats.open}</dd>
        </div>
        <div className="card-panel px-4 py-5 flex flex-col justify-center">
          <dt className="text-sm font-medium text-slate-500 truncate">In Progress</dt>
          <dd className="mt-1 text-3xl font-semibold text-amber-500">{stats.inProgress}</dd>
        </div>
        <div className="card-panel px-4 py-5 flex flex-col justify-center">
          <dt className="text-sm font-medium text-slate-500 truncate">Closed</dt>
          <dd className="mt-1 text-3xl font-semibold text-slate-600">{stats.closed}</dd>
        </div>
        <div className="card-panel px-4 py-5 flex flex-col justify-center">
          <dt className="text-sm font-medium text-slate-500 truncate">High Priority</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.highPriority}</dd>
        </div>
      </div>
      
      <div className="card-panel">
        {/* Toolbar */}
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200/60 bg-white flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search by ID, customer, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              className="input-field pl-9 pr-10 appearance-none bg-white font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mx-4 my-4 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="ml-3 text-sm text-red-700 font-medium">{error}</div>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-slate-500">Loading tickets...</p>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <Inbox className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">No tickets found</h3>
                    <p className="mt-1 text-sm text-slate-500">Adjust your search or filter to find what you're looking for.</p>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}>
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                      {ticket.ticket_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 font-medium">{ticket.customer_name}</td>
                    <td className="px-3 py-4 text-sm text-slate-500 max-w-xs truncate">{ticket.subject}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                      <Link to={`/tickets/${ticket.ticket_id}`} className="text-slate-400 group-hover:text-blue-600 flex items-center justify-end transition-colors">
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="sm:hidden">
          <ul className="divide-y divide-slate-200">
            {loading ? (
              <li className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </li>
            ) : tickets.length === 0 ? (
              <li className="py-16 text-center px-4">
                <Inbox className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900">No tickets found</h3>
              </li>
            ) : (
              tickets.map((ticket) => (
                <li key={ticket.ticket_id}>
                  <Link to={`/tickets/${ticket.ticket_id}`} className="block hover:bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-blue-600 truncate">{ticket.ticket_id}</p>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{ticket.subject}</p>
                      <p className="text-sm text-slate-500 mt-1">{ticket.customer_name}</p>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
