import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePaymentStatus } from "../../services/orderService";
import { useDispatch } from "react-redux";
import { createPayment } from "../../features/payment/paymentSlice";

const PaymentPage = () => {
  const location = useLocation();
  const { orderId, orderAmount, selectedCard } = location.state || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();  // Use navigate hook for redirection

  const [formData, setFormData] = useState({
    type: selectedCard?.type || "",
    cardNumber: selectedCard?.cardNumber || "",
    name: selectedCard?.name || "",
    expiryDate: selectedCard?.expiryDate || "",
    cvv: selectedCard?.cvv || "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch the createPayment action
      await dispatch(createPayment(formData)).unwrap();

      // Update payment status to "Completed"
      await updatePaymentStatus(orderId, "Completed");
      alert(`Payment of Rs.${orderAmount} for Order #${orderId} completed!`);
      navigate('/orders'); // Navigate to /orders after successful payment
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const handleViewCards = () => {
    navigate('/cards', { state: { orderId, orderAmount } }); // Navigate to the CardListPage
  };

  return (
    
    <section className="bg-white py-8 antialiased">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Payment
          </h2>

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-xl lg:p-8"
            >
              <div className="mb-6 grid grid-cols-2 gap-4">
                {/* Card Type */}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="type"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Card Type*
                  </label>
                  <select
                    id="type"
					value={formData.type}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Card Type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Full name (as displayed on card)*
                  </label>
                  <input
                    type="text"
                    id="name"
					value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Suresh Fernando"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="cardNumber"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Card number*
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
					value={formData.cardNumber}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Card expiration*
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="expiryDate"
                      type="text"
					  value={formData.expiryDate}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="12/23"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900"
                  >
                    CVV*
                    <button
                      data-tooltip-target="cvv-desc"
                      data-tooltip-trigger="hover"
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <svg
                        className="h-4 w-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      id="cvv-desc"
                      role="tooltip"
                      className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300"
                    >
                      The last 3 digits on back of card
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </label>
                  <input
                    type="number"
                    id="cvv"
					value={formData.cvv}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="•••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                Pay now
              </button>
              <div className="mt-6 grow">
              <button
                onClick={handleViewCards}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                View Saved Cards
              </button>
            </div>
            </form>
            {/* View Cards Button */}
            

            <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      Rs.{orderAmount}
                    </dd>
                  </dl>
                </div>
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                  <dt className="text-base font-bold text-gray-900">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900">
                    Rs.{orderAmount}
                  </dd>
                </dl>
              </div>

              <div className="mt-6 flex items-center justify-center gap-8">
                <img
                  className="h-8 w-auto"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg"
                  alt="Visa"
                />
                <img
                  className="h-8 w-auto"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg"
                  alt="MasterCard"
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-500 sm:mt-8 lg:text-left">
            Payment processed by{" "}
            <a
              href="#"
              title=""
              className="font-medium text-primary-700 underline hover:no-underline"
            >
              BlueWave
            </a>{" "}
            for{" "}
            <a
              href="#"
              title=""
              className="font-medium text-primary-700 underline hover:no-underline"
            >
              BlueWave.lk
            </a>
            - Sri Lanka
          </p>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
