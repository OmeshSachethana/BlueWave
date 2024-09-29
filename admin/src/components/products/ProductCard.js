import { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaSave, FaTrash } from "react-icons/fa";
import { deleteProduct, updateProduct } from "../../services/productService";

const ProductCard = ({ product, fetchProducts, setDeleteSuccess }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [selectedFile, setSelectedFile] = useState(null);
  const [initialProduct, setInitialProduct] = useState(product);
  const [imagePreview, setImagePreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const maxWords = 50;

  // Function to count words
  const countWords = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  useEffect(() => {
    setEditedProduct(product);
    setInitialProduct(product);
  }, [product]);

  const handleEditClick = () => {
    if (isEditMode) {
      setEditedProduct(initialProduct);
      setSelectedFile(null);
      setImagePreview(null);
    } else {
      setInitialProduct(editedProduct);
    }
    setIsEditMode(!isEditMode);
    setIsSaved(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const wordsUsed = countWords(value);

      // Only update if words used are within the limit
      if (wordsUsed <= maxWords) {
        setEditedProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value,
        }));
      }
      // If words exceed limit, do not update the state
    } else {
      // For other fields, handle as usual
      const updatedValue =
        name === "price" || name === "quantity" ? parseFloat(value) : value;

      if (name === "quantity" && value < 0) return; // Prevent negative quantity

      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        [name]: updatedValue,
      }));
    }

    // Clear errors for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!file) {
      setErrorMessage("No file selected. Please upload an image."); // Error for empty file
      return;
    }

    if (!validImageTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a JPEG or PNG image."); // Error for invalid file type
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setSelectedFile(base64String); // Set the base64 image string to the state
      setImagePreview(base64String); // Use the base64 image string for preview
      setErrorMessage(""); // Clear error message if file is valid
    };

    reader.readAsDataURL(file); // Convert image to base64
  };

  const validateInputs = () => {
    const newErrors = {};

    // Only validate image if neither a new file is selected nor an existing image is present
    if (!selectedFile && !editedProduct.image) {
      newErrors.image = "Image file is required.";
    }

    if (!editedProduct.name || editedProduct.name.length > 50) {
      newErrors.name = "Product Name must be 1-50 characters long.";
    }

    if (
      !editedProduct.category ||
      !/^[a-zA-Z\s]{1,30}$/.test(editedProduct.category)
    ) {
      newErrors.category = "Category must be 1-30 letters and spaces only.";
    }

    if (!editedProduct.description || editedProduct.description.length > 500) {
      newErrors.description = "Description must be up to 500 characters.";
    }

    if (!editedProduct.quantity || editedProduct.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    if (!editedProduct.price || editedProduct.price < 0.01) {
      newErrors.price = "Price must be a positive value.";
    }

    return newErrors;
  };

  const handleSaveClick = async () => {
    const validationErrors = validateInputs(); // Validate all inputs, including image upload

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the validation errors
      return; // Stop the save process if there are validation errors
    }

    try {
      const updatedProductData = { ...editedProduct }; // Create a copy of the edited product

      // If there's a selected file (base64 image), add it to the updated product
      if (selectedFile) {
        updatedProductData.image = selectedFile; // Add base64 image to product data
      }

      const updatedProduct = await updateProduct(
        product._id,
        updatedProductData
      );

      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        ...updatedProduct,
        price: updatedProduct.price ?? prevProduct.price,
        quantity: updatedProduct.quantity ?? prevProduct.quantity,
        image: updatedProduct.image ?? prevProduct.image,
      }));

      setIsSaved(true);
      setIsEditMode(false);
      setSelectedFile(null);
      setImagePreview(null);

      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({ submit: "Failed to update the product. Please try again." });
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(product._id);
      fetchProducts();
      setDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div
        className={`flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl ${
          !isEditMode && "hover:bg-gray-100"
        }`}
      >
        <div className="w-full h-80 md:w-72 md:h-auto md:rounded-none md:rounded-l-lg flex items-center justify-center">
          {isEditMode ? (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-[200px] h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer relative bg-gray-50 hover:bg-gray-100 text-center"
              style={{
                backgroundImage: `url(${
                  imagePreview ||
                  (editedProduct.image.startsWith("data:image")
                    ? editedProduct.image
                    : `data:image/jpeg;base64,${editedProduct.image}`)
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white opacity-60"></div>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, or JPG (MAX. 800x400px)
                </p>
                {errorMessage && (
                  <p className="text-red-500 text-xs">{errorMessage}</p>
                )}{" "}
                {/* Display error message */}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept=".jpg, .jpeg, .png"
              />
            </label>
          ) : (
            <img
              className="object-cover w-full h-full md:w-72 md:h-auto rounded-t-lg md:rounded-none"
              key={editedProduct.image} // Use image URL as key to force re-render
              src={
                editedProduct.image
                  ? editedProduct.image.startsWith("data:image")
                    ? editedProduct.image // If the image string already starts with "data:image"
                    : `data:image/jpeg;base64,${editedProduct.image}` // Prepend the base64 prefix if missing
                  : "https://via.placeholder.com/140" // Default placeholder if no image
              }
              alt={editedProduct.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/140";
              }}
            />
          )}
        </div>

        <div className="flex flex-col justify-between p-4 leading-normal w-full relative">
          {isEditMode ? (
            <>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                className="mb-2 text-xl font-bold tracking-tight text-gray-900 bg-gray-100 rounded p-2 w-full"
                placeholder="Product Name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
              <input
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                className="mb-2 text-lg text-gray-700 bg-gray-100 rounded p-2 w-full"
                placeholder="Category"
                required
              />
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
                className="mb-2 text-sm text-gray-700 bg-gray-100 rounded p-2 w-full"
                placeholder="Product Description"
                maxLength={500} // Max length of 500 characters
                required
              />
              <p className="text-sm text-gray-500 mb-2">
                {maxWords - countWords(editedProduct.description)} words
                remaining
              </p>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <input
                type="number"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleInputChange}
                className="mb-2 text-sm text-gray-700 bg-gray-100 rounded p-2 w-full"
                placeholder="Quantity"
                min="1"
                max="1000"
                required
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                className="mb-3 font-normal text-gray-700 bg-gray-100 rounded p-2 w-full"
                placeholder="Product Price"
                min="0"
                step="1"
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </>
          ) : (
            <>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                {editedProduct.name}
              </h5>
              <p className="mb-1 text-lg font-semibold text-gray-600">
                Category: {editedProduct.category}
              </p>
              <p className="mb-3 font-normal text-gray-700">
                {editedProduct.description}
              </p>
              <p className="mb-1 text-sm font-semibold text-gray-600">
                Quantity: {editedProduct.quantity}
              </p>
              <p className="mb-3 font-normal text-gray-700">
                Rs: {editedProduct.price.toFixed(2)}
              </p>
            </>
          )}
          {isEditMode && (
            <button
              onClick={handleSaveClick}
              className="absolute bottom-2 right-12 p-2 bg-green-500 rounded-full text-white hover:bg-green-600"
            >
              <FaSave />
            </button>
          )}
          <button
            onClick={handleEditClick}
            className="absolute bottom-2 right-2 p-2 bg-yellow-200 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-300 flex items-center"
          >
            {isSaved && <FaCheck className="text-green-500 mr-2" />}
            <FaEdit />
          </button>
          {!isEditMode && (
            <>
              <button
                onClick={handleDeleteClick}
                className={`absolute bottom-2 ${
                  isSaved ? "right-20" : "right-12"
                } p-2 bg-red-400 rounded-full text-white hover:bg-red-600 transition-all duration-300`}
              >
                <FaTrash />
              </button>
              {/* Confirmation Modal */}
              {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 className="text-lg font-semibold mb-4">
                      Confirm Delete
                    </h3>
                    <p className="mb-4">
                      Are you sure you want to delete this product?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
