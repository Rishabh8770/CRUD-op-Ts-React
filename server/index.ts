import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProductProps } from "../src/types/types";

const app = express();
const port = process.env.PORT || 3000;

// Use `import.meta.url` to get the directory name
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
  const newProduct: ProductProps = {...req.body, status: "pending"};
  if (!newProduct || !newProduct.id || !newProduct.name) {
    return res.status(400).json({ error: "Invalid product data" });
  }
  const items = readData();
  items.push(newProduct);
  writeData(items);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct: ProductProps = {...req.body, status: "pending"};
  let items = readData();
  items = items.map((item) => (item.id === id ? updatedProduct : item));
  writeData(items);
  res.json(updatedProduct);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const items = readData();
  const productIndex = items.findIndex((item) => item.id === id);
  if(productIndex !== -1){
    items[productIndex].status = "pending"
    writeData(items);
    res.json(items[productIndex])
  }else{
    res.status(404).json("product not found")
  }
});
app.put("/products/:id/approve", (req, res) => {
  const { id } = req.params;
  const items = readData();
  const productIndex = items.findIndex((item) => item.id === id);
  if(productIndex !== -1){
    items[productIndex].status = "active"
    writeData(items);
    res.json(items[productIndex])
  }else{
    res.status(404).json("product not found")
  }
});

app.put("/products/:id/reject", (req, res) => {
  const { id } = req.params;
  const items = readData();
  const productIndex = items.findIndex((item) => item.id === id);
  if(productIndex !== -1){
    items[productIndex].status = "rejected"
    writeData(items);
    res.json(items[productIndex])
  }else{
    res.status(404).json("product not found")
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
