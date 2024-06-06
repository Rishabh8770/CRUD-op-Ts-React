import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
import { Option } from "./MultiSelectDropdown";
import {
  notifyAddProduct,
  notifyErrorAddingProduct,
  notifyMandatoryWarn,
} from "../utils/NotificationUtils";
import {NotificationContainer} from './UserFeedbacks'
import AddAndEditForm from "./AddAndEditForm";

/* type ButtonProps = {
  // title: string;
  onSubmit: (newProduct: ProductProps) => void;
  product?: ProductProps;
}; */

export function AddProduct() {
  const [newProduct, setNewProduct] = useState<ProductProps>({
    id: uuidv4(),
    name: "",
    business: [],
    regions: [],
    status: "pending"
  });

  const { addProduct } = useProductContext();

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
    if (
      !newProduct.name || newProduct.business.length === 0 || newProduct.regions.length === 0) {
      notifyMandatoryWarn();
      return;
    }

    try {
      // throw new Error("Error adding product") // simulating an error to test notify Error
      await addProduct(newProduct);
      setNewProduct({
        id: uuidv4(),
        name: "",
        business: [],
        regions: [],
        status: newProduct.status
      });
      notifyAddProduct();
    } catch (error) {
      notifyErrorAddingProduct();
      // handleClose();

      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      <AddAndEditForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        title="Add Product"
        newProduct={newProduct}
        editMode={false}
        handleBusinessChange={handleBusinessChange}
        handleRegionsChange={handleRegionsChange}
      />
      <NotificationContainer />
    </>
  );
}