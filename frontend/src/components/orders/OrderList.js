import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllOrders, deleteOrder } from "../../services/orderService";
import LoadingSpinner from "../LoadingSpinner";

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    let updatedOrders = orders;

    // Apply filter based on payment status
    if (filter !== "All") {
      updatedOrders = updatedOrders.filter(
        (order) => order.paymentStatus === filter
      );
    }

    // Apply search term filter (Enhanced search functionality)
    if (searchTerm) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          // Searching in user fields
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // Searching in order details (checking product name, if populated)
          order.orderDetails.some((detail) =>
            detail.product?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) ||
          // Searching by payment method
          order.paymentMethod
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          // Searching by delivery location or status
          order.delivery.deliveryLocationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(updatedOrders);
  }, [filter, orders, searchTerm]);

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderToDelete);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderToDelete)
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderToDelete)
      );
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const openModal = (orderId) => {
    setOrderToDelete(orderId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setOrderToDelete(null);
    setModalOpen(false);
  };

  const handlePaymentClick = (orderId, orderAmount) => {
    navigate("/payment", { state: { orderId, orderAmount } });
  };

  // Sort filteredOrders by updatedAt in descending order
  const sortedOrders = filteredOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt); // Sort by updatedAt in descending order
  });

  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div className="container mx-auto flex min-h-screen">
      {/* Sidebar for filters with sticky positioning */}
      <aside
        id="filter-sidebar"
        className="fixed z-10 top-39 left-10 flex flex-col justify-between w-1/4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
      >
        <div className="flex flex-col items-start mb-3 md:items-start md:mb-0">
          <h3 className="font-bold text-xl mb-4 text-gray-900">
            Filter by Payment Status
          </h3>
          <ul className="space-y-2 w-full">
            {/* Ensuring full width for the list */}
            <li>
              <button
                onClick={() => setFilter("All")}
                className={`block w-full text-left py-2 px-4 rounded ${
                  filter === "All" ? "bg-blue-200" : "bg-white"
                }`}
              >
                All
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("Pending")}
                className={`block w-full text-left py-2 px-4 rounded ${
                  filter === "Pending" ? "bg-blue-200" : "bg-white"
                }`}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("Completed")}
                className={`block w-full text-left py-2 px-4 rounded ${
                  filter === "Completed" ? "bg-blue-200" : "bg-white"
                }`}
              >
                Completed
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <section className="w-3/4 p-4 ml-[calc(25%+1rem)]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative">
            <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
              Your Orders
            </h2>

            {/* Search box */}
            <div className="absolute top-0 right-0">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Handle search input
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
              Thanks for placing an order. You can track your order here.
            </p>
          </div>
          <div className="relative">
            {loading ? (
              <LoadingSpinner />
            ) : filteredOrders.length === 0 ? (
              <p className="mt-4 font-normal text-lg leading-8 text-gray-600 mb-11 text-center">
                No orders found.
              </p>
            ) : (
              sortedOrders.map((order) => {
                // Check if any product in the order is unavailable or if product data is missing
                const isOrderDisabled = order.orderDetails.some(
                  (item) => item.product === null
                );

                return (
                  <div
                    key={order._id}
                    className={`main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-[100%] mb-6 relative ${
                      isOrderDisabled ? "opacity-50" : ""
                    }`} // Add opacity to visually indicate disabled order
                  >
                    {/* Conditionally rendered "Pay Now" button */}
                    {order.paymentMethod !== "Cash on Delivery" &&
                      order.paymentStatus !== "Completed" &&
                      order.approvalStatus === "Approved" && (
                        <button
                          className="absolute top-4 right-4 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-200"
                          onClick={() =>
                            handlePaymentClick(order._id, order.totalPrice)
                          }
                          disabled={isOrderDisabled}
                        >
                          <span
                            className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${
                              isOrderDisabled
                                ? "bg-white"
                                : "bg-white group-hover:bg-opacity-0"
                            }`}
                          >
                            Pay Now
                          </span>
                        </button>
                      )}

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                      <div className="data">
                        <p className="font-semibold text-base leading-7 text-black">
                          Order Id:{" "}
                          <span className="text-indigo-600 font-medium">
                            #{order._id}
                          </span>
                        </p>
                        <p className="font-semibold text-base leading-7 text-black mt-4">
                          Order Date:{" "}
                          <span className="text-gray-400 font-medium">
                            {new Date(order.updatedAt).toLocaleString("en-GB", {
                              hour12: false,
                            })}
                          </span>
                        </p>
                        <div className="flex items-center mt-2">
                          <p className="font-semibold text-base leading-7 text-black mr-4">
                            Payment Method:{" "}
                            <span className="text-gray-400 font-medium">
                              {order.paymentMethod}
                            </span>
                          </p>
                          <p className="font-semibold text-base leading-7 text-black mr-4">
                            Name:{" "}
                            <span className="text-gray-400 font-medium">
                              {order.user.name}{" "}
                              {/* Add your actual payment status variable here */}
                            </span>
                          </p>
                          <p className="font-semibold text-base leading-7 text-black">
                            Shipping Address:{" "}
                            <span className="text-gray-400 font-medium">
                              {order.delivery.deliveryLocationName}{" "}
                              {/* Add your actual payment status variable here */}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.orderDetails.map((item, index) => (
                      <div
                        key={index}
                        className="w-full px-3 min-[400px]:px-6 py-6 border-b border-gray-200 gap-6 flex flex-col lg:flex-row items-center"
                      >
                        <div className="w-1/4">
                          <img
                            className="aspect-square w-full lg:max-w-[140px] rounded-xl object-cover"
                            src={
                              item.product && item.product.image
                                ? item.product.image.startsWith("data:image")
                                  ? item.product.image // If the image string already starts with "data:image"
                                  : `data:image/jpeg;base64,${item.product.image}` // Prepend the base64 prefix if missing
                                : "https://via.placeholder.com/140" // Default placeholder if no image
                            }
                            alt={
                              item.product ? item.product.name : "Product Image"
                            }
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/140";
                            }}
                          />
                        </div>
                        <div className="flex flex-row items-center w-full">
                          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                            <div className="flex items-center">
                              <div>
                                <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                                  {item.product
                                    ? item.product.name
                                    : "Product Unavailable"}
                                </h2>
                                <div className="flex items-center">
                                  <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                    Qty:{" "}
                                    <span className="text-gray-500">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <p className="font-medium text-base leading-7 text-black pr-4 mr-4">
                                    Category:{" "}
                                    <span className="text-gray-500">
                                      {item.product
                                        ? item.product.category
                                        : "N/A"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end items-center w-full">
                              <div className="flex gap-3 lg:block">
                                <p className="font-medium text-sm leading-7 text-black">
                                  Price
                                </p>
                                <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">
                                  Rs.
                                  {item.product ? item.product.price || 0 : 0}
                                </p>
                              </div>
                              <div className="flex gap-3 lg:block ml-6">
                                <p className="font-medium text-sm leading-7 text-black">
                                  Delivery Status
                                </p>
                                <p
                                  className={`font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 ${
                                    order.delivery.deliveryStatus === "Shipped"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {order.delivery.deliveryStatus}
                                </p>
                              </div>
                              <div className="flex gap-3 lg:block ml-6">
                                <p className="font-medium text-sm leading-7 text-black">
                                  Approval Status
                                </p>
                                <p
                                  className={`font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 ${
                                    order.approvalStatus === "Approved"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : order.approvalStatus === "Pending"
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {order.approvalStatus}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between">
                      <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
                        <button
                          onClick={() => {
                            // Open the modal if the payment method is Cash on Delivery
                            // or if the payment status is not Completed,
                            // but not if the delivery status is Shipped.
                            if (
                              order.paymentMethod === "Cash on Delivery" ||
                              order.paymentStatus !== "Completed"
                            ) {
                              openModal(order._id); // Open modal with order ID
                            }
                          }}
                          className={`flex outline-0 py-6 sm:pr-6 sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold text-lg text-black bg-white transition-all duration-500 ${
                            (order.paymentStatus === "Completed" &&
                              order.paymentMethod !== "Cash on Delivery") ||
                            order.delivery.deliveryStatus === "Shipped"
                              ? "cursor-not-allowed opacity-50"
                              : "group hover:text-indigo-600"
                          }`}
                          disabled={
                            (order.paymentStatus === "Completed" &&
                              order.paymentMethod !== "Cash on Delivery") ||
                            order.delivery.deliveryStatus === "Shipped"
                          }
                        >
                          <svg
                            className={`stroke-black transition-all duration-500 ${
                              (order.paymentStatus === "Completed" &&
                                order.paymentMethod !== "Cash on Delivery") ||
                              order.delivery.deliveryStatus === "Shipped"
                                ? ""
                                : "group-hover:stroke-indigo-600"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5"
                              stroke=""
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                          Cancel Order
                        </button>

                        <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center flex-grow">
                          {order.paymentMethod === "Cash on Delivery" ? (
                            <span className="text-emerald-600">
                              Cash on Delivery
                            </span>
                          ) : order.paymentStatus === "Pending" ? (
                            <span className="text-red-600">
                              Payment Pending
                            </span>
                          ) : (
                            <span className="text-emerald-600">
                              Paid using {order.paymentMethod}
                            </span>
                          )}
                        </p>
                      </div>

                      <p className="font-semibold text-lg text-black py-6">
                        Total Price:{" "}
                        <span className="text-indigo-600">
                          Rs.{order.totalPrice}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal for deletion confirmation */}
          {modalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">
                  Are you sure you want to delete this order?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleDeleteOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderList;
