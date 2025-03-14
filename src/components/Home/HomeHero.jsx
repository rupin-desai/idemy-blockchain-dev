import React from 'react';
import { Link } from 'react-router-dom';

const HomeHero = () => {
  return (
    <section className="flex flex-col items-center justify-center flex-grow bg-gray-100 py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 text-center mb-6">
        Your Digital Student Identity, Secured on Blockchain.
      </h1>
      <Link
        to="/create"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors duration-300"
      >
        Get Started
      </Link>
    </section>
  );
};

export default HomeHero;