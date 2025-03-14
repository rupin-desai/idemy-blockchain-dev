import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { motion } from "framer-motion";
import MobileNavbar from "../Menu/MobileNavbar";

// Updated navigation links to include new pages
const navigationLinks = [
  {
    name: "HOME",
    path: "/",
    dropdown: [],
  },
  {
    name: "ABOUT",
    path: "/about",
    dropdown: [],
  },
  {
    name: "CREATE",
    path: "/create",
    dropdown: [],
  },
  {
    name: "DASHBOARD",
    path: "/dashboard",
    dropdown: [],
  },
  {
    name: "PROFILE",
    path: "/profile",
    dropdown: [],
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownState, setDropdownState] = useState(
    Object.fromEntries(
      navigationLinks.map((link) => [link.name.toLowerCase(), false])
    )
  );

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState); // Toggle the state for mobile menu visibility
  };

  const toggleDropdown = (item) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  // Function to close the navbar
  const closeNavbar = () => {
    setIsOpen(false); // Close the navbar
  };

  return (
    <header className="bg-white p-0 w-full z-10 text-blue-500">
      <nav className="container mx-auto flex justify-between items-center py-6 px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <div className="flex flex-start">
          <img
            src="/Digi_Logo_Full_Cropped.png"
            alt="Digi Logo"
            className="h-14 sm:h-14 w-auto transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex sm:flex-row text-base font-medium text-gray-custom sm:space-x-10 items-center">
          {navigationLinks.map(({ name, path, dropdown }) => (
            <li
              key={name}
              className="relative group hover:text-gray-600 transition"
            >
              <Link
                to={path}
                className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full"
              >
                {name}
              </Link>
              {/* Dropdown */}
              {dropdown.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg overflow-hidden transform translate-y-4 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 z-50">
                  {dropdown.map(({ name: dropdownName, path: dropdownPath }) => (
                    <li
                      key={dropdownName}
                      className="px-4 py-2 hover:bg-gray-100 transition whitespace-nowrap"
                    >
                      <a
                        href={dropdownPath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dropdownName}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger Button for Mobile Menu */}
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={toggleMenu}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <GiCancel size={30} className="text-blue-500" />
            ) : (
              <GiHamburgerMenu size={30} className="text-blue-500" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileNavbar
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        dropdownState={dropdownState}
        navigationLinks={navigationLinks}
        closeNavbar={closeNavbar} // Pass closeNavbar function here
      />
    </header>
  );
};

export default Navbar;
