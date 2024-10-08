import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { getAllOrders } from "../../services/orderService"; // Make sure to create this service
import { setProducts } from "../../features/products/productsSlice";
import LoadingSpinner from "../LoadingSpinner";
import ProductCard from "./ProductCard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../../assets/bluewave_logo.png'; 

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [orders, setOrders] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();

      // Sort products by updatedAt in descending order
      const sortedProducts = productsData.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      dispatch(setProducts(sortedProducts));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
      return ordersData;
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const generateReport = async () => {
    // Fetch the latest orders before generating the PDF
    const latestOrders = await fetchOrders();

    const doc = new jsPDF();

    // Logo properties
    const logoWidth = 50; // Width of the logo
    const logoHeight = 20; // Height of the logo

    // Centering the logo
    const pageWidth = doc.internal.pageSize.getWidth(); // Get PDF page width
    const logoX = (pageWidth - logoWidth) / 2; // Calculate x position for centering

    // Add logo
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight); // Use calculated x position

    // Add title
    doc.setFontSize(16);

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    // Add date of report generation
    doc.setFontSize(12);
    doc.text(`Report generated on: ${formattedDate}`, 14, 50);

    // Aggregate order data using latestOrders (instead of state orders)
    const orderSummary = products.map((product) => {
      const orderCount = latestOrders.reduce((count, order) => {
        return (
          count +
          order.orderDetails.filter(
            (item) =>
              item.product &&
              item.product._id.toString() === product._id.toString()
          ).length
        );
      }, 0);
      return {
        productName: product.name || "Unknown Product",
        category: product.category || "N/A",
        quantity: product.quantity || "N/A",
        description: product.description || "N/A",
        orderCount,
      };
    });

    // Handle cases where a product is in an order but not in the products list (deleted product)
    latestOrders.forEach((order) => {
      order.orderDetails.forEach((item) => {
        const productExists = products.some(
          (product) => product._id.toString() === item.product?._id?.toString()
        );
        if (!productExists && item.product) {
          orderSummary.push({
            productName: "Unknown Product",
            category: "N/A",
            quantity: "N/A",
            description: "This product was deleted",
            orderCount: 1, // Counting this as one order for the deleted product
          });
        }
      });
    });

    // Add title to the document
    doc.setFontSize(16);
    doc.text('Products Report', 14, 40);
    doc.autoTable({
      head: [
        ["Product Name", "Category", "Quantity", "Description", "Order Count"],
      ],
      body: orderSummary.map((item) => [
        item.productName,
        item.category,
        item.quantity,
        item.description,
        item.orderCount,
      ]),
      startY: 60,
    });

    // Save the PDF
    doc.save("ProductsReport.pdf");
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000); // Hide the success message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [dispatch, deleteSuccess]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={generateReport}
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700"
        >
          Generate Report
        </button>
      </div>
      {/* Success Alert at the Top of the Page */}
      {deleteSuccess && (
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-4 text-center"
          role="alert"
        >
          <div className="flex justify-center">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Product Deleted Successfully</p>
            </div>
          </div>
        </div>
      )}
      {/* Show Loading Spinner while fetching data */}
      {loading ? (
        <div className="flex justify-center items-center h-64 relative">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                fetchProducts={fetchProducts}
                setDeleteSuccess={setDeleteSuccess}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
