import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Button } from "react-bootstrap";
import { ProductProps } from "../types/types";
import { Option } from "./MultiSelectDropdown";
import { useProductContext } from "../Context/ProductPageContext";

type ButtonProps = {
  onSubmit: (editedProduct: ProductProps) => void;
  title: string;
  product: ProductProps | undefined;
};

export function ProductDisplay({ onSubmit, title }: ButtonProps) {
  const { id } = useParams<{ id: string }>();
  const { products, deleteProduct } = useProductContext();
  const [product, setProduct] = useState<ProductProps | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState<ProductProps | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find((prod) => prod.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setEditedProduct(foundProduct);
    } else {
      setProduct(undefined);
    }
  }, [id, products]);

  const handleShowModal = () => {
    setShowModal(true);
    setEditedProduct(product);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [name]: value,
      });
    }
  };

  const handleBusinessChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions && editedProduct) {
      setEditedProduct({
        ...editedProduct,
        business: selectedOptions.map((option) => option.value),
      });
    }
  };
  const handleRegionsChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions && editedProduct) {
      setEditedProduct({
        ...editedProduct,
        regions: selectedOptions.map((option) => option.value),
      });
    }
  };

  const handleSubmit = () => {
    if (editedProduct) {
      onSubmit(editedProduct);
      setShowModal(false)
    }
  };

  return (
    <>
      {product ? (
        <>
          <ProductModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            title="Edit Product"
            newProduct={
              editedProduct || {
                id: "",
                name: "",
                business: product.business || [],
                regions: product.regions || [],
              }
            }
            editMode={true}
            handleBusinessChange={handleBusinessChange}
            handleRegionsChange={handleRegionsChange}
          />
          <ProductCard
            id={product.id}
            name={product.name}
            business={product.business}
            regions={product.regions}
            withLink={false}
            isDelete={false}
            deleteProduct={deleteProduct}
          />
          <div className="container-fluid">
            <Button className="" onClick={handleShowModal}>
              {title}
            </Button>
          </div>
        </>
      ) : (
        <div>Product not found</div>
      )}
    </>
  );
}
