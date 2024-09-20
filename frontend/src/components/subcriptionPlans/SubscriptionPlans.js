import React, { useEffect, useState } from 'react';
import { getPlans } from '../../services/subscriptionPlanService'; // Import the service
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch subscription plans on component mount
    const fetchPlans = async () => {
      try {
        const result = await getPlans();
        setPlans(result);
      } catch (err) {
        setError("Failed to load plans");
      }
    };

    fetchPlans();
  }, []);

  // const handlePaymentClick = (plan) => {
  //   navigate('/payment', { state: { planID: plan._id, planPrice: plan.pricing } });
  // };

  const handlePaymentClick = (planID, planPrice) => {
    navigate('/payment-subscriptions', { state: { planID: planID, planPrice: planPrice } });
    console.log(planPrice);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 mt-[-30px]">
      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
              Choose the Water Delivery Plan that Suits You Best
            </h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl">
              Whether you need fresh water delivered weekly, bi-weekly, or monthly, we've got a plan designed just for you. Enjoy the convenience of consistent water delivery and stay refreshed.
            </p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {plans.map((plan) => (
              <div key={plan._id} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow">
                <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
                <p className="font-light text-gray-500 sm:text-lg">
                  {plan.description}
                </p>
                <div className="flex justify-center items-baseline my-8">
                  <span className="mr-2 text-5xl font-extrabold">Rs.{plan.pricing}</span>
                  <span className="text-gray-500">/{plan.duration}</span>
                </div>
                <ul role="list" className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Delivery frequency: {plan.deliveryFrequency}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>No setup or hidden fees</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Personalized support</span>
                  </li>
                </ul>
                <button
                  onClick={() => handlePaymentClick(plan._id, plan.pricing)}
                  className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPlans;
