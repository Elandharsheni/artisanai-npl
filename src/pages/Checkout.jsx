import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, placeOrder, subscribeToProducts } from "../services/marketplace";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let selected;
    try { selected = JSON.parse(localStorage.getItem("checkoutProduct")); }
    catch { setError("The selected piece could not be loaded. Please choose it again."); return undefined; }
    if (!selected) { setError("Choose a piece from the marketplace before checkout."); return undefined; }

    let active = true;
    const syncProduct = (items) => {
      const current = items.find((item) => String(item.id) === String(selected.id));
      if (!active) return;
      setProduct(current || null);
      setError(current ? "" : "This piece is no longer available.");
      setQuantity((value) => current ? Math.min(value, Math.max(current.stock, 1)) : value);
    };
    getProducts().then(syncProduct).catch((loadError) => { if (active) setError(loadError.message); });
    const unsubscribe = subscribeToProducts(syncProduct, setConnected);
    return () => { active = false; unsubscribe(); };
  }, []);

  const handleOrder = async (event) => {
    event.preventDefault();
    if (!product) return;
    setError("");
    setSubmitting(true);
    try {
      const order = await placeOrder(product.id, quantity, { name, address });
      localStorage.removeItem("checkoutProduct");
      navigate("/thank-you", { state: { order } });
    } catch (orderError) {
      setError(orderError.message);
      try {
        const current = (await getProducts()).find((item) => String(item.id) === String(product.id));
        if (current) setProduct(current);
      } catch { /* Keep the order error visible if inventory refresh is unavailable. */ }
    } finally { setSubmitting(false); }
  };

  if (!product) return <main className="min-h-[55vh] grid place-items-center p-6 text-center"><div><p role={error ? "alert" : undefined}>{error || "Loading your selected piece…"}</p>{error && <Link className="mt-4 inline-block text-[#a34d32]" to="/buyer">Browse the marketplace</Link>}</div></main>;

  const total = product.price * quantity;
  return (
    <main className="checkout-container" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="checkout-overlay" />
      <div className="checkout-wrapper">
        <section className="checkout-left">
          <img src={product.image || "/pot.jpg"} onError={(event) => { event.currentTarget.src = "/pot.jpg"; }} alt={product.title} className="checkout-image" />
          <h2 className="checkout-title">{product.title}</h2>
          <p className="checkout-price">₹{product.price} per piece · {product.stock} available</p>
          <p className="checkout-desc">{product.description}</p>
          <p className="checkout-live">{connected ? "● Inventory is updating live" : "Checking live inventory…"}</p>
        </section>
        <section className="checkout-form-container">
          <h1 className="checkout-form-title">Delivery details</h1>
          <form onSubmit={handleOrder} className="checkout-form">
            <div className="checkout-form-group"><label className="checkout-label" htmlFor="buyer-name">Full name</label><input id="buyer-name" className="checkout-input" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={120} placeholder="Your name" required /></div>
            <div className="checkout-form-group"><label className="checkout-label" htmlFor="delivery-address">Delivery address</label><textarea id="delivery-address" className="checkout-textarea" value={address} onChange={(event) => setAddress(event.target.value)} autoComplete="street-address" maxLength={500} rows={3} placeholder="Street, city, state and postal code" required /></div>
            <div className="checkout-form-group"><label className="checkout-label" htmlFor="order-quantity">Quantity</label><input id="order-quantity" type="number" className="checkout-input" value={quantity} min="1" max={product.stock} onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} required /></div>
            <div className="checkout-total">Order total: ₹{total}</div>
            {error && <p role="alert" className="checkout-error">{error}</p>}
            <button type="submit" className="checkout-button" disabled={submitting || product.stock < 1 || quantity > product.stock}>{product.stock < 1 ? "Sold out" : submitting ? "Confirming order…" : "Place order"}</button>
            <p className="checkout-disclaimer">This demo records your order and reserves available stock. No payment is collected.</p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Checkout;
