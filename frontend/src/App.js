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

function Footer() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Payment", path: "/payment" },
    { name: "Subscription Plans", path: "/subscription-plans" },
  ];

  return (
    <footer className="bg-blue-900 text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h5 className="font-bold text-lg">Quick Links</h5>
          <ul className="flex justify-center space-x-6">
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.path} className="hover:underline">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-gray-400">
          <p>© 2024 BlueWave | All rights reserved.</p>
          <p>
            Follow us on
            <a href="https://twitter.com" className="ml-1 hover:underline">
              Twitter
            </a>
            ,
            <a href="https://facebook.com" className="ml-1 hover:underline">
              Facebook
            </a>
            , and
            <a href="https://instagram.com" className="ml-1 hover:underline">
              Instagram
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        let products;
        if (!searchTerm) {
          products = await getAllProducts();
        } else {
          products = await searchProducts({ name: searchTerm });
        }

        // Sort the products by updatedAt in descending order
        const sortedProducts = products.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching or searching products:", error);
      }
    };

    fetchInitialProducts();
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <MainContent
        searchTerm={searchTerm}
        filteredProducts={filteredProducts}
      />
      <Footer />
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
