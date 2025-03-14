import React from 'react';
import { FiShield, FiGlobe, FiUser } from 'react-icons/fi';

const HeroBenefits = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Idemy?
        </h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <FiShield className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tamper-proof Credentials</h3>
            <p className="text-gray-600">
              Your academic records stored securely and transparently on the blockchain.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FiGlobe className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Verification</h3>
            <p className="text-gray-600">
              Easily verify your credentials across borders with our decentralized system.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FiUser className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Evolving Identity</h3>
            <p className="text-gray-600">
              Continuously update and manage your identity through verified academic achievements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBenefits;