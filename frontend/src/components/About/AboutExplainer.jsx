import React from 'react';
import { FiCloud, FiLock, FiShield } from 'react-icons/fi';

const explainerData = [
  {
    Icon: FiCloud,
    title: 'Decentralized Storage',
    description:
      'Your data is stored across a secure, distributed network ensuring no single point of failure.',
  },
  {
    Icon: FiLock,
    title: 'Immutable Records',
    description:
      'Once recorded, your credentials cannot be tampered with, guaranteeing trust and security.',
  },
  {
    Icon: FiShield,
    title: 'Privacy-First Design',
    description:
      'We prioritize your privacy, ensuring your identity is protected while remaining accessible.',
  },
];

const AboutExplainer = () => {
  return (
    <section className="mb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        How Blockchain Secures Your Identity
      </h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {explainerData.map(({ Icon, title, description }, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded shadow-md">
            <Icon className="text-blue-600 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutExplainer;