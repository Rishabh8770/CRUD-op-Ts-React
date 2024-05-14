import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productData } from "../data/productData";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Button } from "react-bootstrap";
import { ProductProps } from "../types/types";

type Product = ProductProps;

type ButtonProps = {
  onSubmit: (editedProduct: Product) => void;
  title: string;
};

export function ProductDisplay({ onSubmit, title }: ButtonProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(()=>{
    const storedProduct = localStorage.getItem("product_" + id);
    return storedProduct ? JSON.parse(storedProduct): undefined;
  })

  const [showModal, setShowModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | undefined>(
    product
  );

  useEffect(()=> {
    if(!product){
        const foundProduct = productData.find((prod)=> prod.id === id);
        if(foundProduct){
            setProduct(foundProduct)
            localStorage.setItem("product_"+id, JSON.stringify(foundProduct))
        }
    }
  }, [id, product])

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  if (editedProduct) {
    setEditedProduct({
      ...editedProduct,
      [name]:
        name === "name"
          ? value 
          : value.split(",").map((item) => item.trim()),
    });
  }
};

  const handleSubmit = () => {
    if (editedProduct) {
      onSubmit(editedProduct);
      localStorage.setItem("product_"+ id, JSON.stringify(editedProduct))
      console.log("Edited Product:", editedProduct);
      handleCloseModal();
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "50rem",
    backgroundColor: "#f8f9fa",
    border: "1px solid #dee2e6",
    borderRadius: "0.25rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: "1.25rem",
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
              editedProduct || { id: "", name: "", business: [], regions: [] }
            }
            editMode={true} 
          />
          <ProductCard
            id={product.id}
            name={product.name}
            business={product.business}
            regions={product.regions}
            withLink={false}
            customStyles={{ cardStyle, cardBodyStyle }}
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
