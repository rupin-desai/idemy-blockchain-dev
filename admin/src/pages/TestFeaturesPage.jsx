import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Upload, 
  Check, 
  X, 
  PlusCircle, 
  Search, 
  Trash2, 
  RefreshCw,
  Save
} from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const TestFeatures = () => {
  const [activeTab, setActiveTab] = useState("forms");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [selectedIdentity, setSelectedIdentity] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const mockIdentities = [
    { id: 1, name: "John Doe", type: "government", status: "active" },
    { id: 2, name: "Jane Smith", type: "passport", status: "pending" },
    { id: 3, name: "Bob Johnson", type: "license", status: "active" },
    { id: 4, name: "Alice Brown", type: "student", status: "inactive" }
  ];
  
  const identityTypes = [
    { value: "government", name: "Government ID" },
    { value: "passport", name: "Passport" },
    { value: "license", name: "Driver's License" },
    { value: "student", name: "Student ID" }
  ];
  
  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      setAlertType("success");
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      reset();
    }, 1500);
  };
  
  const handleError = () => {
    setAlertType("error");
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Features</h1>
        <p className="text-gray-600 mt-1">Test all components and features in one place</p>
      </div>
      
      {showAlert && (
        <div className={`p-4 rounded-md ${alertType === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {alertType === "success" ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${alertType === "success" ? "text-green-800" : "text-red-800"}`}>
                {alertType === "success" ? "Operation completed successfully!" : "An error occurred!"}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button 
                onClick={() => setShowAlert(false)}
                className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["forms", "tables", "identities", "blockchain"].map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Forms Tab */}
      {activeTab === "forms" && (
        <Card title="Form Controls">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="your@email.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identity Type
              </label>
              <select
                className={`w-full p-2 border rounded-md ${errors.type ? "border-red-500" : "border-gray-300"}`}
                {...register("type", { required: "Type is required" })}
              >
                <option value="">Select type...</option>
                {identityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Document
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        {...register("document")}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Submit Form"}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button 
                type="button" 
                variant="danger" 
                onClick={handleError}
              >
                Test Error
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Tables Tab */}
      {activeTab === "tables" && (
        <Card title="Data Tables">
          <div className="flex mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search identities..."
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockIdentities.map((identity) => (
                  <tr key={identity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{identity.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{identity.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {identity.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        identity.status === "active" ? "bg-green-100 text-green-800" :
                        identity.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {identity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                        <button className="text-green-600 hover:text-green-900">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">4</span> results
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
      )}
      
      {/* Identities Tab */}
      {activeTab === "identities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      )}
      
      {/* Blockchain Tab */}
      {activeTab === "blockchain" && (
        <Card title="Blockchain Operations">
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Blockchain Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-600 mb-1">Network ID</p>
                  <p className="font-mono font-medium">1337</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Current Block</p>
                  <p className="font-mono font-medium">1,234,567</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Gas Price</p>
                  <p className="font-mono font-medium">20 Gwei</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Status</p>
                  <p className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="font-medium">Connected</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Contract Interactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium">Identity Contract</h4>
                  <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                    <code className="text-xs font-mono break-all">
                      0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
                    </code>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-3"
                    icon={<RefreshCw size={14} />}
                  >
                    Read Contract
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium">ID Card Contract</h4>
                  <div className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">
                    <code className="text-xs font-mono break-all">
                      0x5b1869D9A4C187F2EAa108f3062412ecf0526b24
                    </code>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-3"
                    icon={<RefreshCw size={14} />}
                  >
                    Read Contract
                  </Button>
                </div>
              </div>
            </div>
            
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
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestFeatures;