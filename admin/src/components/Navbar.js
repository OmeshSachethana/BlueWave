import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import add_product_image from "../assets/add-product.png";
import AddProductModal from "./modals/AddProductModal";
import { getAllProducts } from "../services/productService";
import { setProducts } from "../features/products/productsSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const dispatch = useDispatch(); // Use dispatch here
  const location = useLocation(); // Get the current location

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      dispatch(setProducts(productsData)); // Dispatch the products to the store
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

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
              className={`px-4 py-2 rounded ${
                isActive("/products")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Products
            </Link>
            <Link
              to="/subscription-plans"
              className={`px-4 py-2 rounded ${
                isActive("/subscription-plans")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Subscription Plans
            </Link>
            <Link
              to="/employee"
              className={`px-4 py-2 rounded ${
                isActive("/employee")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Employee
            </Link>
            <Link
              to="/payroll"
              className={`px-4 py-2 rounded ${
                isActive("/payroll")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Payroll
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded ${
                isActive("/orders")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Customer Orders
            </Link>
            <Link
              to="/maintenance"
              className={`px-4 py-2 rounded ${
                isActive("/maintenance")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Maintenance
            </Link>
            <Link
              to="/schedule"
              className={`px-4 py-2 rounded ${
                isActive("/schedule")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Schedule
            </Link>
          </div>

          {/* Cart Button Section */}
          <div className="flex items-center space-x-8">
            {/* Conditionally render the Add Product image on the products page */}
            {location.pathname === "/" && (
              <button onClick={toggleModal}>
                <img
                  src={add_product_image}
                  alt="Add Product"
                  className="h-8 w-8 cursor-pointer"
                />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default Navbar;
