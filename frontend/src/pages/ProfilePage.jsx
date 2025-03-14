import React from 'react';

const ProfilePage = () => {
  const profile = {
    fullName: 'Alice Smith',
    email: 'alice.smith@example.com',
    university: 'Blockchain University',
    studentId: 'B123456',
    reputation: 92,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Avatar"
            className="mb-4 rounded-full"
          />
          <h2 className="text-2xl font-bold mb-2">{profile.fullName}</h2>
        </div>
        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">University:</span> {profile.university}
          </p>
          <p>
            <span className="font-semibold">Student ID:</span> {profile.studentId}
          </p>
          <p>
            <span className="font-semibold">Reputation Score:</span> {profile.reputation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;