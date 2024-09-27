import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromSubscriptionCart } from "../../features/subscription/subscriptionCartSlice";
import { useNavigate } from "react-router-dom";

const CartViewSubscription = ({ toggleCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Corrected useSelector to get plans from the subscriptionCart slice
  const subscriptionPlans = useSelector(
    (state) => state.subscriptionCart.plans
  );
  const [error, setError] = useState("");

  // Remove subscription plan
  const handleRemoveSubscription = (planId) => {
    dispatch(removeFromSubscriptionCart(planId));
  };

  // Calculate total pricing for selected subscription plans
  const calculateSubtotal = () => {
    return subscriptionPlans
      .reduce((total, plan) => total + plan.pricing, 0)
      .toFixed(2);
  };

  // Handle subscription checkout (go directly to payment)
  const handleCheckout = () => {
    if (subscriptionPlans.length === 0) {
      setError("Please add subscription plans to proceed.");
      return;
    }

    // Prepare paymentData with all selected plans
    const paymentData = subscriptionPlans.map((plan) => ({
      planID: plan._id,
      planName: plan.name,
      planPrice: plan.pricing.toFixed(2), // Format the pricing as needed
    }));

    const totalPrice = paymentData
      .reduce((total, plan) => total + parseFloat(plan.planPrice), 0)
      .toFixed(2);

    console.log("Redirecting to payment with data:", {
      paymentData,
      totalPrice,
    });

    // Navigate to the payment route with paymentData and totalPrice
    navigate("/payment-subscriptions", { state: { paymentData, totalPrice } });
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
                      Subscription Plans
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

                  {/* Error Message */}
                  {error && (
                    <div
                      className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 mt-4"
                      role="alert"
                    >
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {subscriptionPlans.map((plan) => (
                          <li key={plan._id} className="flex py-6">
                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{plan.name}</a>
                                </h3>
                                <p className="ml-4">
                                  Rs: {plan.pricing.toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {plan.description}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Duration: {plan.duration}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Delivery Frequency: {plan.deliveryFrequency}
                              </p>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                    onClick={() =>
                                      handleRemoveSubscription(plan._id)
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
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-6">
                    <p>Subtotal</p>
                    <p>Rs: {calculateSubtotal()}</p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className={`flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm
                          ${
                            subscriptionPlans.length === 0
                              ? "bg-indigo-400 cursor-not-allowed opacity-50"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                      onClick={handleCheckout}
                      disabled={subscriptionPlans.length === 0}
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

export default CartViewSubscription;
