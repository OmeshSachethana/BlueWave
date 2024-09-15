import { useState } from "react"; 
import { FaEdit, FaCheck, FaSave, FaTrash } from "react-icons/fa";
import { deleteProduct, updateProduct } from "../../services/productService"; 

const ProductCard = ({ product, fetchProducts, setDeleteSuccess }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    category: product.category,
    quantity: product.quantity,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [initialProduct, setInitialProduct] = useState(editedProduct);
  // const [deleteSuccess, setDeleteSuccess] = useState(false); // Success message state

  const handleEditClick = () => {
    if (isEditMode) {
      setEditedProduct(initialProduct);
      setSelectedFile(null);
    } else {
      setInitialProduct(editedProduct);
    }
    setIsEditMode(!isEditMode);
    setIsSaved(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedProduct((prevProduct) => ({
          ...prevProduct,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    try {
      await updateProduct(product._id, editedProduct, selectedFile);
      setIsSaved(true);
      setIsEditMode(false);
      setInitialProduct(editedProduct);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteProduct(product._id);
      fetchProducts();
      setDeleteSuccess(true); // Show success message
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div
        className={`flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl ${
          !isEditMode &&
          "hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
      >
        <div className="w-full h-80 md:w-72 md:h-auto md:rounded-none md:rounded-l-lg flex items-center justify-center">
          {isEditMode ? (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer relative bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-center"
              style={{
                backgroundImage: `url(${editedProduct.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white opacity-60 dark:bg-gray-900"></div>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <img
              className="object-cover w-full h-full md:w-72 md:h-auto rounded-t-lg md:rounded-none"
              src={editedProduct.image}
              alt={editedProduct.name}
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
                className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded p-2 w-full"
                placeholder="Product Name"
              />
              <input
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                className="mb-2 text-lg text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2 w-full"
                placeholder="Category"
              />
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
                className="mb-2 text-sm text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2 w-full"
                placeholder="Product Description"
              />
              <input
                type="number"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleInputChange}
                className="mb-2 text-sm text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2 w-full"
                placeholder="Quantity"
              />
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                className="mb-3 font-normal text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2 w-full"
                placeholder="Product Price"
              />
            </>
          ) : (
            <>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {editedProduct.name}
              </h5>
              <p className="mb-1 text-lg font-semibold text-gray-600 dark:text-gray-300">
                Category: {editedProduct.category}
              </p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {editedProduct.description}
              </p>
              <p className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                Quantity: {editedProduct.quantity}
              </p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
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
            {isSaved && (
              <FaCheck className="text-green-500 mr-2" />
            )}
            <FaEdit />
          </button>

          {!isEditMode && (
            <button
              onClick={handleDeleteClick}
              className="absolute bottom-2 right-12 p-2 bg-red-400 rounded-full text-white hover:bg-red-600"
            >
              <FaTrash />
            </button>
          )}
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
