import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

type ProductModalProps = {
  showModal: boolean;
  handleCloseModal: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  title: string;
  newProduct: {
    name: string;
    business: string[];
    regions: string[];
  };
  editMode: boolean; 
};

export function ProductModal({
  showModal,
  handleCloseModal,
  handleInputChange,
  handleSubmit,
  title,
  newProduct,
  editMode,
}: ProductModalProps) {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {!editMode && (
            <Form.Group controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </Form.Group>
          )}
          <Form.Group controlId="business">
            <Form.Label>Business</Form.Label>
            <Form.Control
              type="text"
              name="business"
              value={newProduct.business.join(", ")}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="regions">
            <Form.Label>Regions</Form.Label>
            <Form.Control
              type="text"
              name="regions"
              value={newProduct.regions.join(", ")}
              onChange={handleInputChange}
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
