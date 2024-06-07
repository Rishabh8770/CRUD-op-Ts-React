// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ProductProps } from '../types/types';
import { MultiSelectDropdown, Option } from './MultiSelectDropdown';

type ProductFormProps = {
  product?: ProductProps | null;
  onSubmit: (product: ProductProps) => void;
  title: string;
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, title }) => {
  const [formData, setFormData] = useState<ProductProps>(
    product || { id: '', name: '', business: [], regions: [], status: 'pending' }
  );

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelectChange = (field: 'business' | 'regions', selectedOptions: Option[] | null) => {
    if (selectedOptions) {
      setFormData({ ...formData, [field]: selectedOptions.map(option => option.value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <Form.Group>
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Business</Form.Label>
        <MultiSelectDropdown
                  options={formData.business}
                  value={formData.business.map(value => ({ value, label: value }))}
                  onChange={selectedOptions => handleMultiSelectChange('business', selectedOptions)} placeholder={''}        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Regions</Form.Label>
        <MultiSelectDropdown
                  options={formData.regions}
                  value={formData.regions.map(value => ({ value, label: value }))}
                  onChange={selectedOptions => handleMultiSelectChange('regions', selectedOptions)} placeholder={''}        />
      </Form.Group>
      <Button type="submit">Submit</Button>
    </Form>
  );
};
