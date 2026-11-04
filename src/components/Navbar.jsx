import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isSeller = location.pathname.includes("/seller") || location.pathname.includes("/add");

  return (
    <nav className={`navbar ${isHome ? "navbar-home" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-title">ARTISAN<span>AI</span></Link>
        <div className="nav-links">
          <NavLink to="/buyer" className={({ isActive }) => `nav-link ${isActive ? "nav-active" : ""}`}>Discover</NavLink>
          <NavLink to="/seller" className={({ isActive }) => `nav-link ${isActive && isSeller ? "nav-active" : ""}`}>For makers</NavLink>
          {isSeller && <Link to="/add" className="nav-link add-product">+ Add a piece</Link>}
        </div>
        <div className="nav-right"><Link to="/signin" className="nav-signin">Sign in <span>↗</span></Link></div>
      </div>
    </nav>
  );
};

export default Navbar;
