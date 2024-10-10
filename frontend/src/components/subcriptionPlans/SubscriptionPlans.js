import React, { useEffect, useState } from "react";
import { getPlans } from "../../services/subscriptionPlanService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/products/cartSlice";

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]); // State to hold filtered plans
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = (plan) => {
    const subscriptionItem = {
      _id: plan._id,
      name: plan.name,
      description: plan.description,
      pricing: plan.pricing,
      duration: plan.duration,
      deliveryFrequency: plan.deliveryFrequency,
      type: "subscription", // To differentiate it from product items
    };

    console.log("Adding subscription to cart:", subscriptionItem);
    dispatch(addToCart(subscriptionItem)); // Dispatch action to add the subscription plan to the cart
  };

  useEffect(() => {
    // Fetch subscription plans on component mount
    const fetchPlans = async () => {
      try {
        const result = await getPlans();
        setPlans(result);
        setFilteredPlans(result); // Initially, all plans are displayed
      } catch (err) {
        setError("Failed to load plans");
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    // Filter plans based on the search term
    if (searchTerm) {
      const filtered = plans.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by name
          plan.description.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by description
          plan.duration.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by duration
          plan.pricing.toString().includes(searchTerm) || // Search by pricing
          plan.deliveryFrequency
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Search by delivery frequency
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(plans); // If no search term, show all plans
    }
  }, [searchTerm, plans]);

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 mt-[-30px] relative">
      {/* Search box placed at the top right */}
      <div className="absolute top-8 right-4">
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
              Choose the Water Delivery Plan that Suits You Best
            </h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl">
              Whether you need fresh water delivered weekly, bi-weekly, or
              monthly, we've got a plan designed just for you. Enjoy the
              convenience of consistent water delivery and stay refreshed.
            </p>
          </div>

          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow"
                >
                  <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
                  <p className="font-light text-gray-500 sm:text-lg">
                    {plan.description}
                  </p>
                  <div className="flex justify-center items-baseline my-8">
                    <span className="mr-2 text-5xl font-extrabold">
                      Rs.{plan.pricing}
                    </span>
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      handleAddToCart(plan);
                      e.preventDefault();
                    }}
                    className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Get started
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No plans found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPlans;
