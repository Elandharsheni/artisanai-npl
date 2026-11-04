import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addProduct } from "../services/marketplace";
import "./AddProduct.css";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [preview, setPreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a PNG, JPG, WEBP, or GIF image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
      setImageName(file.name);
      setError("");
    };
    reader.onerror = () => setError("The selected image could not be read. Please try another file.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await addProduct({
        title: title.trim(),
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
        hashtags: hashtags.split(",").map((tag) => tag.trim()).filter(Boolean),
        image: preview,
      });
      navigate("/seller", { state: { notice: "Your project is live in the marketplace." } });
    } catch (submitError) {
      setError(submitError.message || "Your project could not be shared. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const generateContent = () => {
    if (!title.trim()) {
      setError("Add a project title first to generate a description.");
      return;
    }
    const words = title.toLowerCase().split(/\s+/);
    setDescription(`Meet ${title.trim()}, thoughtfully made by hand for everyday use and gifting. Each piece celebrates the care and character of independent craft.`);
    setHashtags([...words.filter((word) => word.length > 2), "handmade", "artisan"].join(", "));
    setError("");
  };

  return (
    <main className="add-product-page">
      <div className="add-product-shell">
        <div className="add-product-intro">
          <Link to="/seller" className="add-back-link">← Back to your studio</Link>
          <span className="add-eyebrow">YOUR WORK DESERVES TO BE SEEN</span>
          <h1>Share what<br /><em>you make.</em></h1>
          <p>Add your project to the marketplace. Include a photo so people can see the care and detail behind your work.</p>
          <div className="add-tip"><span>✳</span><p><strong>A good photo makes a difference.</strong><br />Use natural light and show your piece clearly.</p></div>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-heading"><div><span className="add-eyebrow">NEW LISTING</span><h2>Project details</h2></div><span className="form-step">01 <i /> 02</span></div>
          <label className="form-field">Project name<input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={80} placeholder="e.g. Handwoven market tote" /></label>
          <div className="form-row">
            <label className="form-field">Price <span className="field-hint">INR</span><input type="number" value={price} onChange={(event) => setPrice(event.target.value)} required min="1" step="1" placeholder="499" /></label>
            <label className="form-field">Available pieces<input type="number" value={stock} onChange={(event) => setStock(event.target.value)} required min="0" step="1" /></label>
          </div>
          <div className="form-field description-label"><span>Description</span><button type="button" className="generate-button" onClick={generateContent}>✧ Help me write</button><textarea value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={1000} rows={4} placeholder="Tell shoppers what makes this piece special…" /></div>
          <label className="form-field">Tags <span className="field-hint">SEPARATE WITH COMMAS</span><input type="text" value={hashtags} onChange={(event) => setHashtags(event.target.value)} placeholder="handmade, ceramics, home" /></label>

          <div className="form-field upload-field"><span>Project photo <span className="field-hint">OPTIONAL · PNG, JPG, WEBP OR GIF · UP TO 2 MB</span></span>
            <input ref={fileInput} className="hidden-file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageUpload} />
            {preview ? <div className="upload-preview"><img src={preview} alt="Preview of your project" /><div className="upload-preview-info"><strong>{imageName}</strong><span>Ready to share with your listing</span><button type="button" onClick={() => { setPreview(""); setImageName(""); if (fileInput.current) fileInput.current.value = ""; }}>Remove photo</button></div><button type="button" className="replace-photo" onClick={() => fileInput.current?.click()}>Replace</button></div> : <button type="button" className="upload-dropzone" onClick={() => fileInput.current?.click()}><span className="upload-icon">↑</span><strong>Choose a photo from your device</strong><span>Click to browse · JPG, PNG, WEBP or GIF</span></button>}
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="publish-button" type="submit" disabled={saving}>{saving ? "Sharing your project…" : "Share project with the marketplace  →"}</button>
          <p className="form-footnote">Your listing appears in the marketplace as soon as it’s shared.</p>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;
