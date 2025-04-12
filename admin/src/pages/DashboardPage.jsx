import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, CreditCard, FileText, Database, Activity } from "lucide-react";
import Card from "../ui/Card";

const data = [
  { month: "Jan", identities: 12, documents: 24, nfts: 10 },
  { month: "Feb", identities: 18, documents: 28, nfts: 15 },
  { month: "Mar", identities: 22, documents: 32, nfts: 20 },
  { month: "Apr", identities: 25, documents: 35, nfts: 25 },
  { month: "May", identities: 30, documents: 40, nfts: 30 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the SSI Blockchain Platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Identities" 
          value="1,234" 
          icon={<Users size={24} className="text-blue-500" />} 
          change="+12%" 
          color="blue" 
        />
        <StatCard 
          title="ID Cards Issued" 
          value="956" 
          icon={<CreditCard size={24} className="text-green-500" />} 
          change="+8%" 
          color="green" 
        />
        <StatCard 
          title="Documents Verified" 
          value="3,567" 
          icon={<FileText size={24} className="text-amber-500" />} 
          change="+15%" 
          color="amber" 
        />
        <StatCard 
          title="Blockchain Transactions" 
          value="12,498" 
          icon={<Database size={24} className="text-purple-500" />} 
          change="+24%" 
          color="purple" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Identity Creation">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="identities" fill="#3b82f6" />
                <Bar dataKey="nfts" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Document Verification">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="documents" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-4 py-3 border-b last:border-0">
              <div className="p-2 bg-blue-100 rounded-full">
                <Activity size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">New identity</span> created by John Doe
                </p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, change, color }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
          <p className={`mt-1 text-xs text-${color}-600`}>{change} this month</p>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Dashboard;