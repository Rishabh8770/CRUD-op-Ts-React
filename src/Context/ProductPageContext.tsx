import { createContext, useContext, useEffect, useState } from "react";
import { ProductProps, ProductStatus } from "../types/types";
import axios from "axios";
import { baseUrl } from "../config";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (updatedProduct: ProductProps) => void;
  fetchProducts: () => void;
  updateStatus: (productId: string, status: ProductStatus) => void;
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
      const response = await axios.get(`${baseUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add Product Method
  const addProduct = async (newProduct: ProductProps) => {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, addedProduct]);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  // Delete product Method
  const deleteProduct = (productId: string) => {
    try {
      axios.delete(`${baseUrl}/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting the product", error);
    }
  };

  // Edit Product method
  const updateProduct = async (updatedProduct: ProductProps) => {
    try {
      const response = await axios.put(
        `${baseUrl}/products/${updatedProduct.id}`,
        updatedProduct
      );
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const updateStatus = async (productId: string, status: ProductStatus) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) {
        product.status = status;
        await axios.put(`${baseUrl}/products/${productId}`, product);
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === productId ? { ...p, status } : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    updateStatus
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}
