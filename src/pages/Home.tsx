import { useState } from "react";
import { AddProduct } from "../components/AddProduct";
import { ProductCard } from "../components/ProductCard";
// import { ProductProps } from "../types/types";
import { Button } from "react-bootstrap";
import { FilterProduct, FilterOptions } from "../components/FilterProduct";
import { useProductContext } from "../Context/ProductPageContext";

// type Product = ProductProps;

export function Home() {
  const { products, addProduct, deleteProduct } = useProductContext();

  const [filterOption, setFilterOption] =
    useState<FilterOptions>("--please select--");

  const handleFilterChange = (filter: FilterOptions) => {
    setFilterOption(filter);
  };

  const applyFilterAndSort = () => {
    switch (filterOption) {
      case "name":
        return true;
      case "business":
        return true;
      case "regions":
        return true;
      default:
        return true;
    }
  };

  const sortedProducts = products.filter(applyFilterAndSort).sort((a, b) => {
    if (filterOption === "name") {
      const nameA = typeof a.name === "string" ? a.name.toLowerCase() : "";
      const nameB = typeof b.name === "string" ? b.name.toLowerCase() : "";
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    } else if (filterOption === "business") {
      const businessA = a.business.length;
      const businessB = b.business.length;
      if (businessA < businessB) {
        return -1;
      }
      if (businessA > businessB) {
        return 1;
      }
    } else if (filterOption === "regions") {
      const regionsA = a.regions.length;
      const regionsB = b.regions.length;
      if (regionsA < regionsB) {
        return -1;
      }
      if (regionsA > regionsB) {
        return 1;
      }
    }
    return 0;
  });

  return (
    <>
      <div className="d-flex align-items-center">
        <AddProduct onSubmit={addProduct} title="Add New Product" />
        <FilterProduct onFilterChange={handleFilterChange} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sortedProducts.map((product) => (
          <div style={{ margin: "10px" }} key={product.id}>
            <ProductCard {...product} withLink />
            <Button
              style={{ marginLeft: "0.7rem" }}
              variant="outline-danger"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
