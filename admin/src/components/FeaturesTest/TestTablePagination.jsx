import React from "react";

const TestTablePagination = ({ currentPage = 1, totalPages = 1, totalItems = 0, itemsPerPage = 10 }) => {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex space-x-2">
        <button 
          className={`px-3 py-1 border rounded text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button className="px-3 py-1 border rounded text-sm bg-blue-600 text-white">
          {currentPage}
        </button>
        <button 
          className={`px-3 py-1 border rounded text-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestTablePagination;