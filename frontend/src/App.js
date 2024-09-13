import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import SpecialOffers from "./pages/SpecialOffers";
// import ContactUs from "./pages/ContactUs";
import Employee from "./pages/Employee";
// import CartView from "./products/CartView";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/products" element={<Products />} /> */}
        {/* <Route path="/special-offers" element={<SpecialOffers />} /> */}
        {/* <Route path="/contact-us" element={<ContactUs />} /> */}
        <Route path="/employee" element={<Employee />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
