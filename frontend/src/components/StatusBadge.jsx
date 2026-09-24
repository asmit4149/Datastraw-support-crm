import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClass = '';
  
  switch (status) {
    case 'Open':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'In Progress':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Closed':
      colorClass = 'bg-green-100 text-green-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
