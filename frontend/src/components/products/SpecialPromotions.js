import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const SpecialPromotions = () => {
  const products = useSelector((state) => state.products.products);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Today Special...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.slice(6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SpecialPromotions;
