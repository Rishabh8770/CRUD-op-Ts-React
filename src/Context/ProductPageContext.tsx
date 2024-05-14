import { createContext, useContext, useState } from "react";
import { ProductProps } from "../types/types";
import { productData } from "../data/productData";

type ProductContextType = {
  products: ProductProps[];
  addProduct: (newProduct: ProductProps) => void;
  deleteProduct: (productId: string) => void;
};

type ProductContextProviderProps = {
  children: React.ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("Context must be used within a ProductProvide");
  }
  return context;
};

export function ProductProvider({ children }: ProductContextProviderProps) {

  const [products, setProducts] = useState<ProductProps[]>(() => {
  // localStorage.setItem("productData", JSON.stringify(productData))

    // console.log("adasda", products)
    try {
      const storedProducts = localStorage.getItem("productData");
      
      return storedProducts ? JSON.parse(storedProducts) : productData;
    } catch (error) {
      console.error("Error parsing the data from local storage", error);
      return productData;
    }
  });
  const addProduct = (newProduct: ProductProps) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("productData", JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId: string) => {
    const updatedProduct = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProduct);
    localStorage.setItem("productData", JSON.stringify(updatedProduct));
  };

  const contextValue: ProductContextType = {
    products,
    addProduct,
    deleteProduct,
  }

  return (
    <ProductContext.Provider value={contextValue}>
        {children}
    </ProductContext.Provider>
  )
}
