import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!title || !price || !description || !image) {
      alert("Please fill all fields!");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title,
      price,
      description,
      hashtags: hashtags.split(",").map((tag) => tag.trim()),
      image,
    };

    const existing = JSON.parse(localStorage.getItem("products")) || [];
    existing.push(newProduct);
    localStorage.setItem("products", JSON.stringify(existing));

    alert("Product added successfully!");
    navigate("/buyer"); // Redirect to buyer dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          🛠️ Add New Product
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Price ₹"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <input
            type="text"
            placeholder="Hashtags (comma-separated)"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Image Path (e.g., /images/myitem.jpg)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {/* Preview Image */}
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border"
            />
          )}

          <button
            onClick={handleAdd}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
          >
            Add Product 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
