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
  approveProductStep: (productId: string, step: "step1" | "step2") => void;
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

  const addProduct = async (newProduct: ProductProps) => {
    try {
      const response = await axios.post(`${baseUrl}/products`, newProduct);
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

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

  const updateProduct = async (updatedProduct: ProductProps) => {
    try {
      const response = await axios.put(
        `${baseUrl}/products/${updatedProduct.id}`,
        updatedProduct
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? response.data : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const approveProductStep = async (productId: string, step: "step1" | "step2") => {
    try {
      const product = products.find((product) => product.id === productId);
      if (!product) throw new Error("Product not found");

      let newStatus = product.status;
      if (step === "step1") {
        newStatus = "approval_pending";
      } else if (step === "step2") {
        newStatus = product.status === "delete_pending" ? "deleted" : "active";
      }

      await axios.put(`${baseUrl}/products/${productId}/approve`, { status: newStatus });
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
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                status:
                  product.status === "delete_pending" ? "rejected" : status,
              }
            : product
        ).filter((product) => product.status !== "delete_pending")
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
    approveProductStep,
    rejectProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}
