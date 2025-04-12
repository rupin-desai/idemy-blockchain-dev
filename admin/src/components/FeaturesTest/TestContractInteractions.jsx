import React from "react";
import { RefreshCw } from "lucide-react";
import Button from "../../ui/Button";

const TestContractInteractions = () => {
  return (
    <div>
      <h3 className="font-medium mb-3">Student Contract Interactions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="text-sm font-medium">Student Identity Contract</h4>
          <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
            <code className="text-xs font-mono break-all">
              0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
            </code>
          </div>
          <Button size="sm" className="mt-3" icon={<RefreshCw size={14} />}>
            Verify Student Records
          </Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="text-sm font-medium">Student Card Contract</h4>
          <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
            <code className="text-xs font-mono break-all">
              0x5b1869D9A4C187F2EAa108f3062412ecf0526b24
            </code>
          </div>
          <Button size="sm" className="mt-3" icon={<RefreshCw size={14} />}>
            Check Card Validity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestContractInteractions;
