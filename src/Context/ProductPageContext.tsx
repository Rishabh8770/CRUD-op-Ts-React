import { createContext, useContext, useEffect, useState } from "react";
import { ProductProps } from "../types/types";
import axios from "axios";
import { baseUrl } from "../config";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (updatedProduct: ProductProps) => void;
  fetchProducts: () => void;
  approveProduct: (productId: string, status: "active") => void;
  rejectProduct: (productId: string, status: "rejected") => void;
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
      const [response, deletedResponse] = await Promise.all([
        axios.get(`${baseUrl}/products`),
        axios.get(`${baseUrl}/deleted-products`),
      ]);
      const activeProducts = response.data.filter(
        (product: { status: string }) => product.status !== "deleted"
      );
      const deletedProducts = deletedResponse.data;
      setProducts([...activeProducts, ...deletedProducts]);
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
  const deleteProduct = async (productId: string) => {
    try {
      await axios.delete(`${baseUrl}/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, status: "delete_pending" }
            : product
        )
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

  const approveProduct = async (
    productId: string,
    status: "active" | "deleted"
  ) => {
    try {
      const product = products.find((product) => product.id === productId);
      const newStatus =
        product?.status === "delete_pending" ? "deleted" : status;
      await axios.put(`${baseUrl}/products/${productId}/approve`, {
        status: newStatus,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, status: newStatus } : product
        )
      );
    } catch (error) {
      console.error("Error approving product", error);
    }
  };

  const rejectProduct = async (productId: string, status: "rejected") => {
    try {
      await axios.put(`${baseUrl}/products/${productId}/reject`, { status });
      setProducts((prevProducts) =>
        prevProducts
          .map((product) =>
            product.id === productId
              ? {
                  ...product,
                  status:
                    product.status === "delete_pending" ? "rejected" : status,
                }
              : product
          )
          .filter((product) => product.status !== "delete_pending")
      );
    } catch (error) {
      console.error("Error rejecting product", error);
    }
  };

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    approveProduct,
    rejectProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}
