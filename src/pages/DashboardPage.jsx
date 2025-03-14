import React, { useState } from "react";

const DashboardPage = () => {
  const user = {
    fullName: "Alice Smith",
    email: "alice.smith@example.com",
    university: "Blockchain University",
    studentId: "B123456",
    reputation: 92,
    status: "pending", // "verified" or "pending"
  };

  const timelineUpdates = [
    { date: "2023-09-01", update: "Created blockchain identity." },
    { date: "2023-09-15", update: "Updated academic credentials." },
    { date: "2023-10-05", update: "Added extracurricular activities." },
  ];

  const [showModal, setShowModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    university: "",
    details: "",
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger update request here (integration later)
    console.log("Request Update:", updateForm);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user.fullName}!
        </h1>

        {/* Summary Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Name:</span> {user.fullName}
            </div>
            <div>
              <span className="font-medium">University:</span> {user.university}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Student ID:</span> {user.studentId}
            </div>
            <div>
              <span className="font-medium">Reputation Score:</span> {user.reputation}
            </div>
          </div>
        </div>

        {/* Identity Status */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Identity Status</h2>
            <p
              className={`font-medium ${
                user.status === "pending"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {user.status === "pending" ? "Pending Verification" : "Verified"}
            </p>
          </div>
          {user.status === "pending" && (
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Verify Now
            </button>
          )}
        </div>

        {/* Timeline / History */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Timeline / History</h2>
          <ul className="space-y-4">
            {timelineUpdates.map((item, index) => (
              <li key={index} className="border-l-4 border-blue-600 pl-4">
                <p className="text-gray-600 text-sm">{item.date}</p>
                <p className="text-gray-800">{item.update}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Request Update Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          onClick={openModal}
        >
          Request Update
        </button>
      </div>

      {/* Request Update Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md transform transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Request Update</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="university"
                  className="block text-gray-700 mb-2"
                >
                  New University
                </label>
                <input
                  type="text"
                  name="university"
                  id="university"
                  value={updateForm.university}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter new university"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="details" className="block text-gray-700 mb-2">
                  Update Details
                </label>
                <textarea
                  name="details"
                  id="details"
                  value={updateForm.details}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter details of the update"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;