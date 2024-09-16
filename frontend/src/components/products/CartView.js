import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../features/products/cartSlice"; // Import the actions
import { placeOrder } from "../../services/orderService";

const CartView = ({ toggleCart }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [orderSuccess, setOrderSuccess] = useState(false); // State to manage success message visibility
  const [paymentMethod, setPaymentMethod] = useState(""); // State for selected payment method
  const [error, setError] = useState(""); // State for error message

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    // Check if a payment method is selected
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    const orderData = {
      orderDetails: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalPrice: parseFloat(calculateSubtotal()),
      paymentMethod, // Use the selected payment method
    };

    try {
      const response = await placeOrder(orderData);
      console.log("Order placed successfully:", response);
      setOrderSuccess(true); // Show success message
      dispatch(clearCart()); // Clear the cart
      setError(""); // Clear error message
      // Optionally close the cart after a short delay
      // setTimeout(() => toggleCart(), 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium text-gray-900"
                      id="slide-over-title"
                    >
                      Shopping cart
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={toggleCart}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Success Message */}
                  {orderSuccess && (
                    <div
                      id="alert-additional-content-3"
                      className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 mt-4"
                      role="alert"
                    >
                      <div className="flex items-center">
                        <svg
                          className="flex-shrink-0 w-4 h-4 me-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <h3 className="text-lg font-medium">
                          Order placed successfully!
                        </h3>
                      </div>
                      <div className="mt-2 mb-4 text-sm">
                        Your order has been placed successfully and your cart
                        has been cleared.
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cartItems.map((item) => (
                          <li key={item._id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={`http://localhost:5000${item.image}`}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{item.name}</a>
                                </h3>
                                <p className="ml-4">
                                  Rs: {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.category}
                              </p>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    className="p-1 text-sm text-gray-700 bg-gray-200 rounded"
                                    onClick={() =>
                                      handleDecreaseQuantity(item._id)
                                    }
                                  >
                                    -
                                  </button>
                                  <p className="text-gray-500">
                                    Qty {item.quantity}
                                  </p>
                                  <button
                                    type="button"
                                    className="p-1 text-sm text-gray-700 bg-gray-200 rounded"
                                    onClick={() =>
                                      handleIncreaseQuantity(item._id)
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() =>
                                      handleRemoveFromCart(item._id)
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Select Payment Method
                    </h3>
                    <div className="mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        Cash on Delivery
                      </label>
                      <label className="flex items-center mt-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Card Payment"
                          checked={paymentMethod === "Card Payment"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        Card Payment
                      </label>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}

                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>Rs: {calculateSubtotal()}</p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className={`flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm
                        ${
                          cartItems.length === 0
                            ? "bg-indigo-400 cursor-not-allowed opacity-50"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0} // Disable if no items
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
