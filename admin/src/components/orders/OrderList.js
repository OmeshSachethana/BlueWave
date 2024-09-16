import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllOrders, deleteOrder } from "../../services/orderService";

const OrderList = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
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
    if (filter === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.approvalStatus === filter)
      );
    }
  }, [filter, orders]);

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
      // Optionally, show an error message to the user
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

  const handleRejectClick = (orderId) => {
    // Implement the reject functionality here
    console.log(`Reject order with ID: ${orderId}`);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div className="container mx-auto flex min-h-screen">
      {/* Sidebar for filters */}
      <aside className="w-1/4 p-4 bg-gray-50">
        <h3 className="font-bold text-xl mb-4">Filter by Approval Status</h3>
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
        </ul>
      </aside>

      {/* Main content */}
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
                {/* Conditionally rendered "Reject" button */}
                {order.paymentStatus !== "Completed" && (
                  <button
                    className="absolute top-4 right-4 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-300 to-red-500 group-hover:from-red-300 group-hover:to-red-500 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-red-800"
                    onClick={() => handleRejectClick(order._id)}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Reject
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
                    className="w-full px-3 min-[400px]:px-6 py-6 border-b border-gray-200 gap-6 flex flex-col lg:flex-row items-center"
                  >
                    <div className="img-box max-lg:w-full">
                      <img
                        src={
                          item.product.image
                            ? `http://localhost:5000${item.product.image}`
                            : "https://via.placeholder.com/140"
                        }
                        alt={item.product.name || "Product image"}
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
                                  order.delivery.deliveryStatus === "Delivered"
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
                    <span className="text-indigo-600">Rs.{order.totalPrice}</span>
                  </p>
                </div>
              </div>
            ))
          )}

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

