import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Send, Clock, User, Mail } from 'lucide-react';
import apiClient from '../api/apiClient';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

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
      setError('Failed to load ticket details. The ticket may have been deleted or the server is unreachable.');
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
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    try {
      setUpdating(true);
      await apiClient.put(`/tickets/${ticket_id}`, { priority: newPriority });
      setTicket({ ...ticket, priority: newPriority });
    } catch (err) {
      alert('Failed to update priority. Please try again.');
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
      fetchTicket(); 
    } catch (err) {
      alert('Failed to add note. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-medium">{error || 'Ticket not found.'}</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Ticket Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-panel">
            <div className="px-5 py-5 sm:px-7 flex justify-between items-start border-b border-slate-200/60 bg-white">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{ticket.subject}</h2>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-sm text-slate-500 font-medium">{ticket.ticket_id}</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              <StatusBadge status={ticket.status} className="ml-4 flex-shrink-0" />
            </div>
            
            <div className="px-4 py-6 sm:px-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="card-panel">
            <div className="px-5 py-4 sm:px-7 border-b border-slate-200/60 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Internal Notes</h3>
            </div>
            
            <div className="px-5 py-6 sm:px-7 bg-slate-50/50">
              <div className="space-y-6 mb-8">
                {ticket.notes && ticket.notes.length > 0 ? (
                  ticket.notes.map((note, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            A
                          </div>
                          Support Agent
                        </div>
                        <span className="text-xs font-medium text-slate-500 flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(note.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pl-8">{note.note_text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-slate-200 border-dashed">
                    <p className="text-sm text-slate-500 font-medium">No notes added yet.</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="bg-white rounded-lg border border-slate-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-shadow">
                <textarea
                  rows={3}
                  className="block w-full resize-none border-0 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Type an internal note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  disabled={updating}
                />
                <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">Notes are only visible to the team</span>
                  <button
                    type="submit"
                    disabled={updating || !newNote.trim()}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-panel">
            <div className="px-5 py-4 sm:px-6 border-b border-slate-200/60 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Properties</h3>
            </div>
            <div className="px-5 py-5 sm:px-6 space-y-6 bg-slate-50/30">
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="input-field py-1.5 font-medium"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={handlePriorityChange}
                  disabled={updating}
                  className="input-field py-1.5 font-medium"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer</h4>
                <div className="flex items-start gap-3 mb-3">
                  <User className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{ticket.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <a href={`mailto:${ticket.customer_email}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {ticket.customer_email}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Dates</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Created</span>
                    <span className="font-medium text-slate-900">{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900">{format(new Date(ticket.created_at), 'h:mm a')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketDetails;
