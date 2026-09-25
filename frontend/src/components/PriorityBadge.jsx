import React from 'react';

const PriorityBadge = ({ priority, className = '' }) => {
  let colorClass = '';
  
  switch (priority) {
    case 'High':
      colorClass = 'bg-red-50 text-red-700 ring-red-600/20';
      break;
    case 'Medium':
      colorClass = 'bg-blue-50 text-blue-700 ring-blue-600/20';
      break;
    case 'Low':
      colorClass = 'bg-slate-100 text-slate-700 ring-slate-500/10';
      break;
    default:
      colorClass = 'bg-slate-50 text-slate-600 ring-slate-500/10';
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClass} ${className}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
