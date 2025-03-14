import React, { useState } from 'react';

const CreatePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    studentId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.university.trim()) newErrors.university = 'University Name is required.';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setSuccess(false);

    // Simulate a smart contract function call (integration later)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        university: '',
        studentId: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Your Identity
        </h2>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Identity successfully created!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="university" className="block text-gray-700 mb-2">
              University Name
            </label>
            <input
              type="text"
              name="university"
              id="university"
              value={formData.university}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.university ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              placeholder="University Name"
            />
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">{errors.university}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="studentId" className="block text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              id="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.studentId ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none`}
              placeholder="Your Student ID"
            />
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                />
                Processing...
              </>
            ) : (
              'Create Identity'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;