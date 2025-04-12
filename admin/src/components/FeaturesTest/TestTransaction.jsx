import React, { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";

// Updated mock data for student context
const mockStudents = [
  { id: 1, studentId: "S12345678", name: "John Doe", department: "Computer Science", year: "Senior", type: "undergraduate", status: "active", enrollmentDate: "2020-09-01" },
  { id: 2, studentId: "S23456789", name: "Jane Smith", department: "Engineering", year: "2nd Year", type: "graduate", status: "pending", enrollmentDate: "2022-09-01" },
  { id: 3, studentId: "S34567890", name: "Bob Johnson", department: "Business", year: "Junior", type: "undergraduate", status: "active", enrollmentDate: "2021-09-01" },
  { id: 4, studentId: "S45678901", name: "Alice Brown", department: "Arts", year: "1st Year", type: "exchange", status: "inactive", enrollmentDate: "2023-09-01" }
];

const TestVerifyIdentity = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  return (
    <Card title="Verify Student ID">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedStudent || ""}
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
          >
            <option value="">Select student to verify...</option>
            {mockStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.studentId} - {student.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedStudent && (
          <>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <h3 className="font-medium">Student Details</h3>
              {mockStudents
                .filter(s => s.id === selectedStudent)
                .map(student => (
                  <div key={student.id} className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Student ID:</span>
                      <span className="font-medium">{student.studentId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium">{student.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-medium">{student.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{student.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Enrollment Date:</span>
                      <span className="font-medium">{student.enrollmentDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">{student.status}</span>
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
                Verify Student
              </Button>
              <Button 
                variant="secondary" 
                icon={<AlertCircle size={16} />}
              >
                Flag for Review
              </Button>
              <Button 
                variant="danger" 
                icon={<X size={16} />}
              >
                Reject ID
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default TestVerifyIdentity;