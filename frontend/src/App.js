import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./components/products/ProductList";
import OrderList from "./components/orders/OrderList";
import PaymentPage from "./components/orders/PaymentPage";
import SubPaymentPage from "./components/subcriptionPlans/PaymentPage";
import SubscriptionPlans from "./components/subcriptionPlans/SubscriptionPlans";
import Carousel from "./components/Carousel";
import CardListPage from "./components/orders/CardListPage";
import { getAllProducts, searchProducts } from "./services/productService";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products based on the search term or get all products on initial load
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        if (!searchTerm) {
          // Fetch all products if no search term is provided
          const products = await getAllProducts();
          setFilteredProducts(products); // Update filtered products with all products
        } else {
          // Fetch filtered products based on search term
          const searchResults = await searchProducts({ name: searchTerm });
          setFilteredProducts(searchResults); // Update filtered products with search results
        }
      } catch (error) {
        console.error("Error fetching or searching products:", error);
      }
    };

    // Call the function to fetch products
    fetchInitialProducts();
  }, [searchTerm]); // This runs whenever the searchTerm changes or on the first load

  // Handle search from Navbar
  const handleSearch = (term) => {
    setSearchTerm(term); // Update searchTerm state to trigger the useEffect above
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <MainContent
        searchTerm={searchTerm}
        filteredProducts={filteredProducts}
      />
      <footer className="mt-8">
        <p className="text-center text-gray-500">© 2024 BlueWave</p>
      </footer>
    </Router>
  );
}

function MainContent({ searchTerm, filteredProducts }) {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Carousel />}

      <div className="container mx-auto p-4">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  searchTerm={searchTerm}
                  filteredProducts={filteredProducts}
                />
              }
            />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-subscriptions" element={<SubPaymentPage />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/cards" element={<CardListPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
