import React, { useState } from "react";
import { Button, Input, Select, Textarea } from "../../ui";
import apiClient from "../../services/api.service";

const TestNewIdentity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [identity, setIdentity] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    contactInfo: {
      email: "",
      phone: "",
    },
    studentInfo: {
      studentId: "",
      department: "cs",
      type: "undergraduate",
    },
    walletAddress: "",
  });

  const handleInputChange = (section, field, value) => {
    setIdentity((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Generate a studentId if none provided
      if (!identity.studentInfo.studentId) {
        identity.studentInfo.studentId = `S${
          100000 + Math.floor(Math.random() * 10000)
        }`;
      }

      // Call API to create new identity
      const response = await apiClient.post(
        "/blockchain/identity/create",
        identity
      );

      setSuccess(true);
      console.log("Identity created successfully:", response.data);

      // Reset the form
      setIdentity({
        personalInfo: {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
        },
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "USA",
        },
        contactInfo: {
          email: "",
          phone: "",
        },
        studentInfo: {
          studentId: "",
          department: "cs",
          type: "undergraduate",
        },
        walletAddress: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create identity"
      );
      console.error("Error creating identity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Create New Student Identity
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          Identity created successfully! The identity will be registered on the
          blockchain.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={identity.personalInfo.firstName}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              required
            />
            <Input
              label="Last Name"
              value={identity.personalInfo.lastName}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={identity.personalInfo.dateOfBirth}
              onChange={(e) =>
                handleInputChange("personalInfo", "dateOfBirth", e.target.value)
              }
            />
            <Select
              label="Gender"
              value={identity.personalInfo.gender}
              onChange={(e) =>
                handleInputChange("personalInfo", "gender", e.target.value)
              }
              options={[
                { value: "", label: "Select Gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                { value: "prefer_not_to_say", label: "Prefer not to say" },
              ]}
            />
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={identity.contactInfo.email}
              onChange={(e) =>
                handleInputChange("contactInfo", "email", e.target.value)
              }
              required
            />
            <Input
              label="Phone"
              value={identity.contactInfo.phone}
              onChange={(e) =>
                handleInputChange("contactInfo", "phone", e.target.value)
              }
            />
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium mb-3">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Student ID (optional, will be generated if empty)"
              value={identity.studentInfo.studentId}
              onChange={(e) =>
                handleInputChange("studentInfo", "studentId", e.target.value)
              }
            />
            <Select
              label="Department"
              value={identity.studentInfo.department}
              onChange={(e) =>
                handleInputChange("studentInfo", "department", e.target.value)
              }
              options={[
                { value: "cs", label: "Computer Science" },
                { value: "eng", label: "Engineering" },
                { value: "bus", label: "Business" },
                { value: "arts", label: "Arts" },
              ]}
              required
            />
            <Select
              label="Student Type"
              value={identity.studentInfo.type}
              onChange={(e) =>
                handleInputChange("studentInfo", "type", e.target.value)
              }
              options={[
                { value: "undergraduate", label: "Undergraduate" },
                { value: "graduate", label: "Graduate" },
                { value: "exchange", label: "Exchange" },
              ]}
              required
            />
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium mb-3">
            Blockchain Information (Optional)
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Wallet Address (Optional, will be generated if empty)"
              placeholder="0x..."
              value={identity.walletAddress}
              onChange={(e) =>
                handleInputChange("walletAddress", "", e.target.value)
              }
            />
            <p className="text-xs text-gray-500">
              If you don't provide a wallet address, a new one will be generated
              automatically.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Student Identity"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestNewIdentity;
