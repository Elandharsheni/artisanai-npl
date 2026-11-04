import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, subscribeToProducts } from "../services/marketplace";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    const unsubscribe = subscribeToProducts((items) => {
      setProducts(items);
      setError("");
    }, setConnected);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const goToCheckout = (product) => {
    localStorage.setItem("checkoutProduct", JSON.stringify(product));
    window.location.assign("/checkout");
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-heading">
        <h1 className="dashboard-title">🛍️ Artisan Products</h1>
        <span className={`live-status ${connected ? "connected" : ""}`}>
          <span /> {connected ? "Live updates on" : "Connecting to live updates..."}
        </span>
      </div>
      {error && <p className="marketplace-error" role="alert">{error}</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title or hashtag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
              <img
                src={product.image || "/pot.jpg"}
                alt={product.title}
                className="product-image"
                onError={(event) => { event.currentTarget.src = "/pot.jpg"; }}
              />
            </Link>
            <div className="product-content">
              <h2 className="product-title"><Link to={`/product/${product.id}`}>{product.title}</Link></h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price}</p>
              <p className="product-stock">
                {product.stock > 0 ? `${product.stock} available` : "Sold out"}
              </p>
              <div className="product-tags">
                {product.hashtags.map((tag, index) => (
                  <span key={index}>#{tag} </span>
                ))}
              </div>
              <button
                className="buy-button"
                onClick={() => goToCheckout(product)}
                disabled={!product.stock}
              >
                {product.stock ? "Buy Now 🛒" : "Sold out"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="no-products">❌ No products found.</p>
      )}
    </div>
  );
};

export default BuyerDashboard;
