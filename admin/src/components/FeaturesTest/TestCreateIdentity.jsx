import React, { useState } from "react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import { Loader2 } from "lucide-react";
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

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDirectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateRandomId = () => {
    const prefix = "S";
    const randomNum = 100000 + Math.floor(Math.random() * 900000);
    return `${prefix}${randomNum}`;
  };

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

      // Create identity on blockchain via API
      const response = await apiClient.post(
        "/blockchain/identity/create",
        formData
      );

      if (response.data.success) {
        onSuccess && onSuccess(response.data.data);

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
      console.error("Error creating identity:", error);
      onError &&
        onError(error.message || "Failed to create identity on blockchain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create Blockchain Identity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700">
            Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-3">
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
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700">
            Contact Information
          </h3>

          <div className="grid grid-cols-2 gap-3">
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

        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700">
            Student Information
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() =>
                    handleChange("studentInfo", "studentId", generateRandomId())
                  }
                >
                  Generate
                </button>
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={formData.studentInfo.studentId}
                onChange={(e) =>
                  handleChange("studentInfo", "studentId", e.target.value)
                }
                placeholder="Leave empty to auto-generate"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={formData.studentInfo.department}
                onChange={(e) =>
                  handleChange("studentInfo", "department", e.target.value)
                }
              >
                <option value="cs">Computer Science</option>
                <option value="eng">Engineering</option>
                <option value="bus">Business</option>
                <option value="arts">Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Student Type *
              </label>
              <select
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={formData.studentInfo.type}
                onChange={(e) =>
                  handleChange("studentInfo", "type", e.target.value)
                }
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700">
            Blockchain Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Wallet Address (optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={formData.walletAddress}
              onChange={(e) =>
                handleDirectChange("walletAddress", e.target.value)
              }
              placeholder="0x... (leave empty to auto-generate)"
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, a new wallet will be created automatically
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating...
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
