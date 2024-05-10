import { useEffect, useState } from "react";
import { AddProduct } from "../components/AddProduct";
import { ProductList } from "../components/ProductCard";
import { productData } from "../data/productData";

type Product = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

export function Home() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const storedProducts = localStorage.getItem("products");
      return storedProducts ? JSON.parse(storedProducts) : productData;
    } catch(error) {
      console.error("Error parsing products from local storage", error);
      return productData;
    }
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);


  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
  };

  return (
    <>
      <AddProduct onSubmit={handleAddProduct} title="Add New Product" />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products.map((product) => (
          <ProductList key={product.id} {...product} withLink />
        ))}
      </div>
    </>
  );
}
