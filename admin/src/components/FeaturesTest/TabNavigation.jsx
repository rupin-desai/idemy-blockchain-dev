import React from "react";

// Renamed tabs to be student-focused
const displayNames = {
  "forms": "Student Forms",
  "tables": "Student Records",
  "identities": "ID Management",
  "blockchain": "Blockchain Ledger"
};

const TabNavigation = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            {displayNames[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;