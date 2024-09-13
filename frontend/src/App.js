import React from "react";
import EmployeeList from "./components/employee/EmployeeList";
import EmployeeForm from "./components/employee/EmployeeForm";
import ProductList from "./components/products/ProductList";
import SpecialPromotions from "./components/products/SpecialPromotions";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
    <Navbar />
      <div className="container mx-auto p-4">
        <main>
          <section>
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            <ProductList />
          </section>

          <SpecialPromotions />
        </main>

        <footer className="mt-8">
          <p className="text-center text-gray-500">&copy; 2024 BlueWave</p>
        </footer>
      </div>
    </>
  );
}

export default App;
