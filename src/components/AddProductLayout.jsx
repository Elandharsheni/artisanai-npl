import React from 'react';

const AddProductLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-cover bg-center"
      style={{ backgroundImage: `url('/background2.jpg')` }}
    >
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default AddProductLayout;
