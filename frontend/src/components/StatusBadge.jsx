import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  let colorClass = '';
  
  switch (status) {
    case 'Open':
      colorClass = 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      break;
    case 'In Progress':
      colorClass = 'bg-amber-50 text-amber-700 ring-amber-600/20';
      break;
    case 'Closed':
      colorClass = 'bg-slate-100 text-slate-700 ring-slate-500/10';
      break;
    default:
      colorClass = 'bg-slate-50 text-slate-600 ring-slate-500/10';
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClass} ${className}`}>
      {status === 'Open' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
      {status === 'In Progress' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500"></span>}
      {status === 'Closed' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-400"></span>}
      {status}
    </span>
  );
};

export default StatusBadge;
