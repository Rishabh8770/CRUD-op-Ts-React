import { useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ProductModal } from "./ProductModal";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { Option } from "./MultiSelectDropdown";


type NewProductProps = ProductProps;

type ButtonProps = {
  title: string;
  onSubmit: (newProduct: NewProductProps) => void;
  product?: NewProductProps;
};

export function AddProduct({ title }: ButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductProps>({
    id: uuidv4(),
    name: "",
    business: [],
    regions: [],
  });

  const { addProduct } = useProductContext();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleBusinessChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions) {
      setNewProduct({
        ...newProduct,
        business: selectedOptions.map((option) => option.value),
      });
    }
  };

  const handleRegionsChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions) {
      setNewProduct({
        ...newProduct,
        regions: selectedOptions.map((option) => option.value),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const addedProduct = await response.json();
      await addProduct(addedProduct);
      
      setNewProduct({
        id: uuidv4(),
        name: "",
        business: [],
        regions: [],
      });
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <>
      <div className="mx-3">
        <Button variant="success" onClick={handleShow}>
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
        handleBusinessChange={handleBusinessChange}
        handleRegionsChange={handleRegionsChange}
      />
    </>
  );
}
