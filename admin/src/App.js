import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employee from "./pages/Employee";
<<<<<<< HEAD
import EmployeeSalaryForm from './pages/EmployeeSalaryForm';
=======
import ProductList from "./components/products/ProductList";
import SpecialPromotions from "./components/products/SpecialPromotions";
>>>>>>> 97e8ae352d6a6e3751bd9e6c26d51c180ed26bd7

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
                  <SpecialPromotions />
                </>
              }
            />
            <Route path="/employee" element={<Employee />} />
            <Route path="/payroll" element={<EmployeeSalaryForm />} />
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
