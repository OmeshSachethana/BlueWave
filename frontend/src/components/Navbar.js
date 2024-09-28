import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CartView from "./products/CartView";
import ProductSearch from "./products/ProductSearch";
import { useSelector } from "react-redux";
import CartViewSubscription from "./subcriptionPlans/CartViewSubscription";
import logo from "../assets/bluewave_logo.png";

const Navbar = ({ onSearch }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Select regular cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Select subscription cart items from Redux store
  const subscriptionCartItems = useSelector(
    (state) => state.subscriptionCart.plans // Access the correct field for plans
  );

  // Total distinct subscription plans count
  const totalSubscriptionPlansCount = subscriptionCartItems.length;

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Navbar Section */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            {/* Logo Image */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo} // Update the path to your logo
                alt="BlueWave Logo"
                className="h-20 w-26" // Adjust size as needed
              />
              <span className="text-white font-bold text-lg"></span>
            </Link>
          </div>

          {/* Buttons Section */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded ${
                isActive("/")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Home
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
              to="/contact-us"
              className={`px-4 py-2 rounded ${
                isActive("/contact-us")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/orders"
              className={`px-4 py-2 rounded ${
                isActive("/orders")
                  ? "bg-white text-blue-600"
                  : "text-white bg-blue-500 hover:bg-blue-400"
              }`}
            >
              Your Orders
            </Link>
          </div>

          {/* Cart Button Section */}
          <div className="flex items-center space-x-8 ml-[-150px]">
            {location.pathname === "/" && (
              <div className="hidden lg:flex flex-grow">
                {/* Pass the onSearch function to ProductSearch */}
                <ProductSearch onSearch={onSearch} />
              </div>
            )}

            <div className="relative">
              {/* Hide cart button on /payment or /payment-subscriptions paths */}
              {location.pathname !== "/payment" &&
                location.pathname !== "/payment-subscriptions" && (
                  <>
                    {location.pathname === "/subscription-plans" ? (
                      <>
                        {/* Subscription Cart Button */}
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
                          <span className="ml-2">Subscription Cart</span>
                        </button>

                        {/* Unique Notification Badge for Subscription Cart */}
                        {totalSubscriptionPlansCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-yellow-600 text-white rounded-full text-xs px-2 py-1">
                            {totalSubscriptionPlansCount} Subs
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Regular Cart Button */}
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

                        {/* Regular Notification Badge */}
                        {totalItemsInCart > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-1">
                            {totalItemsInCart}
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Conditionally render the CartView or CartViewSubscription based on the current page */}
      {isCartOpen &&
        location.pathname !== "/payment-subscriptions" &&
        location.pathname !== "/payment" &&
        (location.pathname === "/subscription-plans" ? (
          <CartViewSubscription toggleCart={toggleCart} />
        ) : (
          <CartView toggleCart={toggleCart} />
        ))}
    </div>
  );
};

export default Navbar;
