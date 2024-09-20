import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employee from "./pages/Employee";
import EmployeeSalaryForm from './pages/EmployeeSalaryForm';
import ProductList from "./components/products/ProductList";
import OrderList from "./components/orders/OrderList";
import AddMaintenance from "./components/maintenance/AddMaintenance";
import MaintenanceList from "./components/maintenance/maintenanceList";
import AdminSubscriptionPlans from "./components/subcriptionPlans/AdminSubscriptionPlans";
import SchedulePage from "./pages/Schedule/SchedulePage";
import IncomeExpenditurePage from "./pages/IncomeExpenditure/IncomeExpenditurePage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section>
                    <ProductList />
                  </section>
                </>
              }
            />
            <Route path="/employee" element={<Employee />} />
            <Route path="/payroll" element={<EmployeeSalaryForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/maintenance" element={<AddMaintenance />} />
            <Route path="/maintenancelist" element={<MaintenanceList />} />
            <Route path="/subscription-plans" element={<AdminSubscriptionPlans />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/income-expenditure" element={<IncomeExpenditurePage />} />
            
            
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
