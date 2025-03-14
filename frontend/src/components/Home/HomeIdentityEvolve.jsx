import React from 'react';
import {
  FaUserEdit,
  FaChartLine,
  FaCertificate,
  FaArrowRight,
  FaArrowDown,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomeIdentityEvolve = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Your Digital Identity, Evolving with You
        </h2>
        <p className="text-center text-gray-600 mb-12">
          In the era of blockchain, your student identity is more than a snapshot—it's a living record that grows with your achievements, milestones, and progress.
        </p>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-blue-600 ml-4 mb-8">
          {/* Step 1 */}
          <div className="mb-8 flex items-center">
            <div className="flex-shrink-0 bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
              <FaUserEdit className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">Step 1: Initial ID Creation</h3>
              <p className="text-gray-600">
                Your basic information is securely recorded on the blockchain, setting the foundation for your immutable student record.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="mb-8 flex items-center">
            <div className="flex-shrink-0 bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">Step 2: Updates Over Time</h3>
              <p className="text-gray-600">
                As you progress, new achievements and academic milestones continuously update your digital record.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="mb-8 flex items-center">
            <div className="flex-shrink-0 bg-blue-600 rounded-full h-10 w-10 flex items-center justify-center">
              <FaCertificate className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">Step 3: Fully Evolved Identity</h3>
              <p className="text-gray-600">
                Your comprehensive identity reflects verified credentials, certifications, and lifelong academic achievements.
              </p>
            </div>
          </div>
        </div>

        {/* Cycle Card with Responsive Arrows */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row items-center justify-around">
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <span className="text-blue-600 font-semibold text-lg">Creation</span>
              <p className="text-gray-600 text-sm text-center">
                Immutable records established
              </p>
            </div>
            {/* Arrow: Right on medium+ screens, Down on small screens */}
            <div className="flex flex-col items-center">
              <FaArrowRight className="hidden md:block text-blue-600 text-2xl mx-4" />
              <FaArrowDown className="block md:hidden text-blue-600 text-2xl my-2" />
            </div>
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <span className="text-blue-600 font-semibold text-lg">Updation</span>
              <p className="text-gray-600 text-sm text-center">
                Continual academic enhancements
              </p>
            </div>
            {/* Arrow: Right on medium+ screens, Down on small screens */}
            <div className="flex flex-col items-center">
              <FaArrowRight className="hidden md:block text-blue-600 text-2xl mx-4" />
              <FaArrowDown className="block md:hidden text-blue-600 text-2xl my-2" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-600 font-semibold text-lg">Lifelong Usage</span>
              <p className="text-gray-600 text-sm text-center">
                Verified for life
              </p>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            This cycle illustrates the continuous process: from initial record creation, through regular updates, to a comprehensive, lifelong digital identity.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/about"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeIdentityEvolve;