import React from 'react';
import EmployeeList from './components/employee/EmployeeList';
import EmployeeForm from './components/employee/EmployeeForm';
import ProductList from './components/products/ProductList';
import SpecialPromotions from './components/products/SpecialPromotions';

function App() {
  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-500 text-white p-6 rounded mb-8">
        <h1 className="text-3xl">Summer Sale 15% OFF</h1>
      </header>

      <main>
        <section>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <ProductList />
        </section>

        <SpecialPromotions />
      </main>

      <footer className="mt-8">
        <p className="text-center text-gray-500">&copy; 2023 BlueWave</p>
      </footer>
    </div>
  );
}

export default App;

