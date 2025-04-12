import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import IdentitiesList from "../components/identities/IdentitiesList";
import TestCreateIdentity from "../components/FeaturesTest/TestCreateIdentity";

const Identities = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <TestCreateIdentity />
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
            icon={<Filter size={16} />}
            className="whitespace-nowrap"
          >
            Filter
          </Button>
        </div>

        <IdentitiesList />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing student records
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded text-sm bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-sm">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Identities;