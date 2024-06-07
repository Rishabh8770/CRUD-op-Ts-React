/* import { useEffect, useState } from "react";
import { ProductDisplay } from "../components/EditProduct";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { useParams } from "react-router-dom";

export function ProductDisplayAndEdit() {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useProductContext();
  const [product, setProduct] = useState<ProductProps | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find((prod) => prod.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [products, id]);

  const handleSubmit = async (editedProduct: ProductProps) => {
    try {
      editedProduct.status = "pending";
      await updateProduct(editedProduct);
      console.log("Product updated successfully:", editedProduct);
      setProduct(editedProduct);
    } catch (error) {
      console.error("Error updating the product", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <ProductDisplay onSubmit={handleSubmit} title="Edit Product" product={product} />
  );
}
 */