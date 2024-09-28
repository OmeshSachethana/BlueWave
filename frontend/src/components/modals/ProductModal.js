import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/products/cartSlice";

const ProductModal = ({ product, isOpen, onClose, singleProduct }) => {
  const dispatch = useDispatch();
  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] h-[400px] overflow-y-auto">
        <section className="relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ fontSize: "30px" }}
          >
            &times;
          </button>
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">
              <div className="img">
                <div className="img-box h-full max-lg:mx-auto">
                  <img
                    className="max-lg:mx-auto lg:ml-auto h-full object-cover"
                    src={
                      product.image
                        ? product.image.startsWith("data:image")
                          ? product.image // If the image string already starts with "data:image"
                          : `data:image/jpeg;base64,${product.image}` // Prepend the base64 prefix if missing
                        : "https://via.placeholder.com/140" // Default placeholder if no image
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/140";
                    }}
                  />
                </div>
              </div>
              <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                <div className="data w-full max-w-xl">
                  <p className="text-lg font-medium leading-8 text-indigo-600 mb-4">
                    {product.category}
                  </p>
                  <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">
                    {product.name}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                    <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 mr-5">
                      Rs. {product.price.toFixed(2)}
                    </h6>
                  </div>
                  <p className="text-gray-500 text-base font-normal mb-5">
                    {product.description}
                  </p>
                  <button
                    type="button"
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      handleAddToCart();
                    }}
                  >
                    <svg
                      className="h-6 w-6 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H3m4 8v6m10-6v6m-6-6v6"
                      />
                    </svg>
                    &nbsp; Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductModal;
