import { useEffect, useState } from "react";
import { ProductDisplay } from "../components/EditProduct";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { useParams } from "react-router-dom";
// import { productData } from "../data/productData";

type Product = ProductProps;

export function ProductDisplayAndEdit() {
  const { id } = useParams<{ id: string }>()
  const {products, addProduct} = useProductContext();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find((prod) => prod.id === id);
    setProduct(foundProduct);
  }, [products, id]);


  const handleSubmit = (editedProduct: Product) => {
    addProduct(editedProduct)
};

  return <ProductDisplay onSubmit={handleSubmit} title="Edit Product" product={product}/>;
}
