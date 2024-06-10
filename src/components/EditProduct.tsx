import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { NotificationContainer } from './UserFeedbacks';

export function ProductDisplay() {
  const { id } = useParams<{ id: string }>();
  const { products, deleteProduct } = useProductContext();
  const [product, setProduct] = useState<ProductProps | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find((prod) => prod.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(undefined);
    }
  }, [id, products]);

  return (
    <>
      {product ? (
        <ProductCard
          id={product.id}
          name={product.name}
          business={product.business}
          regions={product.regions}
          isDelete={true}
          deleteProduct={deleteProduct}
          status={product.status}
        />
      ) : (
        <div>Product not found</div>
      )}
      <NotificationContainer />
    </>
  );
}

