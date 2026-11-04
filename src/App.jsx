import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./components/AddProduct";
import BuyerDashboard from "./pages/BuyerDashboard";
import Navbar from "./components/Navbar";
import ThankYou from "./pages/ThankYou";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails"; // View product page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
