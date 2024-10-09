import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../services/productService";
import { setProducts } from "../../features/products/productsSlice";
import ProductCard from "./ProductCard";
import LoadingSpinner from "../LoadingSpinner";
import Filters from "./Filters";

const ProductList = ({ filteredProducts, searchTerm }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // To store categories for filtering
  const [selectedCategory, setSelectedCategory] = useState(""); // To store the selected category
  const [priceRange, setPriceRange] = useState(10000); // Default price range

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      dispatch(setProducts(productsData));

      // Extract unique categories from the product list for filtering
      const uniqueCategories = [
        ...new Set(productsData.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  // Filter products based on selected filters
  const filteredByCategory = selectedCategory
    ? filteredProducts.filter((p) => p.category === selectedCategory)
    : filteredProducts;

  const filteredByPrice = filteredByCategory.filter(
    (p) => p.price <= priceRange
  );

  return (
    <div className="container mx-auto mt-6 relative flex">
      {/* Filters Sidebar */}
      <div className="w-1/4">
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>

      {/* Product List */}
      <div className="w-3/4 ml-4">
        {searchTerm && (
          <p className="text-gray-700 mb-4">
            Showing results for "<strong>{searchTerm}</strong>"
          </p>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : filteredByPrice.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredByPrice.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-700">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
