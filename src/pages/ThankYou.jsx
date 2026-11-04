import React from "react";
import { Link, useLocation } from "react-router-dom";

const ThankYou = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <main className="min-h-[75vh] bg-[#f7f5ef] px-5 py-14">
      <section className="mx-auto max-w-xl border border-[#ebe8e0] bg-white p-7 text-center shadow-sm md:p-12">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf5eb] text-xl text-[#4d7951]">✓</span>
        <p className="mt-6 text-[10px] font-bold tracking-[.2em] text-[#a34d32]">ORDER CONFIRMED</p>
        <h1 className="mt-2 font-serif text-4xl">Thank you{order?.customer?.name ? `, ${order.customer.name.split(" ")[0]}` : ""}.</h1>
        {order ? <div className="mt-8 border-y border-stone-200 py-5 text-left text-sm">
          <div className="flex justify-between gap-4"><span className="text-stone-500">Order reference</span><strong>{order.orderId.slice(0, 8).toUpperCase()}</strong></div>
          <div className="mt-4 flex justify-between gap-4"><span className="text-stone-500">Item</span><strong>{order.productTitle} × {order.quantity}</strong></div>
          <div className="mt-4 flex justify-between gap-4"><span className="text-stone-500">Total</span><strong>₹{order.total}</strong></div>
          <div className="mt-4 flex justify-between gap-4"><span className="text-stone-500">Status</span><strong className="text-[#4d7951]">{order.status}</strong></div>
          <p className="mt-5 border-t border-stone-100 pt-4 text-xs leading-6 text-stone-500">Delivery address<br /><span className="text-stone-700">{order.customer.address}</span></p>
        </div> : <p className="mt-5 text-sm leading-6 text-stone-600">Your order was placed. Its receipt is available in this session.</p>}
        <p className="mt-5 text-xs leading-6 text-stone-500">Your order is recorded and stock has been updated in the marketplace.</p>
        <Link to="/buyer" className="mt-7 inline-flex bg-[#292820] px-5 py-3 text-xs text-white">Continue exploring →</Link>
      </section>
    </main>
  );
};

export default ThankYou;
