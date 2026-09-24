import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: ''
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
    
    // Basic client validation
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
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Ticket</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Please provide details about the issue.</p>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-sm text-green-700">Ticket created successfully! Redirecting...</p>
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="customer_email"
                  id="customer_email"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.customer_email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
