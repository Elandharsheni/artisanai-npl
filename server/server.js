import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const productsFile = path.resolve(process.env.PRODUCTS_FILE || path.join(dataDir, "products.json"));
const ordersFile = path.join(dataDir, "orders.json");
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.API_PORT || 3001);
const maxImageLength = 2 * 1024 * 1024;
const clients = new Set();
let mutationQueue = Promise.resolve();

const initialProducts = [
  {
    id: 1,
    title: "Handcrafted Vase",
    price: 249,
    description: "A beautiful handcrafted ceramic vase for your home decor.",
    hashtags: ["vase", "ceramic", "handmade"],
    image: "/vase1.jpg",
    stock: 8,
  },
  {
    id: 2,
    title: "Wall Art Painting",
    price: 499,
    description: "A stunning handmade painting perfect for your living space.",
    hashtags: ["art", "painting", "decor"],
    image: "/painting1.jpg",
    stock: 5,
  },
  {
    id: 3,
    title: "Woven Basket",
    price: 299,
    description: "An eco-friendly basket made with natural materials.",
    hashtags: ["basket", "woven", "storage"],
    image: "/basket1.jpg",
    stock: 12,
  },
  {
    id: 4,
    title: "Clay Tea Cup",
    price: 99,
    description: "Enjoy your tea in this beautiful clay cup handcrafted by artisans.",
    hashtags: ["cup", "clay", "tea"],
    image: "/cup1.jpg",
    stock: 20,
  },
];

async function loadProducts() {
  await mkdir(dataDir, { recursive: true });

  try {
    return JSON.parse(await readFile(productsFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeFile(productsFile, JSON.stringify(initialProducts, null, 2));
    return initialProducts;
  }
}

async function saveProducts(products) {
  await writeFile(productsFile, JSON.stringify(products, null, 2));
}

async function loadOrders() {
  try {
    return JSON.parse(await readFile(ordersFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return [];
  }
}

async function withProductsMutation(update) {
  const operation = mutationQueue.then(async () => {
    const products = await loadProducts();
    const result = await update(products);
    await saveProducts(products);
    return { products, result };
  });
  mutationQueue = operation.catch(() => {});
  return operation;
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(value));
}

function broadcastProducts(products) {
  const message = `data: ${JSON.stringify({ type: "products", products })}\n\n`;
  for (const client of clients) client.write(message);
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maxImageLength * 2) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      throw error;
    }
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.status = 400;
    throw error;
  }
}

function validateProduct(product) {
  if (
    !product ||
    typeof product !== "object" ||
    typeof product.title !== "string" ||
    !product.title.trim() ||
    typeof product.description !== "string" ||
    !product.description.trim() ||
    !Number.isFinite(Number(product.price)) ||
    Number(product.price) <= 0 ||
    !Number.isInteger(Number(product.stock)) ||
    Number(product.stock) < 0 ||
    !Array.isArray(product.hashtags)
  ) {
    return "Add a title, description, valid price, stock quantity, and hashtags.";
  }

  if (
    product.image &&
    (!/^data:image\/(?:png|jpeg|webp|gif);base64,/.test(product.image) ||
      product.image.length > maxImageLength * 1.4)
  ) {
    return "Product images must be PNG, JPG, WEBP, or GIF and no larger than 2 MB.";
  }

  return null;
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  }[extension] || "application/octet-stream";
}

async function serveApp(request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    sendJson(response, 400, { error: "Invalid URL." });
    return;
  }

  const requestedFile = path.resolve(distDir, `.${pathname}`);
  const isInsideDist = requestedFile.startsWith(`${distDir}${path.sep}`);
  const filePath = pathname !== "/" && isInsideDist ? requestedFile : path.join(distDir, "index.html");

  try {
    const contents = await readFile(filePath);
    response.writeHead(200, { "Content-Type": contentType(filePath) });
    response.end(contents);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    sendJson(response, 404, { error: "Build the app with npm run build before starting production mode." });
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;

  try {
    if (request.method === "GET" && pathname === "/api/events") {
      response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      response.write("retry: 3000\n\n");
      clients.add(response);
      response.on("close", () => clients.delete(response));
      response.write(`data: ${JSON.stringify({ type: "products", products: await loadProducts() })}\n\n`);
      return;
    }

    if (request.method === "GET" && pathname === "/api/products") {
      sendJson(response, 200, await loadProducts());
      return;
    }

    if (request.method === "POST" && pathname === "/api/products") {
      const body = await readJsonBody(request);
      const error = validateProduct(body);
      if (error) {
        sendJson(response, 400, { error });
        return;
      }

      const product = {
        id: randomUUID(),
        title: body.title.trim(),
        price: Number(body.price),
        description: body.description.trim(),
        hashtags: body.hashtags.map((tag) => String(tag).replace(/^#/, "").trim()).filter(Boolean),
        image: body.image || "",
        stock: Number(body.stock),
      };
      const { products } = await withProductsMutation((current) => current.push(product));
      broadcastProducts(products);
      sendJson(response, 201, product);
      return;
    }

    if (request.method === "POST" && pathname === "/api/orders") {
      const body = await readJsonBody(request);
      const quantity = Number(body?.quantity);
      if (!body || !body.productId || !Number.isInteger(quantity) || quantity < 1 || typeof body.name !== "string" || !body.name.trim() || typeof body.address !== "string" || !body.address.trim()) {
        sendJson(response, 400, { error: "Add your name, delivery address, and a valid quantity." });
        return;
      }

      const operation = mutationQueue.then(async () => {
        const products = await loadProducts();
        const product = products.find((item) => String(item.id) === String(body.productId));
        if (!product) return { error: "This product is no longer available.", status: 404 };
        if (product.stock < quantity) return { error: `Only ${product.stock} item${product.stock === 1 ? "" : "s"} remain in stock.`, status: 409 };
        product.stock -= quantity;
        const order = {
          orderId: randomUUID(),
          productId: product.id,
          productTitle: product.title,
          image: product.image,
          unitPrice: product.price,
          quantity,
          total: product.price * quantity,
          customer: { name: body.name.trim(), address: body.address.trim() },
          createdAt: new Date().toISOString(),
          status: "Confirmed",
        };
        const orders = await loadOrders();
        orders.unshift(order);
        await saveProducts(products);
        await writeFile(ordersFile, JSON.stringify(orders, null, 2));
        return { products, order };
      });
      mutationQueue = operation.catch(() => {});
      const outcome = await operation;

      if (outcome.error) {
        sendJson(response, outcome.status, { error: outcome.error });
        return;
      }

      broadcastProducts(outcome.products);
      sendJson(response, 201, outcome.order);
      return;
    }

    if (pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "API route not found." });
      return;
    }

    await serveApp(request, response);
  } catch (error) {
    if (error.status) {
      sendJson(response, error.status, { error: error.message });
      return;
    }
    console.error("Request failed:", error);
    sendJson(response, 500, { error: "The server could not complete the request." });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Marketplace API listening on http://127.0.0.1:${port}`);
});

const heartbeat = setInterval(() => {
  for (const client of clients) client.write(": keep-alive\n\n");
}, 25000);

server.on("close", () => clearInterval(heartbeat));
