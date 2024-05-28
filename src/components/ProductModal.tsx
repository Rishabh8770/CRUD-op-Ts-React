import React, { useMemo } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { ProductProps } from "../types/types";
import { useProductContext } from "../Context/ProductPageContext";
// import { productData } from "../data/productData";

type ProductModalProps = {
  showModal: boolean;
  handleCloseModal: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  title: string;
  newProduct: ProductProps;
  editMode: boolean;
  handleBusinessChange: (selectedOptions: Option[] | null) => void;
  handleRegionsChange: (selectedOptions: Option[] | null) => void;
};

export function ProductModal({
  showModal,
  handleCloseModal,
  handleInputChange,
  handleSubmit,
  title,
  newProduct,
  editMode,
  handleBusinessChange,
  handleRegionsChange,
}: ProductModalProps) {
  const {products} = useProductContext()

  const getUniqueOptions = (data: string[]): Option[] => {
    const uniqueOptions: Option[] = [];
    data.forEach((item) => {
      if (!uniqueOptions.some((option) => option.value === item)) {
        uniqueOptions.push({ value: item, label: item });
      }
    });
    return uniqueOptions;
  };

  const businessOptions = useMemo(() => {
    return getUniqueOptions(products.flatMap((product) => product.business));
  }, [products]);

  const regionsOptions = useMemo(() => {
    return getUniqueOptions(products.flatMap((product) => product.regions));
  }, [products]);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <div className="m-3 mb-0">
        <p className="text-xl">
          (<span className="text-danger">*</span>) Mandatory Fields
        </p>
      </div>
      <Modal.Body>
        <Form>
          {!editMode && (
            <Form.Group controlId="productName">
              <Form.Label>
                Product Name<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </Form.Group>
          )}

          <Form.Group controlId="business">
            <Form.Label>
              Business<span className="text-danger">*</span>
            </Form.Label>
            <MultiSelectDropdown
              options={businessOptions.map((business) => business.value)}
              placeholder="Select Buisness"
              onChange={handleBusinessChange}
              value={newProduct.business.map((business) => ({
                value: business,
                label: business,
              }))}
            />
          </Form.Group>
          <Form.Group controlId="regions">
            <Form.Label>
              Regions<span className="text-danger">*</span>
            </Form.Label>
            <MultiSelectDropdown
              options={regionsOptions.map((region) => region.value)}
              placeholder="Select Regions"
              onChange={handleRegionsChange}
              value={newProduct.regions.map((region) => ({
                value: region,
                label: region,
              }))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {title}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
