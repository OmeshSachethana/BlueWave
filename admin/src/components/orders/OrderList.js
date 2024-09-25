import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllOrders,
  updateApprovalStatus,
  updateDeliveryStatus,
} from "../../services/orderService";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const generateReport = () => {
    const doc = new jsPDF();

    // Add title to the document
    doc.text("Customer Orders Report", 14, 16);

    // Prepare the data for the table
    const orderData = filteredOrders.map((order) => ({
      orderId: order._id,
      orderDate: new Date(order.createdAt).toLocaleString("en-GB", {
        hour12: false,
      }),
      paymentMethod: order.paymentMethod,
      userName: order.user.name,
      deliveryLocation: order.delivery.deliveryLocationName,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.delivery.deliveryStatus,
      approvalStatus: order.approvalStatus,
      products: order.orderDetails
        .map((item) => `${item.product.name} (Qty: ${item.quantity})`)
        .join(", "),
    }));

    // Use autoTable to add the order data
    doc.autoTable({
      head: [
        [
          "Order ID",
          "Order Date",
          "Payment Method",
          "Customer Name",
          "Delivery Location",
          "Total Price",
          "Payment Status",
          "Delivery Status",
          "Approval Status",
          "Products",
        ],
      ],
      body: orderData.map((item) => [
        item.orderId,
        item.orderDate,
        item.paymentMethod,
        item.userName,
        item.deliveryLocation,
        item.totalPrice,
        item.paymentStatus,
        item.deliveryStatus,
        item.approvalStatus,
        item.products,
      ]),
      startY: 30,
    });

    // Save the PDF
    doc.save("CustomerOrdersReport.pdf");
  };

  // Sort filteredOrders by updatedAt in descending order
  const sortedOrders = filteredOrders.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt); // Sort by updatedAt in descending order
  });

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div className="container mx-auto flex min-h-screen">
      {/* Sidebar for filters with sticky positioning */}
      <aside
        id="filter-sidebar"
        className="fixed z-50 top-39 left-10 flex flex-col justify-between w-1/4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
      >
        <div className="flex flex-col items-start mb-3 md:items-start md:mb-0">
          <h3 className="font-bold text-xl mb-4 text-gray-900">
            Filter by Status
          </h3>
          <ul className="space-y-2 w-full">
            {" "}
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
        </div>
      </aside>

      <section className="w-3/4 p-4 ml-[calc(25%+1rem)]">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-11">
            <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
              Customer Orders
            </h2>
            <button
              onClick={generateReport}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Generate Report
            </button>
          </div>

          {filteredOrders.length === 0 ? (
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
                  {/* Conditionally rendered buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Show Ship button if paymentMethod is Cash on Delivery, regardless of paymentStatus, and approvalStatus is Approved */}
                    {(order.paymentMethod === "Cash on Delivery" ||
                      (order.paymentStatus !== "Pending" &&
                        order.paymentMethod === "Card Payment")) &&
                      order.approvalStatus === "Approved" && (
                        <>
                          {/* Show Already Shipped disabled button */}
                          {order.delivery.deliveryStatus === "Shipped" ? (
                            <button
                              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-500 rounded-lg bg-gray-200 cursor-not-allowed"
                              disabled
                            >
                              <span className="relative px-5 py-2.5 bg-white rounded-md">
                                Already Shipped
                              </span>
                            </button>
                          ) : (
                            <button
                              className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg focus:ring-4 focus:outline-none ${
                                order.delivery.deliveryStatus === "Shipped"
                                  ? "text-gray-500 bg-gray-200 cursor-not-allowed focus:ring-gray-200"
                                  : "text-gray-900 bg-gradient-to-br from-cyan-500 to-blue-500 group hover:text-white focus:ring-cyan-200"
                              }`}
                              onClick={() => handleShipClick(order._id)}
                              disabled={
                                order.delivery.deliveryStatus === "Shipped" ||
                                isOrderDisabled
                              }
                            >
                              <span
                                className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${
                                  order.delivery.deliveryStatus === "Shipped" ||
                                  isOrderDisabled
                                    ? "bg-white"
                                    : "bg-white group-hover:bg-opacity-0"
                                }`}
                              >
                                Ship
                              </span>
                            </button>
                          )}
                        </>
                      )}

                    {/* Show Reject button only if payment is not Completed */}
                    {(order.paymentMethod === "Cash on Delivery" ||
                      order.paymentStatus !== "Completed") &&
                      order.approvalStatus !== "Rejected" &&
                      order.delivery.deliveryStatus !== "Shipped" && (
                        <button
                          className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-300 to-red-500 group-hover:from-red-300 group-hover:to-red-500 focus:ring-4 focus:outline-none focus:ring-red-200"
                          onClick={() => handleRejectClick(order._id)}
                          disabled={isOrderDisabled} // Disable reject if order is unavailable
                        >
                          <span
                            className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${
                              isOrderDisabled
                                ? "bg-white"
                                : "bg-white group-hover:bg-opacity-0"
                            }`}
                          >
                            Reject
                          </span>
                        </button>
                      )}

                    {/* Show Approve button only if approvalStatus is not Approved */}
                    {order.approvalStatus !== "Approved" && (
                      <button
                        className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-300 to-green-500 group-hover:from-green-300 group-hover:to-green-500 focus:ring-4 focus:outline-none focus:ring-green-200"
                        onClick={() => handleApproveClick(order._id)}
                        disabled={isOrderDisabled} // Disable approve if order is unavailable
                      >
                        <span
                          className={`relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md ${
                            isOrderDisabled
                              ? "bg-white"
                              : "bg-white group-hover:bg-opacity-0"
                          }`}
                        >
                          Approve
                        </span>
                      </button>
                    )}
                  </div>

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
                          </span>
                        </p>
                        <p className="font-semibold text-base leading-7 text-black">
                          Shipping Address:{" "}
                          <span className="text-gray-400 font-medium">
                            {order.delivery.deliveryLocationName}{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.orderDetails.map((item, index) => (
                    <div
                      key={index}
                      className="w-full px-3 min-[400px]:px-6 py-6 border-b border-gray-200 gap-6 flex flex-col lg:flex-row"
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
                                Rs.{item.product ? item.product.price || 0 : 0}
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
                      <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center flex-grow">
                        {order.paymentMethod === "Cash on Delivery" ? (
                          <span className="text-emerald-600">
                            Cash on Delivery
                          </span>
                        ) : order.paymentStatus === "Pending" ? (
                          <span className="text-red-600">Payment Pending</span>
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
      </section>
    </div>
  );
};

export default OrderList;
