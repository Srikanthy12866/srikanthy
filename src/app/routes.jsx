import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "../pages/home";
import { Products } from "../pages/products";
import { ContactUs } from "../pages/contact";
import { About } from "../pages/about";
import { Suggestion } from "../pages/suggestion";

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="s_c">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/portfolio" element={<Navigate to="/products" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/suggestion" element={<Suggestion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
