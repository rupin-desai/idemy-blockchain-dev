import React, { useState } from "react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { RefreshCw } from "lucide-react";
import apiClient from "../../services/api.service";

const TestCreateIdentity = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "prefer_not_to_say",
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

  // Generate a random student ID
  const generateRandomId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `S${randomNum}`;
  };

  // Handle form field changes
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Enhanced handleSubmit with better logging
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Generate student ID if not provided
      if (!formData.studentInfo.studentId) {
        const randomId = generateRandomId();
        setFormData((prev) => ({
          ...prev,
          studentInfo: {
            ...prev.studentInfo,
            studentId: randomId,
          },
        }));
        formData.studentInfo.studentId = randomId;
      }

      // Log full request data for troubleshooting
      console.log("Creating blockchain identity with data:", formData);

      // Create identity on blockchain via API
      const response = await apiClient.post(
        "/blockchain/identity/create",
        formData
      );

      console.log("Blockchain identity creation response:", response.data);

      if (response.data.success) {
        const txHash = response.data.data.transactionHash;

        // Show detailed success message
        const successMsg = `Identity created successfully! DID: ${response.data.data.did}\nTransaction Hash: ${txHash}`;
        console.log(successMsg);

        onSuccess &&
          onSuccess({
            ...response.data.data,
            successMessage: successMsg,
          });

        // Reset form
        setFormData({
          personalInfo: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "prefer_not_to_say",
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
      } else {
        throw new Error(response.data.message || "Failed to create identity");
      }
    } catch (error) {
      // Detailed error logging
      console.error("Error creating identity:", error);
      console.error("Error details:", error.response?.data || error.message);

      onError &&
        onError(
          error.response?.data?.message ||
            error.message ||
            "Failed to create identity on blockchain"
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-medium mb-4">Create New Identity</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-medium mb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.personalInfo.firstName}
                  onChange={(e) =>
                    handleChange("personalInfo", "firstName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.personalInfo.lastName}
                  onChange={(e) =>
                    handleChange("personalInfo", "lastName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    handleChange("personalInfo", "dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.personalInfo.gender}
                  onChange={(e) =>
                    handleChange("personalInfo", "gender", e.target.value)
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.contactInfo.email}
                  onChange={(e) =>
                    handleChange("contactInfo", "email", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.contactInfo.phone}
                  onChange={(e) =>
                    handleChange("contactInfo", "phone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Auto-generated if empty"
                  value={formData.studentInfo.studentId}
                  onChange={(e) =>
                    handleChange("studentInfo", "studentId", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.studentInfo.department}
                  onChange={(e) =>
                    handleChange("studentInfo", "department", e.target.value)
                  }
                >
                  <option value="cs">Computer Science</option>
                  <option value="eng">Engineering</option>
                  <option value="math">Mathematics</option>
                  <option value="phys">Physics</option>
                  <option value="chem">Chemistry</option>
                  <option value="bio">Biology</option>
                  <option value="bus">Business</option>
                  <option value="arts">Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={formData.studentInfo.type}
                  onChange={(e) =>
                    handleChange("studentInfo", "type", e.target.value)
                  }
                >
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="phd">PhD</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Blockchain Information</h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Wallet Address (optional)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                If empty, a new wallet will be created automatically
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Identity...
              </>
            ) : (
              "Create Identity on Blockchain"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TestCreateIdentity;
