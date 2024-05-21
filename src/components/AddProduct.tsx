import { useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { ProductModal } from "./ProductModal";
// import { productData } from "../data/productData";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { Option } from "./MultiSelectDropdown";
import { productData } from "../data/productData";

type NewProductProps = ProductProps;

type ButtonProps = {
  title: string;
  onSubmit: (newProduct: NewProductProps) => void;
  product?: NewProductProps;
};

export function AddProduct({title}: ButtonProps) {
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

  const handleSubmit = () => {
    addProduct(newProduct);
    setNewProduct({
      id: uuidv4(),
      name: "",
      business: [],
      regions: [],
    });
    console.log("new data::::", productData);
    
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
        handleBusinessChange={handleBusinessChange}
        handleRegionsChange={handleRegionsChange}
      />
    </>
  );
}
