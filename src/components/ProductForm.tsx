import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";

import { NotificationContainer } from "./UserFeedbacks";
import { ProductCard } from "../components/ProductCard";

type FormProps = {
  title: string;
  onSubmit: (product: ProductProps) => void;
  productForm: ProductProps | null;
  editMode: boolean;
};

export function ProductForm({ title, onSubmit, productForm, editMode }: FormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProductContext();
  const [product, setProduct] = useState<ProductProps | undefined>(undefined);
  const [currentProduct, setCurrentProduct] = useState<ProductProps>({
    id: uuidv4(),
    name: "",
    business: [],
    regions: [],
    status: "pending",
  });

  useEffect(() => {
    if (productForm) {
      if (id) {
        const foundProduct = products.find((prod) => prod.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          setCurrentProduct(foundProduct);
        } else {
          navigate("/not-found");
        }
      }
    }
  }, [id, products, navigate, productForm]);

  const handleEdit = (productId: string) => {
    navigate(`/edit/${productId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <>
      {id && product ? (
        <ProductCard
          id={product.id}
          name={product.name}
          business={product.business}
          regions={product.regions}
          isDelete={false}
          deleteProduct={deleteProduct}
          status={product.status}
          onEdit={() => handleEdit(product.id)}
        />
      ) : null}

      {productForm && (
        <div>
          <h2>{title}</h2>
          {!editMode && (
            <div>
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
              />
            </div>
          )}
          {/* Add other form fields here */}
          <button onClick={() => onSubmit(currentProduct)}>Submit</button>
        </div>
      )}

      <NotificationContainer />
    </>
  );
}
