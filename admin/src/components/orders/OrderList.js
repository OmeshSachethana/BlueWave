import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllOrders,
  updateApprovalStatus,
  updateDeliveryStatus,
} from "../../services/orderService";

const OrderList = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

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
    let filtered = [];
    if (filter === "All") {
      filtered = orders;
    } else if (filter === "Already Paid") {
      filtered = orders.filter((order) => order.paymentStatus === "Completed");
    } else if (filter === "Approved") {
      filtered = orders.filter(
        (order) =>
          order.approvalStatus === "Approved" &&
          order.paymentStatus !== "Completed"
      );
    } else {
      filtered = orders.filter((order) => order.approvalStatus === filter);
    }
    setFilteredOrders(filtered);
  }, [filter, orders]);

  const handleRejectClick = async (orderId) => {
    try {
      await updateApprovalStatus(orderId, "reject"); // Sending 'reject' to backend
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, approvalStatus: "Rejected" }
            : order
        )
      );
    } catch (err) {
      console.error("Error rejecting order:", err);
    }
  };

  const handleApproveClick = async (orderId) => {
    try {
      await updateApprovalStatus(orderId, "approve"); // Sending 'approve' to backend
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, approvalStatus: "Approved" }
            : order
        )
      );
    } catch (err) {
      console.error("Error approving order:", err);
    }
  };

  const handleShipClick = async (orderId) => {
    try {
      // Assume updateDeliveryStatus is a function that updates the delivery status to 'Shipped' in the backend
      await updateDeliveryStatus(orderId, "Shipped");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                delivery: { ...order.delivery, deliveryStatus: "Shipped" },
              }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating delivery status:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div className="container mx-auto flex min-h-screen">
      <aside className="w-1/4 p-4 bg-gray-50">
        <h3 className="font-bold text-xl mb-4">Filter by Status</h3>
        <ul>
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
              onClick={() => setFilter("Approved")}
              className={`block w-full text-left py-2 px-4 rounded ${
                filter === "Approved" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Approved
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("Rejected")}
              className={`block w-full text-left py-2 px-4 rounded ${
                filter === "Rejected" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Rejected
            </button>
          </li>
          <li>
            <button
              onClick={() => setFilter("Already Paid")}
              className={`mt-6 block w-full text-left py-2 px-4 rounded ${
                filter === "Already Paid" ? "bg-blue-200" : "bg-white"
              }`}
            >
              Already Paid
            </button>
          </li>
        </ul>
      </aside>

      <section className="w-3/4 p-4">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center mb-11">
            Customer Orders
          </h2>

          {filteredOrders.length === 0 ? (
            <p className="mt-4 font-normal text-lg leading-8 text-gray-600 mb-11 text-center">
              No orders found.
            </p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-[100%] mb-6 relative"
              >
                {/* Conditionally rendered buttons */}
                {order.paymentStatus !== "Completed" && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Show Already Shipped disabled button */}
                    {order.delivery.deliveryStatus === "Shipped" ? (
                      <button
                        class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-500 rounded-lg bg-gray-200 cursor-not-allowed"
                        disabled
                      >
                        <span class="relative px-5 py-2.5 bg-white rounded-md">
                          Already Shipped
                        </span>
                      </button>
                    ) : (
                      filter !== "Rejected" && (
                        <button
                          class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                          onClick={() => handleShipClick(order._id)}
                        >
                          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Ship
                          </span>
                        </button>
                      )
                    )}

                    {/* Show Reject button only if filter is not Rejected */}
                    {filter !== "Rejected" &&
                      order.delivery.deliveryStatus !== "Shipped" && (
                        <button
                          className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-300 to-red-500 group-hover:from-red-300 group-hover:to-red-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"
                          onClick={() => handleRejectClick(order._id)}
                        >
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Reject
                          </span>
                        </button>
                      )}

                    {/* Show Approve button only if filter is not Approved */}
                    {filter !== "Approved" && (
                      <button
                        className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-300 to-green-500 group-hover:from-green-300 group-hover:to-green-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        onClick={() => handleApproveClick(order._id)}
                      >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          Approve
                        </span>
                      </button>
                    )}
                  </div>
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
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                          hour12: false,
                        })}
                      </span>
                    </p>
                    <p className="font-semibold text-base leading-7 text-black mt-2">
                      Payment Method:{" "}
                      <span className="text-gray-400 font-medium">
                        {order.paymentMethod}
                      </span>
                    </p>
                  </div>
                </div>

                {order.orderDetails.map((item, index) => (
                  <div
                    key={index}
                    className="w-full px-3 min-[400px]:px-6 py-6 border-b border-gray-200 gap-6 flex flex-col lg:flex-row"
                  >
                    <div className="w-1/4">
                      <img
                        src={item.product.image || "default-image-url"}
                        alt={item.product.name || "Product Image"}
                        className="aspect-square w-full lg:max-w-[140px] rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex flex-row items-center w-full">
                      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                        <div className="flex items-center">
                          <div>
                            <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                              {item.product.name || "Product Name"}
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
                                  {item.product.category}
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
                              Rs.{item.product.price || 0}
                            </p>
                          </div>
                          <div className="flex gap-3 lg:block ml-6">
                            <p className="font-medium text-sm leading-7 text-black">
                              Delivery Status
                            </p>
                            <p
                              className={`font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 
                                ${
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
                              className={`font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 
                                ${
                                  order.approvalStatus === "Approved"
                                    ? "bg-emerald-50 text-emerald-600"
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
                    <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center flex-grow">
                      {order.paymentStatus === "Pending" ? (
                        order.paymentMethod === "Cash on Delivery" ? (
                          <span className="text-emerald-600">
                            Cash on Delivery
                          </span>
                        ) : (
                          <span className="text-red-600">Payment Pending</span>
                        )
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
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderList;
