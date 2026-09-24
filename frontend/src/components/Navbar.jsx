import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">Datastraw Support</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link to="/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
              New Ticket
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
