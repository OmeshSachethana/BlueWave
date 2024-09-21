import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../features/products/cartSlice"; // Import the actions
import { placeOrder, updatePaymentStatus } from "../../services/orderService";
import UserOrderInputModal from "../modals/UserOrderInputModal";

const getLocationName = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Error retrieving location";
  }
};

const CartView = ({ toggleCart }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [userDetails, setUserDetails] = useState({
    name: "",
    location: { lat: 40.748817, lng: -73.985428, name: "" },
  }); // Default location

  useEffect(() => {
    // Load user details from local storage
    const storedUserDetails = JSON.parse(
      localStorage.getItem("userDetails")
    ) || {
      name: "",
      location: { lat: 40.748817, lng: -73.985428, name: "" },
    };
    setUserDetails(storedUserDetails);
  }, []);

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

  const getOrderData = (name, location) => {
    return {
      orderDetails: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalPrice: parseFloat(calculateSubtotal()),
      paymentMethod,
      user: {
        name: name,
      },
      delivery: {
        deliveryLocationName: location.name,
      },
    };
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (userDetails.name && userDetails.location.name) {
      // Place the order with existing user details
      const orderData = getOrderData(userDetails.name, userDetails.location);
      console.log("Order data:", orderData);

      try {
        const response = await placeOrder(orderData);
        console.log("Order placed successfully:", response);

        // Get orderId from response if applicable
        const orderId = response.order._id;

        // If payment method is "Cash on Delivery", mark payment as completed
        if (paymentMethod === "Cash on Delivery") {
          await updatePaymentStatus(orderId, "Completed");
          console.log(
            "Payment status updated to Completed for Cash on Delivery"
          );
        }

        setOrderSuccess(true);
        dispatch(clearCart());
        setError("");
      } catch (error) {
        console.error("Error placing order:", error);
      }
    } else {
      // Show modal to update user details
      setShowModal(true);
    }
  };

  const handleSaveUserDetails = async (name, location) => {
    // Fetch location name from coordinates
    const locationName = await getLocationName(location.lat, location.lng);

    // Update user details
    const updatedUserDetails = {
      name,
      location: { ...location, name: locationName },
    };
    setUserDetails(updatedUserDetails);

    // Save user details to local storage
    localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));

    const orderData = getOrderData(name, updatedUserDetails.location);

    // Place the order with user details
    placeOrder(orderData)
      .then((response) => {
        console.log("Order placed successfully:", response);
        setOrderSuccess(true);
        dispatch(clearCart());
        setError("");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });

    // Close the modal
    setShowModal(false);
  };

  return (
    <div
      className="relative z-50"
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
                                className="h-full w-full object-cover object-center"
                                src={
                                  item.image
                                    ? `http://localhost:5000${item.image}`
                                    : "https://via.placeholder.com/150"
                                }
                                alt={item.name}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/140";
                                }}
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
                  <div className="flex">
                    <div className="w-1/2">
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
                      {/* Display error under payment method */}
                      {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="w-1/2">
                      <h4 className="text-lg font-semibold">User Details</h4>
                      <p>Name: {userDetails.name || "Not provided"}</p>
                      <p>
                        Location: {userDetails.location?.name || "Not provided"}
                      </p>
                      <a
                        href="#"
                        onClick={() => setShowModal(true)}
                        className="mt-2 text-blue-500 underline"
                      >
                        Edit
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-between text-base font-medium text-gray-900 mt-6">
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

      {/* Render the User Input Modal */}
      {showModal && (
        <UserOrderInputModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveUserDetails}
        />
      )}
    </div>
  );
};

export default CartView;
