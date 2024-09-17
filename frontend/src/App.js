import React from "react";
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

function App() {
  return (
    <Router>
      <Navbar />
      <MainContent />
      <footer className="mt-8">
        <p className="text-center text-gray-500">© 2024 BlueWave</p>
      </footer>
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && <Carousel />}

      <div className="container mx-auto p-4">
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-subscriptions" element={<SubPaymentPage />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/cards" element={<CardListPage />} />  {/* Add this route */}
            {/* Add other routes here as needed */}
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
