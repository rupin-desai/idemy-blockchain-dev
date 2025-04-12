import React from "react";
import { Upload, PlusCircle } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

// Updated for student ID context
const studentCardTypes = [
  { value: "undergraduate", name: "Undergraduate ID" },
  { value: "graduate", name: "Graduate ID" },
  { value: "faculty", name: "Faculty ID" },
  { value: "visitor", name: "Visitor Pass" }
];

const studentDepartments = [
  { value: "cs", name: "Computer Science" },
  { value: "eng", name: "Engineering" },
  { value: "bus", name: "Business" },
  { value: "arts", name: "Arts & Humanities" }
];

const TestCreateIdentity = () => {
  return (
    <Card title="Create Student ID">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter student full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Number
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., S12345678"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University Email
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="student@university.edu"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select department...</option>
              {studentDepartments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Card Type
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select type...</option>
              {studentCardTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Level
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Select year...</option>
            <option value="1">Freshman (1st Year)</option>
            <option value="2">Sophomore (2nd Year)</option>
            <option value="3">Junior (3rd Year)</option>
            <option value="4">Senior (4th Year)</option>
            <option value="5">Graduate Student</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg">
          <Upload size={20} className="text-gray-500" />
          <span className="text-sm text-gray-600">Upload student photo</span>
          <input type="file" className="hidden" />
        </div>
        
        <Button icon={<PlusCircle size={16} />}>
          Create Student ID
        </Button>
      </form>
    </Card>
  );
};

export default TestCreateIdentity;