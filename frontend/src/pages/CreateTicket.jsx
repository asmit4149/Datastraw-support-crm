import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/apiClient';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email || !formData.subject || !formData.description) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await apiClient.post('/tickets', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back to Dashboard
      </button>

      <div className="card-panel">
        <div className="px-4 py-6 sm:px-8 border-b border-slate-200/60 bg-white">
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Create New Ticket</h3>
          <p className="mt-1 text-sm text-slate-500">Fill in the customer's details and issue description to open a new support ticket.</p>
        </div>
        
        <div className="px-4 py-6 sm:px-8 bg-slate-50/30">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
              <p className="text-sm font-medium text-emerald-800">Ticket created successfully! Redirecting...</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium leading-6 text-slate-900">Customer Name</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="customer_name"
                    id="customer_name"
                    className="input-field"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium leading-6 text-slate-900">Email Address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="customer_email"
                    id="customer_email"
                    className="input-field"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium leading-6 text-slate-900">Subject</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="input-field"
                    placeholder="Brief summary of the issue"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium leading-6 text-slate-900">Priority</label>
                <div className="mt-2">
                  <select
                    name="priority"
                    id="priority"
                    className="input-field appearance-none bg-white"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900">Description</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Provide detailed information about the customer's problem..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
