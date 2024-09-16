import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPayment } from "../../features/payment/paymentSlice";

const PaymentPage = () => {
  const location = useLocation();
  const { orderId, orderAmount } = location.state || {};
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    type: "Credit Card", // or "Debit Card"
  });

  const { loading, error } = useSelector((state) => state.payment);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      type: formData.type,
      cardNumber: formData.cardNumber,
      name: formData.full_name,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    };

    // Dispatch createPayment action
    dispatch(createPayment(paymentData))
      .unwrap()
      .then(() => {
        alert(`Payment of Rs.${orderAmount} for Order #${orderId} completed!`);
      })
      .catch((error) => {
        alert("Error processing payment. Please try again.");
      });
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Payment
          </h2>

          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8"
            >
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full name (as displayed on card)*
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="cardNumber"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card number*
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card expiration*
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="12/23"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    CVV*
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    placeholder="•••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? "Processing..." : "Pay now"}
              </button>
              {error && (
                <p className="mt-4 text-sm text-red-500">
                  {error.message || "An error occurred"}
                </p>
              )}
            </form>

            <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Original price
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    Rs.{orderAmount}
                  </dd>
                </dl>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    Rs.{orderAmount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
