import React, { useState } from "react";
import { Save, Globe, Shield, Bell, Mail, Database, KeySquare } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your student ID system</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "general", name: "General", icon: <Globe size={16} /> },
            { id: "blockchain", name: "Blockchain", icon: <Database size={16} /> },
            { id: "security", name: "Security", icon: <Shield size={16} /> },
            { id: "notifications", name: "Notifications", icon: <Bell size={16} /> },
            { id: "templates", name: "ID Templates", icon: <KeySquare size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <Card>
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="University Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Website
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  https://
                </span>
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-r-md"
                  defaultValue="university-name.edu"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="admin@university.edu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID Format
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="S[XXXXXXXX]"
                placeholder="Format for student IDs"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use [X] for digits, [A] for uppercase letters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Card Validity Period (years)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="1"
                min="1"
                max="10"
              />
            </div>
            
            <div className="pt-4">
              <Button icon={<Save size={16} />}>
                Save Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Blockchain Settings */}
      {activeTab === "blockchain" && (
        <Card>
          <h2 className="text-lg font-medium mb-4">Blockchain Configuration</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Network RPC URL
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="https://university-chain.network/rpc"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chain ID
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="1337"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identity Contract Address
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md font-mono"
                defaultValue="0x7e3a4c5b6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2a"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Card Contract Address
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md font-mono"
                defaultValue="0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSync"
                defaultChecked={true}
              />
              <label htmlFor="autoSync" className="text-sm text-gray-700">
                Enable automatic blockchain sync
              </label>
            </div>
            
            <div className="pt-4">
              <Button icon={<Save size={16} />}>
                Save Blockchain Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <Card>
          <h2 className="text-lg font-medium mb-4">Security Settings</h2>
          <form className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Require 2FA for all admin users</p>
              </div>
              <div className="flex items-center">
                <label className="switch">
                  <input type="checkbox" defaultChecked={true} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Session Timeout</h3>
                  <p className="text-xs text-gray-500">Automatically log out after inactivity</p>
                </div>
                <select className="p-2 border border-gray-300 rounded-md text-sm">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">IP Restriction</h3>
                  <p className="text-xs text-gray-500">Limit access to specific IP addresses</p>
                </div>
                <div className="flex items-center">
                  <label className="switch">
                    <input type="checkbox" defaultChecked={false} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button icon={<Save size={16} />}>
                Save Security Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Other tabs would have similar structure */}
      {activeTab === "notifications" && (
        <Card>
          <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
          <form className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                <p className="text-xs text-gray-500">Send email when student ID is issued</p>
              </div>
              <div className="flex items-center">
                <label className="switch">
                  <input type="checkbox" defaultChecked={true} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 my-4 pt-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">SMTP Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Server</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="smtp.university.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Port</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="587"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Username</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="no-reply@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue="••••••••••••"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button icon={<Mail size={16} />}>
                Test Email Settings
              </Button>
              <Button icon={<Save size={16} />} className="ml-2">
                Save Notification Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === "templates" && (
        <Card>
          <h2 className="text-lg font-medium mb-4">ID Card Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-4 rounded-lg bg-gray-50 relative">
              <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Active</div>
              <h3 className="font-medium mb-2">Undergraduate Template</h3>
              <div className="aspect-w-3 aspect-h-2 bg-white border rounded-lg mb-2 flex items-center justify-center">
                <div className="text-sm text-gray-500">ID Card Preview</div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="xs" variant="secondary">Edit</Button>
                <Button size="xs" variant="secondary">Duplicate</Button>
              </div>
            </div>
            
            <div className="border p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2">Graduate Template</h3>
              <div className="aspect-w-3 aspect-h-2 bg-white border rounded-lg mb-2 flex items-center justify-center">
                <div className="text-sm text-gray-500">ID Card Preview</div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="xs" variant="secondary">Edit</Button>
                <Button size="xs" variant="secondary">Set Active</Button>
                <Button size="xs" variant="secondary">Duplicate</Button>
              </div>
            </div>
            
            <div className="border border-dashed p-4 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="text-center">
                <PlusCircle size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-800">Add New Template</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;