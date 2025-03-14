import React from 'react';
import { FiShield, FiGlobe, FiUser } from 'react-icons/fi';

const benefits = [
  {
    Icon: FiShield,
    title: 'Tamper-proof Credentials',
    description:
      'Your academic records stored securely and transparently on the blockchain.',
  },
  {
    Icon: FiGlobe,
    title: 'Global Verification',
    description:
      'Easily verify your credentials across borders with our decentralized system.',
  },
  {
    Icon: FiUser,
    title: 'Evolving Identity',
    description:
      'Continuously update and manage your identity through verified academic achievements.',
  },
];

const HeroBenefits = () => {
  return (
    <section className="py-12 sm:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          Why Choose Idemy?
        </h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {benefits.map(({ Icon, title, description }, index) => (
            <div key={index} className="flex flex-col items-center text-center px-4">
              <Icon className="text-blue-600 text-4xl sm:text-5xl md:text-6xl mb-4" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBenefits;