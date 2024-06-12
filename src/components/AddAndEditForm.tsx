import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useProductContext } from "../Context/ProductPageContext";
import { ProductProps } from "../types/types";

type ProductControlProps = {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  title: string;
  newProduct: ProductProps;
  editMode: boolean;
  handleBusinessChange: (selectedOptions: Option[] | null) => void;
  handleRegionsChange: (selectedOptions: Option[] | null) => void;
  readOnly?: boolean;
};

function AddAndEditForm({
  handleInputChange,
  handleSubmit,
  title,
  newProduct,
  editMode,
  handleBusinessChange,
  handleRegionsChange,
  readOnly = false,
}: ProductControlProps) {
  const { products } = useProductContext();
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (editMode) return;
    const requiredFieldsFilled =
      newProduct.name.trim() !== "" &&
      newProduct.business.length > 0 &&
      newProduct.regions.length > 0;
    setAllFieldsFilled(requiredFieldsFilled);
  }, [newProduct.name, newProduct.business, newProduct.regions, editMode]);

  useEffect(() => {
    if (!editMode) return;
    const originalProduct = products.find(
      (product) => product.id === newProduct.id
    );

    if (!originalProduct) return;

    const arraysAreEqual = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);
      return arr1.every((item) => set2.has(item)) && arr2.every((item) => set1.has(item));
    };

    const changesDetected =
      !arraysAreEqual(originalProduct.business, newProduct.business) ||
      !arraysAreEqual(originalProduct.regions, newProduct.regions);

    if (changesMade !== changesDetected) {
      setChangesMade(changesDetected);
    }
  }, [newProduct.business, newProduct.regions, products, newProduct.id, editMode, changesMade]);

  const getUniqueOptions = useCallback((data: string[]): Option[] => {
    const uniqueOptions: Option[] = [];
    data.forEach((item) => {
      if (!uniqueOptions.some((option) => option.value === item)) {
        uniqueOptions.push({ value: item, label: item });
      }
    });
    return uniqueOptions;
  }, []);

  const businessOptions = useMemo(() => {
    return getUniqueOptions(products.flatMap((product) => product.business));
  }, [products, getUniqueOptions]);

  const regionsOptions = useMemo(() => {
    return getUniqueOptions(products.flatMap((product) => product.regions));
  }, [products, getUniqueOptions]);

  return (
    <div className="container border rounded my-4">
      <label className="text-3xl my-3">{title}</label>
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
            readOnly={readOnly}
          />
        </Form.Group>
      )}
      <Form.Group controlId="business">
        <Form.Label>
          Business<span className="text-danger">*</span>
        </Form.Label>
        <MultiSelectDropdown
          options={businessOptions.map((business) => business.value)}
          placeholder="Select Business"
          onChange={handleBusinessChange}
          value={newProduct.business.map((business) => ({
            value: business,
            label: business,
          }))}
          isDisabled={readOnly}
        />
      </Form.Group>
      <Form.Group controlId="regions" className="mb-2">
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
          isDisabled={readOnly}
        />
      </Form.Group>
      {!readOnly && (
        <Button
          variant="primary"
          className="my-3"
          onClick={handleSubmit}
          disabled={
            (editMode && !changesMade) || (!editMode && !allFieldsFilled)
          }
        >
          {title}
        </Button>
      )}
    </div>
  );
}

export default AddAndEditForm;
