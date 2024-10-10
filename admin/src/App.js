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
import ScheduleTable from "./components/schedule/ScheduleTable";
import PettyCashForm from "./components/pettyCash/PettyCashForm";
import PettyCashView from "./components/pettyCash/PettyCashView";
import IncomeExpenditureTable from "./components/incomeExpenditure/IncomeExpenditureTable";

function Footer() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Employee", path: "/employee" },
    { name: "Payroll", path: "/payroll" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <footer className="bg-blue-900 text-white py-6 mt-8 w-full px-0">
      <div className="text-center">
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
            </a>, 
            <a href="https://facebook.com" className="ml-1 hover:underline">
              Facebook
            </a>, and 
            <a href="https://instagram.com" className="ml-1 hover:underline">
              Instagram
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}


function App() {
  return (
    <Router>
      <Navbar />
      <div className="w-full p-0 m-0">
        <main className="w-full">
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
            <Route path="/schedulelist" element={<ScheduleTable />} />
            <Route path="/pettycash-form" element={<PettyCashForm />} />
            <Route path="/pettycash-view" element={<PettyCashView />} />
            <Route path="/in-exp-table" element={<IncomeExpenditureTable />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
