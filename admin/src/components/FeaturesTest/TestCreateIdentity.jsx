import React from "react";
import { Upload, PlusCircle } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { identityTypes } from "../../constants/mockData";

const TestCreateIdentity = () => {
  return (
    <Card title="Create Identity">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identity Type
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Select type...</option>
            {identityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg">
          <Upload size={20} className="text-gray-500" />
          <span className="text-sm text-gray-600">Upload ID document</span>
          <input type="file" className="hidden" />
        </div>
        
        <Button icon={<PlusCircle size={16} />}>
          Create Identity
        </Button>
      </form>
    </Card>
  );
};

export default TestCreateIdentity;