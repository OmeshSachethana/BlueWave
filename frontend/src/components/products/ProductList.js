import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { setProducts } from "../../features/products/productsSlice";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../LoadingSpinner";

const ProductList = ({ filteredProducts, searchTerm }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      dispatch(setProducts(productsData));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 mt-6 relative">
      {/* Display search term if present */}
      {searchTerm && (
        <p className="text-gray-700 mb-4">
          Showing results for "<strong>{searchTerm}</strong>"
        </p>
      )}

      {/* Display the products based on filteredProducts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          filteredProducts
            .slice()
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
