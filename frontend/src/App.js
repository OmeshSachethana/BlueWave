import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employee from "./pages/Employee";
import ProductList from "./components/products/ProductList";
import OrderList from "./components/orders/OrderList";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <main>
          <Routes>
            <Route
              path="/products"
              element={
                <>
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Products</h2>
                    <ProductList />
                  </section>
                </>
              }
            />
            <Route path="/employee" element={<Employee />} />
            <Route path="/orders" element={<OrderList />} />
            {/* Add other routes here as needed */}
          </Routes>
        </main>

        <footer className="mt-8">
          <p className="text-center text-gray-500">© 2024 BlueWave</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
