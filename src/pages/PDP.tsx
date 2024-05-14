import { useState } from "react";
import { ProductDisplay } from "../components/EditProduct";
import { ProductProps } from "../types/types";

type Product = ProductProps;

type ProductDisplayAndEditProps = {
  onSubmit: (editedProduct: Product) => void;
};

export function ProductDisplayAndEdit({
  onSubmit
}: ProductDisplayAndEditProps) {
  const [productData, setProductData] = useState<Product[]>([]);

  const handleSubmit = (editedProduct: Product) => {
    const updateProductData = productData.map((product) => {
      if (product.id === editedProduct.id) {
        console.log("submit", editedProduct);
        return editedProduct;
      }
      return product;
    });
    setProductData(updateProductData);
    localStorage.setItem("productData", JSON.stringify(updateProductData));
    onSubmit(editedProduct)
  };
  return <ProductDisplay onSubmit={handleSubmit} title="Edit Product"/>;
}
