import { useState } from "react";
import { ProductDisplay } from "../components/EditProduct";

type ProductProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

type ProductDisplayAndEditProps = {
  onSubmit: (editedProduct: ProductProps) => void;
};

export function ProductDisplayAndEdit({
  onSubmit
}: ProductDisplayAndEditProps) {
  const [productData, setProductData] = useState<ProductProps[]>([]);

  const handleSubmit = (editedProduct: ProductProps) => {
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
