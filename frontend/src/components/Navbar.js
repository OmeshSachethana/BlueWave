import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CartView from "./products/CartView";
import add_product_image from "../assets/add-product.png";
import AddProductModal from "./modals/AddProductModal";
import { getAllProducts } from "../services/productService";
import { setProducts } from "../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const dispatch = useDispatch(); // Use dispatch here

  const location = useLocation();

  // Use useSelector to access the cart state
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate the total number of items in the cart
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

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
              to="/contact-us"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Contact Us
            </Link>
            <Link
              to="/employee"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
            >
              Employee
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
            <div className="relative">
              <button
                type="button"
                className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-400 focus:outline-none"
                onClick={toggleCart}
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
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-1">
                  {totalItemsInCart}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        fetchProducts={fetchProducts}
      />

      {/* Conditionally render the CartView if isCartOpen is true */}
      {isCartOpen && <CartView toggleCart={toggleCart} />}
    </div>
  );
};

export default Navbar;

