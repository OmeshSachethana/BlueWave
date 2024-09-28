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
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const maxWords = 50;

  // Function to count words
  const countWords = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const fileInputRef = useRef(null); // Ref for the file input

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setSuccessMessage("");
      setErrors({}); // Clear errors when modal opens
    } else {
      // Reset product data when modal closes
      setProductData({
        name: "",
        description: "",
        price: "",
        quantity: 1,
        category: "",
        image: null,
      });
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z0-9\s]{1,50}$/.test(value)) {
          error =
            "Product Name must be 1-50 characters, alphanumeric and spaces only.";
        }
        break;
      case "price":
        if (value <= 0) {
          error = "Price must be greater than 0.";
        }
        break;
      case "quantity":
        if (value < 1 || value > 1000) {
          error = "Quantity must be between 1 and 1000.";
        }
        break;
      case "category":
        if (!/^[a-zA-Z\s]{1,30}$/.test(value)) {
          error = "Category must be 1-30 letters and spaces only.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate field as user types
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });

    // Prevent quantity from going negative
    if (name === "quantity" && value < 0) {
      return;
    }

    if (name === "description") {
      const wordsUsed = countWords(value);
      // If words are less than or equal to the max limit, update formData
      if (wordsUsed <= maxWords) {
        setProductData({ ...productData, [name]: value });
      }
    } else {
      // For other fields, update the form data normally
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!file) {
      setErrors({ ...errors, image: "Please upload a valid image." });
    } else if (!validImageTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: "Invalid file type. Please upload a JPEG or PNG image.",
      });
    } else {
      setErrors({ ...errors, image: "" });
      setProductData({ ...productData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Final validation on submit
    let hasError = false;
    const newErrors = {};

    for (const field in productData) {
      const error = validateField(field, productData[field]);
      if (error) {
        hasError = true;
        newErrors[field] = error;
      }
    }

    if (errors.image) {
      hasError = true;
      newErrors.image = errors.image;
    }

    setErrors(newErrors);
    if (hasError) {
      setIsSubmitting(false);
      return;
    }

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
      setSuccessMessage("Product added successfully!");
      setProductData({
        name: "",
        description: "",
        price: "",
        quantity: 1,
        category: "",
        image: null,
      });
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
              className={`w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded`}
              value={productData.name}
              onChange={handleInputChange}
              required
              pattern="^[a-zA-Z0-9\s]{1,50}$" // Alphanumeric and spaces only, 1-50 characters
              title="Product Name: 1-50 characters, alphanumeric and spaces only."
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
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
              maxLength={500} // Max length of 500 characters
              title="Description: Up to 50 words."
            />
            <p className="text-sm text-gray-500">
              {maxWords - countWords(productData.description)} words remaining
            </p>
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
              className={`w-full p-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded`}
              value={productData.price}
              onChange={handleInputChange}
              required
              min="0.01"
              title="Price must be a positive number."
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
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
              className={`w-full p-2 border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded`}
              value={productData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              max="1000"
              title="Quantity must be between 1 and 1000."
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
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
              className={`w-full p-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded`}
              value={productData.category}
              onChange={handleInputChange}
              required
              pattern="^[a-zA-Z\s]{1,30}$" // Letters and spaces only, 1-30 characters
              title="Category: 1-30 letters and spaces only."
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
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
              className={`w-full p-2 border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } rounded`}
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
              required
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
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
