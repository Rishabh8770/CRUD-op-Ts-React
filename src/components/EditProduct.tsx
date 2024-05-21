import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productData } from "../data/productData";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Button } from "react-bootstrap";
import { ProductProps } from "../types/types";
import { Option } from "./MultiSelectDropdown";
import { useProductContext } from "../Context/ProductPageContext";

type Product = ProductProps;

type ButtonProps = {
  onSubmit: (editedProduct: Product) => void;
  title: string;
  product: Product | undefined;
};

export function ProductDisplay({ onSubmit, title }: ButtonProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(() => {
    return productData.find((prod) => prod.id === id);
  });

  const [showModal, setShowModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | undefined>(
    product
  );
  const { deleteProduct } = useProductContext();

  useEffect(() => {
    const foundProduct = productData.find((prod) => prod.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setEditedProduct(foundProduct);
    } else {
      setProduct(undefined);
    }
  }, [id]);

  const handleShowModal = () => {
    setEditedProduct(product);
    setShowModal(true);
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
      productData.push(editedProduct);
      setProduct(editedProduct);
      handleCloseModal();
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
