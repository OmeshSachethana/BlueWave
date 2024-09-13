import React, { useState } from "react";
import CartView from "./products/CartView"; // Ensure CartView is imported

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div>
      {/* Navbar Section */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-white font-bold text-lg">
            <a href="/">BlueWave</a>
          </div>

          {/* Buttons Section */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Products
            </a>
            <a
              href="#"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Special Offers
            </a>
            <a
              href="#"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Contact Us
            </a>
          </div>

          {/* Cart Button Section */}
          <div className="relative">
            <button
              type="button"
              className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-400 focus:outline-none"
              onClick={toggleCart} // Toggle cart visibility
            >
              <svg
                className="h-6 w-6 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H3m4 8v6m10-6v6m-6-6v6"
                />
              </svg>
              <span className="ml-2">Cart</span>
            </button>

            {/* Notification Badge */}
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-1">
              3
            </span>
          </div>
        </div>
      </nav>

      {/* Conditionally render the CartView if isCartOpen is true */}
      {isCartOpen && <CartView toggleCart={toggleCart} />}
    </div>
  );
};

export default Navbar;
