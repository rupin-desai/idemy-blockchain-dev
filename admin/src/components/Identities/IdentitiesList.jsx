import React, { useEffect } from "react";
import { Eye, Edit, AlertCircle } from "lucide-react";
import useStudentIdentity from "../../hooks/useStudentIdentity";
import Button from "../../ui/Button";

const IdentitiesList = ({ refreshIdentities, filters = {}, error }) => {
  const {
    loading,
    studentIdentities,
    fetchStudentIdentities,
    verifyStudentIdentity,
  } = useStudentIdentity();

  useEffect(() => {
    // This component should not fetch by default now since it's handled by parent
    // but we'll keep this as a fallback
    if (studentIdentities.length === 0 && !loading) {
      fetchStudentIdentities();
    }
  }, [fetchStudentIdentities]);

  const handleVerify = async (did, status) => {
    try {
      await verifyStudentIdentity(did, status);
      // Refresh the list after verification
      if (refreshIdentities && typeof refreshIdentities === "function") {
        refreshIdentities();
      }
    } catch (err) {
      console.error("Failed to verify identity:", err);
    }
  };

  if (error) {
    return null; // Error is already displayed in parent component
  }

  if (loading) {
    return <div className="text-center py-10">Loading student records...</div>;
  }

  if (studentIdentities.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No student records found. Try adjusting your search or filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {studentIdentities.length > 0 ? (
            studentIdentities.map((identity) => (
              <tr key={identity.did} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm text-gray-900 truncate max-w-[140px]"
                    title={identity.did}
                  >
                    {identity.did}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {identity.personalInfo?.firstName}{" "}
                    {identity.personalInfo?.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {identity.contactInfo?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {identity.studentInfo?.department === "cs" &&
                      "Computer Science"}
                    {identity.studentInfo?.department === "eng" &&
                      "Engineering"}
                    {identity.studentInfo?.department === "bus" && "Business"}
                    {identity.studentInfo?.department === "arts" &&
                      "Arts & Humanities"}
                    {!identity.studentInfo?.department && "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      identity.identityStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : identity.identityStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {identity.identityStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      title="View"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="Edit"
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit size={18} />
                    </button>
                    {identity.identityStatus === "pending" && (
                      <Button
                        size="xs"
                        variant="success"
                        onClick={() => handleVerify(identity.did, "verified")}
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No student records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IdentitiesList;
