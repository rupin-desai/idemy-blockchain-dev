import React, { useState } from "react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import useStudentIdentity from "../../hooks/useStudentIdentity";

const TestCreateIdentity = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { createStudentIdentity } = useStudentIdentity();

  const handleCreateIdentity = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Sample student data
      const studentData = {
        personalInfo: {
          firstName: "John",
          lastName: "Student",
          middleName: "",
          dateOfBirth: "2000-01-01",
          gender: "Male",
          nationality: "United States",
          placeOfBirth: "New York",
        },
        address: {
          street: "123 University Ave",
          city: "College Town",
          state: "CA",
          postalCode: "12345",
          country: "United States",
        },
        contactInfo: {
          email: "john.student@university.edu",
          phone: "+11234567890",
        },
        studentInfo: {
          department: "cs",
          studentId: "CS" + Math.floor(10000 + Math.random() * 90000),
        },
      };

      await createStudentIdentity(studentData);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating student identity:", err);
      setError(err.message || "Failed to create student identity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Create Test Student</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      <p className="mb-4 text-gray-600">
        This will create a sample student identity with randomized information
        for testing purposes.
      </p>

      <Button
        variant="primary"
        disabled={isSubmitting}
        onClick={handleCreateIdentity}
      >
        {isSubmitting ? "Creating..." : "Create Sample Student"}
      </Button>
    </Card>
  );
};

export default TestCreateIdentity;
