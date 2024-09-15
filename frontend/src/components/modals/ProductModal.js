import React from "react";

const ProductModal = ({ product, isOpen, onClose, singleProduct }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

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
                    src={`http://localhost:5000${product.image}`}
                    alt="Yellow Tropical Printed Shirt image"
                    className="max-lg:mx-auto lg:ml-auto h-full object-cover"
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
