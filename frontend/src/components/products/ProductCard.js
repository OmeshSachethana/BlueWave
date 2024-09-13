import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/products/productsSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="border p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">{product.name}</h2>
      <p className="text-xl mb-2">Rs:{product.price.toFixed(2)}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
