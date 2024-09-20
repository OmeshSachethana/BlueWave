import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { setProducts } from "../../features/products/productsSlice";
import ProductCard from "./ProductCard";

const ProductList = ({ filteredProducts, searchTerm }) => {
  const dispatch = useDispatch();
  // const products = useSelector((state) => state.products.products);

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      dispatch(setProducts(productsData));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 mt-6">
      {/* Display search term if present */}
      {searchTerm && (
        <p className="text-gray-700 mb-4">
          Showing results for "<strong>{searchTerm}</strong>"
        </p>
      )}

      {/* Display the products based on filteredProducts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.slice(0, 6).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
