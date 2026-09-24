import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' means all

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      let url = '/tickets?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (search) url += `search=${search}`;
      
      const res = await apiClient.get(url);
      setTickets(res.data);
    } catch (err) {
      setError('Failed to fetch tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add simple debounce for search
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all support tickets in your account.</p>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search tickets by ID, name, email, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="relative flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3 text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      <div className="mt-6 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-sm text-gray-500">Loading tickets...</td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-sm text-gray-500">No tickets found.</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {ticket.ticket_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.customer_name}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{ticket.subject}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link to={`/tickets/${ticket.ticket_id}`} className="text-indigo-600 hover:text-indigo-900">
                      View<span className="sr-only">, {ticket.ticket_id}</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
