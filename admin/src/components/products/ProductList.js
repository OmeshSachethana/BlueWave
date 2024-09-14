import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const products = useSelector((state) => state.products.products);

  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-500 text-white p-6 rounded mb-8">
        <h1 className="text-3xl">Summer Sale 15% OFF</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
