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

      {/* Display loading spinner while fetching */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : // Check if there are any filtered products
      filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.slice().map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        // If no products are found, show nothing
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-700">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
