import { Button } from "react-bootstrap";
import { ProductProps } from "../types/types";

import { useNavigate } from "react-router-dom";

type ButtonProps = {
  title: string;
  onSubmit: (newProduct: ProductProps) => void;
  product?: ProductProps;
};

export function AddProduct({ title }: ButtonProps) {
  const navigate = useNavigate();

  const handleAddProductClick = () => {
    navigate("/status", { state: { addingNewProduct: true } });
  };

  return (
    <>
      <div className="mx-3">
        <Button variant="success" onClick={handleAddProductClick}>
          {title}
        </Button>
      </div>
    </>
  );
}
