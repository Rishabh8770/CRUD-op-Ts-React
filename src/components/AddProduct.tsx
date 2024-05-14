import { useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ProductModal } from "./ProductModal";
import { productData } from "../data/productData";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";

type NewProductProps = ProductProps;

type ButtonProps = {
  title: string;
  onSubmit: (newProduct: NewProductProps) => void;
  product?: NewProductProps;
};

export function AddProduct({ onSubmit, title, product }: ButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductProps>({
    id: product?.id || uuidv4(),
    name: product?.name || "",
    business: product?.business || [],
    regions: product?.regions || [],
  });

  const { addProduct } = useProductContext();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "business" || name === "regions") {
      const arrayValue = value.split(",").map((item) => item.trim());
      setNewProduct({
        ...newProduct,
        [name]: arrayValue,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(newProduct);
    addProduct(newProduct);
    productData.push(newProduct);
    handleClose();
  };

  return (
    <>
      <div className="mx-3">
        <Button variant="outline-primary" onClick={handleShow}>
          {title}
        </Button>
      </div>
      <ProductModal
        showModal={showModal}
        handleCloseModal={handleClose}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        title="Add Product"
        newProduct={newProduct}
        editMode={false}
      />
    </>
  );
}
