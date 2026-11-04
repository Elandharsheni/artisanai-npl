import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRightIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getProducts, subscribeToProducts } from "../services/marketplace";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;
    getProducts().then((items) => { if (active) setProducts(items); }).catch(() => {});
    const unsubscribe = subscribeToProducts((items) => setProducts(items), setConnected);
    return () => { active = false; unsubscribe(); };
  }, []);

  const featured = products.slice(0, 3);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="eyebrow-dot" /> A marketplace for things made with heart</div>
          <h1>Made by hand.<br /><span>Found by you.</span></h1>
          <p className="hero-description">Discover thoughtful pieces from independent makers, or bring your own craft to a community that cares.</p>
          <div className="hero-actions">
            <Link to="/buyer" className="hero-button hero-button-primary">Explore the marketplace <ArrowRightIcon /></Link>
            <Link to="/seller" className="hero-button hero-button-secondary">I’m a maker <ArrowDownRightIcon /></Link>
          </div>
          <div className="hero-note"><SparklesIcon /> Small batches, real people, one-of-a-kind finds.</div>
        </div>
        <div className="hero-art" aria-label="Handcrafted ceramic vase and artisan decor">
          <div className="art-image-main"><img src="/vase1.jpg" alt="Handcrafted ceramic vase" /></div>
          <div className="art-image-small"><img src="/basket1.jpg" alt="Woven artisan basket" /></div>
          <div className="art-stamp"><span>THE<br />MAKER’S<br />MARKET</span><span className="stamp-star">✳</span></div>
          <div className="art-caption"><span>01 / OBJECTS WITH A STORY</span><span>Made slowly, loved forever.</span></div>
        </div>
        <div className="hero-index">01 <span /> 03</div>
      </section>

      <section className="home-values" aria-label="Marketplace benefits">
        <div><span className="value-number">01</span><p><strong>Made with intention</strong><span>Every piece has a person behind it.</span></p></div>
        <div><span className="value-number">02</span><p><strong>Find your one of one</strong><span>Discover pieces beyond the ordinary.</span></p></div>
        <div><span className="value-number">03</span><p><strong>Good things grow here</strong><span>Help independent makers thrive.</span></p></div>
      </section>

      <section className="home-featured" id="featured">
        <div className="featured-heading"><div><span className="section-kicker">A FEW THINGS WE LOVE</span><h2>Made to be <em>kept.</em></h2></div><Link to="/buyer" className="text-link">View all pieces <ArrowRightIcon /></Link></div>
        <div className="featured-status"><span className={`live-dot ${connected ? "is-live" : ""}`} />{connected ? "Live from the marketplace" : "From the maker community"}</div>
        {featured.length ? <div className="featured-grid">{featured.map((product, index) => (
          <Link to={`/product/${product.id}`} className={`featured-card featured-card-${index + 1}`} key={product.id}>
            <div className="featured-photo"><img src={product.image || "/pot.jpg"} alt={product.title} /><span className="featured-tag">{product.stock > 0 ? "MADE BY HAND" : "SOLD OUT"}</span></div>
            <div className="featured-meta"><div><h3>{product.title}</h3><p>{product.hashtags?.slice(0, 2).map((tag) => `#${tag}`).join("  ")}</p></div><span>₹{product.price}</span></div>
          </Link>
        ))}</div> : <div className="featured-empty"><p>Our makers are putting the finishing touches on their first pieces.</p><Link to="/buyer" className="text-link">Visit the marketplace <ArrowRightIcon /></Link></div>}
      </section>

      <section className="maker-banner"><div><span className="section-kicker">YOUR CRAFT HAS A PLACE HERE</span><h2>Make something.<br /><em>Make it yours.</em></h2></div><Link to="/seller" className="banner-button">Start selling <ArrowRightIcon /></Link><span className="banner-mark">✳</span></section>
      <footer className="home-footer"><Link to="/" className="footer-brand">ARTISAN<span>AI</span></Link><span>Thoughtfully made. Happily found.</span><Link to="/buyer">Discover the marketplace <ArrowRightIcon /></Link></footer>
    </main>
  );
};

export default Home;
