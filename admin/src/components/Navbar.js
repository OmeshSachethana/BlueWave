import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import add_product_image from "../assets/add-product.png";
import AddProductModal from "./modals/AddProductModal";
import { getAllProducts } from "../services/productService";
import { setProducts } from "../features/products/productsSlice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const dispatch = useDispatch(); // Use dispatch here

  const location = useLocation();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      dispatch(setProducts(productsData)); // Dispatch the products to the store
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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
            <Link
              to="/products"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Products
            </Link>
            <Link
              to="/special-offers"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Special Offers
            </Link>
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

          {/* Cart Button Section */}
          <div className="flex items-center space-x-8">
            {/* Conditionally render the Add Product image on the home page */}
            {location.pathname === "/products" && (
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

