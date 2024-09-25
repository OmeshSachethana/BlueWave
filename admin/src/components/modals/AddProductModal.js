import React, { useState, useRef, useEffect } from "react";
import { createProduct } from "../../services/productService";

const AddProductModal = ({ isOpen, toggleModal, fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 1,
    category: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const fileInputRef = useRef(null); // Create a ref for the file input

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent quantity from going negative
    if (name === "quantity" && value < 0) {
      return;
    }

    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage(""); // Reset success message

    // Prepare form data to send, including the image
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    formData.append("category", productData.category);
    formData.append("image", productData.image);

    try {
      await createProduct(formData); // Use the API function to create the product
      setSuccessMessage("Product added successfully!"); // Set success message
      setProductData({
        name: "",
        description: "",
        price: "",
        quantity: 1,
        category: "",
        image: null,
      }); // Clear form
      // Clear file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchProducts();
    } catch (error) {
      setErrorMessage("Failed to create product. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        {/* Success Message */}
        {!errorMessage && successMessage && (
          <div
            id="alert-3"
            className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Success</span>
            <div className="ms-3 text-sm font-medium">{successMessage}</div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
              aria-label="Close"
              onClick={() => setSuccessMessage("")}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Bottled Water 500ml"
              className="w-full p-2 border border-gray-300 rounded"
              value={productData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Premium bottled water"
              className="w-full p-2 border border-gray-300 rounded"
              value={productData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="5.99"
              className="w-full p-2 border border-gray-300 rounded"
              value={productData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="120"
              className="w-full p-2 border border-gray-300 rounded"
              value={productData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="Beverages"
              className="w-full p-2 border border-gray-300 rounded"
              value={productData.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="image">
              Product Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              ref={fileInputRef}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={toggleModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
