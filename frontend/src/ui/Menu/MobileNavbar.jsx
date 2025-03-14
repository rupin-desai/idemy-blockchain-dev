import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MobileNavbar = ({
  isOpen,
  toggleDropdown,
  dropdownState,
  navigationLinks,
  closeNavbar, // Function to close navbar when a link is clicked
}) => {
  const navbarRef = useRef(null);  // Reference for the navbar container

  // Close the navbar if the click is outside the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeNavbar();  // Close navbar if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeNavbar]);

  return (
    <motion.div
      ref={navbarRef}  // Attach ref to the navbar div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-0 text-white w-64 sm:w-80 px-6 py-4 text-left transition-transform duration-300 ease-in-out z-50 bg-indigo-600`}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo at the top, centered */}
      <div className="flex justify-center mb-8">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-14 w-auto transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Menu Items */}
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]"> {/* Make navbar scrollable */}
        <ul className="space-y-6 pt-32">
          {navigationLinks.map(({ name, path, dropdown }) => (
            <li key={name} className="relative transition">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleDropdown(name.toLowerCase())}
              >
                <Link
                  to={path}
                  className="block px-2 py-1"
                  onClick={() => closeNavbar()} // Close navbar on link click
                >
                  {name}
                </Link>
                {/* Dropdown Arrow */}
                {dropdown.length > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-white transition transform ${
                      dropdownState[name.toLowerCase()] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>

              {/* Dropdown Menu */}
              {dropdown.length > 0 && (
                <ul
                  style={{
                    maxHeight: dropdownState[name.toLowerCase()] ? "500px" : "0px", // Adjust maxHeight as needed
                    transition: "max-height 0.5s ease-out",
                  }}
                  className="pl-6 mt-2 bg-indigo-600 rounded-md overflow-hidden origin-top"
                >
                  {dropdown.map(({ name: dropdownName, path: dropdownPath }) => (
                    <li
                      key={dropdownName}
                      className="px-4 py-2 transition whitespace-nowrap"
                    >
                      <Link
                        to={dropdownPath}
                        onClick={() => closeNavbar()} // Close navbar on dropdown link click
                      >
                        {dropdownName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default MobileNavbar;
