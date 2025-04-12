import React from "react";
import { Check, X } from "lucide-react";

const AlertNotification = ({ show, type, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className={`p-4 rounded-md ${type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {type === "success" ? (
            <Check className="h-5 w-5 text-green-400" />
          ) : (
            <X className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"}`}>
            {message || (type === "success" ? "Operation completed successfully!" : "An error occurred!")}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button 
            onClick={onClose}
            className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;