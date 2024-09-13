import React, { useState } from 'react';
import { createProduct } from '../../services/productService';

const AddProductModal = ({ isOpen, toggleModal }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Prepare form data to send, including the image
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity);
    formData.append('category', productData.category);
    formData.append('image', productData.image);

    try {
      await createProduct(formData); // Use the API function to create the product
      toggleModal(); // Close modal on success
    } catch (error) {
      setErrorMessage('Failed to create product. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
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
            <label className="block text-sm font-medium mb-1" htmlFor="description">
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
            <label className="block text-sm font-medium mb-1" htmlFor="quantity">
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
            <label className="block text-sm font-medium mb-1" htmlFor="category">
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
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
