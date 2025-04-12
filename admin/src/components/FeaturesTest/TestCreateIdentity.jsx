import React, { useState } from "react";
import { Upload, PlusCircle } from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import useStudentIdentity from "../../hooks/useStudentIdentity";

// Student card types and departments remain the same
const studentCardTypes = [
  { value: "undergraduate", name: "Undergraduate ID" },
  { value: "graduate", name: "Graduate ID" },
  { value: "faculty", name: "Faculty ID" },
  { value: "visitor", name: "Visitor Pass" },
];

const studentDepartments = [
  { value: "cs", name: "Computer Science" },
  { value: "eng", name: "Engineering" },
  { value: "bus", name: "Business" },
  { value: "arts", name: "Arts & Humanities" },
];

const TestCreateIdentity = () => {
  const { loading, error, createStudentIdentity } = useStudentIdentity();
  const [formData, setFormData] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
    department: "",
    cardType: "",
    yearLevel: "",
    photo: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert form data to API expected format
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      // Prepare data for API
      const identityData = {
        personalInfo: {
          firstName,
          lastName,
          dateOfBirth: new Date().toISOString().split("T")[0], // Placeholder
          gender: "Not specified", // Placeholder
          nationality: "Not specified", // Placeholder
          placeOfBirth: "Not specified", // Placeholder
        },
        address: {
          street: "Campus Address", // Placeholder
          city: "University City",
          state: "University State",
          postalCode: "00000",
          country: "University Country",
        },
        contactInfo: {
          email: formData.email,
          phone: "", // Optional
        },
        studentInfo: {
          studentId: formData.studentNumber,
          department: formData.department,
          yearLevel: formData.yearLevel,
          cardType: formData.cardType,
        },
        // If using a wallet address
        walletAddress: "", // Optional - system can generate one
      };

      // Call API through our hook
      const result = await createStudentIdentity(identityData);

      // Show success message
      setSuccessMessage(
        `Student ID created successfully with DID: ${result.did}`
      );

      // Reset form
      setFormData({
        fullName: "",
        studentNumber: "",
        email: "",
        department: "",
        cardType: "",
        yearLevel: "",
        photo: null,
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error creating student identity:", err);
      // Error is handled by the hook and accessible via the error variable
    }
  };

  return (
    <Card title="Create Student ID">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter student full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Number
          </label>
          <input
            type="text"
            name="studentNumber"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., S12345678"
            value={formData.studentNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="student@university.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
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
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="cardType"
              value={formData.cardType}
              onChange={handleChange}
              required
            >
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
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            name="yearLevel"
            value={formData.yearLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select year...</option>
            <option value="1">Freshman (1st Year)</option>
            <option value="2">Sophomore (2nd Year)</option>
            <option value="3">Junior (3rd Year)</option>
            <option value="4">Senior (4th Year)</option>
            <option value="5">Graduate Student</option>
          </select>
        </div>

        <div className="relative border border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            id="photo"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="flex items-center gap-2 justify-center">
            <Upload size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {formData.photo ? formData.photo.name : "Upload student photo"}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          icon={loading ? null : <PlusCircle size={16} />}
        >
          {loading ? "Creating..." : "Create Student ID"}
        </Button>
      </form>
    </Card>
  );
};

export default TestCreateIdentity;
