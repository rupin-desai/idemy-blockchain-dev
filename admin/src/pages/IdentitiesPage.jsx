import React, { useState, useEffect }c fromd "react";
import { Search, Filter, Plus, X } from "lucide-react";
import  Card from "../ui/Card";
import Button from "../ui/Button";
import IdentitiesList from "../components/identities/IdentitiesList";
import TestCreateIdentity from "../components/FeaturesTest/TestCreateIdentity";
import useStudentIdentity from "../hooks/useStudentIdentity";

const IdentitiesPage = () => {
  const { fetchStudentIdentities. } = useStudentIdentity();
  
  // UI states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters,. setShowFilters] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    cardType: ""
  });
  
  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchIdentities();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchTerm, filters, pagination.page]);
  
  // Initial fetch
  useEffect(() => {
    fetchIdentities();
  }, []);
  
  const fetchIdentities = async () => {
    try {
      // Prepare query parameters
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      // Add search term if provided
      if (searchTerm) {
        queryParams.search = searchTerm;
      }
      
      // Fetch identities from API
      const result = await fetchStudentIdentities(queryParams);
      
      // Update pagination data if available
      if (result && result.pagination) {
        setPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.pages
        });
      }
    } catch (error) {
      console.error("Failed to fetch identities:", error);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      status: "",
      department: "",
      cardType: ""
    });
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Identities</h1>
          <p className="text-gray-600 mt-1">Manage student digital identities in the system</p>
        </div>
        <Button 
          icon={<Plus size={16} />}
          onClick={() => setShowCreateForm(prev => !prev)}
        >
          {showCreateForm ? "Hide Form" : "Create Student ID"}
        </Button>
      </div>

      {showCreateForm && (
        <TestCreateIdentity onSuccess={() => fetchIdentities()} />
      )}

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search by name, email or DID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="secondary" 
            icon={showFilters ? <X size={16} /> : <Filter size={16} />}
            className="whitespace-nowrap"
            onClick={() => setShowFilters(prev => !prev)}
          >
            {showFilters ? "Hide Filters" : "Filter"}
          </Button>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-md mb-6 border">
            <h3 className="text-sm font-medium mb-3">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Department</label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Departments</option>
                  <option value="cs">Computer Science</option>
                  <option value="eng">Engineering</option>
                  <option value="bus">Business</option>
                  <option value="arts">Arts & Humanities</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Card Type</label>
                <select
                  name="cardType"
                  value={filters.cardType}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Card Types</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="faculty">Faculty</option>
                  <option value="visitor">Visitor</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        <IdentitiesList 
          refreshIdentities={fetchIdentities} 
          // Pass filters to allow component to use them if needed
          filters={{ searchTerm, ...filters }}
        />
        
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{pagination.total ? ((pagination.page - 1) * pagination.limit) + 1 : 0}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="font-medium">{pagination.total}</span> student records
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 border rounded text-sm ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            
            {/* Generate page buttons */}
            {[...Array(pagination.totalPages).keys()].map(i => {
              const pageNum = i + 1;
              // Only show a window of pages around current page
              if (pageNum === 1 || 
                  pageNum === pagination.totalPages || 
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)) {
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 border rounded text-sm ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                // Show ellipsis
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button 
              className={`px-3 py-1 border rounded text-sm ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IdentitiesPage;