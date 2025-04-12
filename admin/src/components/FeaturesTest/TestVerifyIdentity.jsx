import React, { useState } from "react";
import { Check, X } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { mockIdentities } from "../../constants/mockData";

const TestVerifyIdentity = () => {
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  
  return (
    <Card title="Verify Identity">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Identity
          </label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedIdentity || ""}
            onChange={(e) => setSelectedIdentity(Number(e.target.value))}
          >
            <option value="">Select identity...</option>
            {mockIdentities.map((identity) => (
              <option key={identity.id} value={identity.id}>
                {identity.name} - {identity.type}
              </option>
            ))}
          </select>
        </div>
        
        {selectedIdentity && (
          <>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <h3 className="font-medium">Identity Details</h3>
              {mockIdentities
                .filter(i => i.id === selectedIdentity)
                .map(identity => (
                  <div key={identity.id} className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{identity.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{identity.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">{identity.status}</span>
                    </div>
                  </div>
                ))
              }
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="success" 
                icon={<Check size={16} />}
              >
                Approve
              </Button>
              <Button 
                variant="danger" 
                icon={<X size={16} />}
              >
                Reject
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default TestVerifyIdentity;