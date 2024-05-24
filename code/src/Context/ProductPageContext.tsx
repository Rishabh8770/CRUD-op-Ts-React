import { createContext, useContext, useEffect, useState } from "react";
import { ProductProps } from "../types/types";
import axios from "axios";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (updatedProduct: ProductProps) => void
};

type ProductContextProviderProps = {
  children: React.ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("Context must be used within a ProductProvider");
  }
  return context;
};

export function ProductProvider({ children }: ProductContextProviderProps) {
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      console.log("Fetched products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (product: ProductProps) => {
    console.log("Adding product:", product);
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts, product];
      console.log("Updated product list:", newProducts);
      return newProducts;
    });
  };

  const deleteProduct = (productId: string) => {
    axios.delete(`http://localhost:3000/products/${productId}`).then(() => {
      setProducts((prevProducts) =>{
        const deleted = prevProducts.filter((product) => product.id !== productId)
        console.log("deleted prod:::", deleted)
      return deleted
      });
    });
  };

  const updateProduct = async (updatedProduct: ProductProps) => {
    try {
      const response = await axios.put(`http://localhost:3000/products/${updatedProduct.id}`, updatedProduct);
      console.log("Response from updateProduct API:", response.data);
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      console.log("Products after update:", updatedProducts);
      return response.data; 
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
    updateProduct
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}
