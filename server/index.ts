import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProductProps } from "../src/types/types";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "productData.json");

app.use(cors());
app.use(express.json());

const readData = (): ProductProps[] => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
};

const writeData = (data: ProductProps[]): void => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
};

app.get("/products", (_req, res) => {
  const items = readData();
  res.json(items);
});

app.post("/products", (req, res) => {
  const newProduct: ProductProps = req.body;
  if (!newProduct || !newProduct.id || !newProduct.name) {
    return res.status(400).json({ error: "Invalid product data" });
  }
  newProduct.status = 'pending';
  const items = readData();
  items.push(newProduct);
  writeData(items);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct: ProductProps = req.body;
  let items = readData();
  items = items.map((item) => (item.id === id ? updatedProduct : item));
  writeData(items);
  res.json(updatedProduct);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  let items = readData();
  items = items.filter((item) => item.id !== id);
  writeData(items);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
