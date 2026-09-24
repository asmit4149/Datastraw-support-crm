import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Plus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Ticket className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Desk<span className="text-blue-600">Pro</span></span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/create" 
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New Ticket
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
