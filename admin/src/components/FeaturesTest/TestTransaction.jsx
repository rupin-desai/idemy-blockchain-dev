import React from "react";
import Button from "../../ui/Button";

const TestTransaction = () => {
  return (
    <div>
      <h3 className="font-medium mb-3">Test Transaction</h3>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Recipient address (0x...)"
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <Button size="sm">
          Create Identity
        </Button>
        <Button size="sm">
          Issue ID Card
        </Button>
        <Button size="sm">
          Register Document
        </Button>
      </div>
    </div>
  );
};

export default TestTransaction;