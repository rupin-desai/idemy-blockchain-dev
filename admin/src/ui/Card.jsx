import React from "react";

const Card = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-100 p-6 ${className}`}>
      {title && <h2 className="text-lg font-medium text-gray-800 mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;