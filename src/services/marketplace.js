async function request(path, options) {
  const response = await fetch(path, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The marketplace request failed.");
  return result;
}

export function getProducts() {
  return request("/api/products");
}

export function addProduct(product) {
  return request("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export function placeOrder(productId, quantity, customer) {
  return request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, ...customer }),
  });
}

export function subscribeToProducts(onProducts, onConnectionChange) {
  const events = new EventSource("/api/events");
  events.onopen = () => onConnectionChange(true);
  events.onerror = () => onConnectionChange(false);
  events.onmessage = ({ data }) => {
    const update = JSON.parse(data);
    if (update.type === "products") onProducts(update.products);
  };
  return () => events.close();
}
