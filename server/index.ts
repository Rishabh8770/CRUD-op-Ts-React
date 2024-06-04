import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProductProps } from "../src/types/types";
import { Response } from "express-serve-static-core";

const app = express();
const port = process.env.PORT || 3000;

// Use `import.meta.url` to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "productData.json");
const deletedDataFilePath = path.join(__dirname, "deletedProductData.json");

app.use(cors());
app.use(express.json());



const readData = (filePath: string): ProductProps[] => {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const writeData = (filePath: string, data: ProductProps[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const initializeProductStatus = (filePath: string): void => {
  const items = readData(filePath);
  const updatedItems: ProductProps[] = items.map((item) => {
    if (!item.status) {
      return { ...item, status: "pending" } as ProductProps;
    }
    return item;
  });
  writeData(filePath, updatedItems);
};

initializeProductStatus(dataFilePath)

app.get("/products", (_req, res) => {
  const items = readData(dataFilePath);
  res.json(items);
});

app.get("/deleted-products", (_req, res) => {
  const items = readData(deletedDataFilePath);
  res.json(items);
});

app.post("/products", (req, res) => {
  const newProduct: ProductProps = { ...req.body, status: "pending" };
  if (!newProduct || !newProduct.id || !newProduct.name) {
    return res.status(400).json({ error: "Invalid product data" });
  }
  const items = readData(dataFilePath);
  items.push(newProduct);
  writeData(dataFilePath, items);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct: ProductProps = { ...req.body, status: "pending" };
  let items = readData(dataFilePath);
  items = items.map((item) => (item.id === id ? updatedProduct : item));
  writeData(dataFilePath, items);
  res.json(updatedProduct);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const items = readData(dataFilePath);
  const productIndex = items.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    const deletedProduct: ProductProps = { ...items[productIndex], status: "delete_pending" };
    items.splice(productIndex, 1);
    writeData(dataFilePath, items);

    const deletedItems = readData(deletedDataFilePath);
    deletedItems.push(deletedProduct);
    writeData(deletedDataFilePath, deletedItems);

    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateStatus = (id: string, status: "active" | "rejected" | "deleted", res: Response) => {
  const items = readData(dataFilePath);
  let productIndex = items.findIndex((item) => item.id === id);
  if (productIndex !== -1) {
    items[productIndex].status = status;
    writeData(dataFilePath, items);
    return res.json(items[productIndex]);
  } else {
    const deletedItems = readData(deletedDataFilePath);
    productIndex = deletedItems.findIndex((item) => item.id === id);
    if (productIndex !== -1) {
      deletedItems[productIndex].status = status;
      writeData(deletedDataFilePath, deletedItems);
      return res.json(deletedItems[productIndex]);
    }
  }
  return res.status(404).json("Product not found");
};

app.put("/products/:id/approve", (req, res) => {
  const { id } = req.params;
  const product = readData(deletedDataFilePath).find((item) => item.id === id);
  const status = product?.status === "delete_pending" ? "deleted" : "active";
  updateStatus(id, status, res);
});

app.put("/products/:id/reject", (req, res) => {
  const { id } = req.params;
  updateStatus(id, "rejected", res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
