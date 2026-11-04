import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProducts, subscribeToProducts } from "../services/marketplace";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const syncProduct = (products) => {
      const found = products.find((item) => String(item.id) === String(id));
      if (!active) return;
      setProduct(found || null);
      setError(found ? "" : "This piece is no longer listed.");
      setLoading(false);
    };
    getProducts().then(syncProduct).catch((loadError) => {
      if (active) { setError(loadError.message); setLoading(false); }
    });
    const unsubscribe = subscribeToProducts(syncProduct, () => {});
    return () => { active = false; unsubscribe(); };
  }, [id]);

  const startCheckout = () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(product));
    navigate("/checkout");
  };

  if (loading) return <main className="min-h-[60vh] grid place-items-center">Loading this piece…</main>;
  if (!product) return <main className="min-h-[60vh] grid place-items-center"><div className="text-center"><p role="alert">{error || "This piece is no longer listed."}</p><Link to="/buyer">Back to the marketplace</Link></div></main>;

  return (
    <main className="min-h-[75vh] bg-[#f7f5ef] px-5 py-12 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 bg-white p-5 md:grid-cols-2 md:gap-14 md:p-10">
        <img src={product.image || "/pot.jpg"} onError={(event) => { event.currentTarget.src = "/pot.jpg"; }} alt={product.title} className="h-80 w-full object-cover md:h-[480px]" />
        <section className="flex flex-col justify-center">
          <Link to="/buyer" className="mb-8 text-xs text-stone-500">← Back to the marketplace</Link>
          <p className="text-[10px] font-bold tracking-[.2em] text-[#a34d32]">MADE BY HAND</p>
          <h1 className="mt-3 font-serif text-4xl">{product.title}</h1>
          <p className="mt-4 text-xl">₹{product.price}</p>
          <p className="mt-5 leading-7 text-stone-600">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#a34d32]">{product.hashtags?.map((tag) => <span key={tag}>#{tag}</span>)}</div>
          <p className={`mt-6 text-xs ${product.stock ? "text-emerald-700" : "text-red-600"}`}>{product.stock ? `${product.stock} available · inventory updates live` : "Currently sold out"}</p>
          <button onClick={startCheckout} disabled={!product.stock} className="mt-5 bg-[#292820] px-5 py-4 text-sm text-white disabled:cursor-not-allowed disabled:bg-stone-400">Continue to checkout →</button>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
