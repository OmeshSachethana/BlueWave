import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  
  return (
    <div>
      {/* Navbar Section */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-white font-bold text-lg">
            <Link to="/">BlueWave</Link>
          </div>

          {/* Buttons Section */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Home
            </Link>
            {/* <Link
              to="/products"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Products
            </Link> */}
            {/* <Link
              to="/special-offers"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Special Offers
            </Link> */}
            <Link
              to="/employee"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Employee
            </Link>
            <Link
              to="/payroll"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Payroll
            </Link>
            
          </div>

         
        </div>
      </nav>

      
    </div>
  );
};

export default Navbar;
