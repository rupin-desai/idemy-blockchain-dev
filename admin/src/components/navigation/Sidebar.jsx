import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Database, 
  Settings, 
  Activity, 
  Fingerprint,
  Beaker
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Identities", path: "/identities", icon: <Fingerprint size={20} /> },
  { name: "Documents", path: "/documents", icon: <FileText size={20} /> },
  { name: "ID Cards (NFTs)", path: "/nfts", icon: <CreditCard size={20} /> },
  { name: "Blockchain", path: "/blockchain", icon: <Database size={20} /> },
  { name: "Users", path: "/users", icon: <Users size={20} /> },
  { name: "Activity", path: "/activity", icon: <Activity size={20} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  { name: "Test Features", path: "/test", icon: <Beaker size={20} /> },
];

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`${isOpen ? "w-64" : "w-0 md:w-20"} bg-white border-r shadow-sm transition-all duration-300 overflow-hidden`}>
      <div className="p-4 border-b flex items-center justify-center h-16">
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-600">SSI Admin</h1>
        ) : (
          <h1 className="text-xl font-bold text-blue-600">SSI</h1>
        )}
      </div>
      
      <nav className="mt-2">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="mr-3">{item.icon}</div>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;