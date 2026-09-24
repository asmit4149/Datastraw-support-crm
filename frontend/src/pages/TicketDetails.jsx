import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Send } from 'lucide-react';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';

const TicketDetails = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/tickets/${ticket_id}`);
      setTicket(res.data);
    } catch (err) {
      setError('Failed to fetch ticket details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticket_id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdating(true);
      await apiClient.put(`/tickets/${ticket_id}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setUpdating(true);
      await apiClient.put(`/tickets/${ticket_id}`, { notes: newNote });
      setNewNote('');
      fetchTicket(); // Refresh to get the new note with timestamp
    } catch (err) {
      alert('Failed to add note');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading ticket details...</div>;
  }

  if (error || !ticket) {
    return <div className="text-center py-12 text-red-600">{error || 'Ticket not found.'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-3">
              {ticket.ticket_id}
              <StatusBadge status={ticket.status} />
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Ticket details and metadata.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={ticket.status}
              onChange={handleStatusChange}
              disabled={updating}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 border"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer_name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.customer_email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created On</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(ticket.created_at), 'PPP p')}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Subject</dt>
              <dd className="mt-1 text-sm text-gray-900">{ticket.subject}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">
                {ticket.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notes & Activity</h3>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <ul className="space-y-6 mb-8">
            {ticket.notes && ticket.notes.length > 0 ? (
              ticket.notes.map((note, idx) => (
                <li key={idx} className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-800">Support Agent</span>
                    <span className="text-xs text-gray-500">{format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note_text}</p>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center italic py-4">No notes added yet.</p>
            )}
          </ul>

          <form onSubmit={handleAddNote} className="mt-6">
            <label htmlFor="note" className="sr-only">Add a note</label>
            <div className="relative rounded-md shadow-sm">
              <textarea
                id="note"
                rows={3}
                className="form-textarea block w-full rounded-md border-gray-300 border p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
                placeholder="Add a new internal note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={updating}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={updating || !newNote.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
