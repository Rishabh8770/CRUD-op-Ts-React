import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Button } from "react-bootstrap";
import { ProductProps } from "../types/types";
import { Option } from "./MultiSelectDropdown";
import { useProductContext } from "../Context/ProductPageContext";
import { notifyEditProduct, notifyErrorEditingProduct, notifyMandatoryWarn } from "../utils/NotificationUtils";
import {NotificationContainer} from './UserFeedbacks'

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
  const [editedProduct, setEditedProduct] = useState<ProductProps | undefined>(
    undefined
  );

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

    if(editedProduct?.business.length === 0 || editedProduct?.regions.length ===0){
      notifyMandatoryWarn();
      return;
    }

    try {
      // throw new Error("error editing") // to simulate Error and test notifyError
      if (editedProduct) {
        onSubmit(editedProduct);
        notifyEditProduct();
        setShowModal(false);
      }
    } catch (error) {
      notifyErrorEditingProduct();
      console.error("Error on editing the product", error);
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
                status: product.status
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
            status={product.status}
            withLink={false}
            isDelete={false}
            deleteProduct={deleteProduct}
          />
          <div className="m-3">
            <Button onClick={handleShowModal}>
              {title}
            </Button>
          </div>
        </>
      ) : (
        <div>Product not found</div>
      )}
      <NotificationContainer />
    </>
  );
}
