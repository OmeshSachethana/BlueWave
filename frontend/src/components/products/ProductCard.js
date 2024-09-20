import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/products/cartSlice";
import ProductModal from "../modals/ProductModal"; // Import the modal component

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [singleProduct, setProduct] = useState({}); // State for storing the product details

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const openModal = (e) => {
    e.preventDefault(); // Prevent the link from navigating away
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Trigger modal by clicking the product card */}
      <a
        href="#"
        onClick={openModal}
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100"
      >
        <img
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700">
            Rs: {product.price.toFixed(2)}
          </p>
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
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
            &nbsp;
            Add to Cart
          </button>
        </div>
      </a>

      {/* Modal */}
      <ProductModal product={product} isOpen={isModalOpen} onClose={closeModal} singleProduct={singleProduct} />
    </>
  );
};

export default ProductCard;
