import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Brand Info */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="text-white text-2xl font-bold">Idemy</h3>
          <p className="mt-2 text-sm">Blockchain based student identity system</p>
        </div>
        {/* Quick Links */}
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-white text-sm">
            Home
          </Link>
          <Link to="/about" className="hover:text-white text-sm">
            About
          </Link>
          <Link to="/create" className="hover:text-white text-sm">
            Get Started
          </Link>
        </div>
        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;