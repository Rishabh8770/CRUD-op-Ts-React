import { useState } from "react";
import { AddProduct } from "../components/AddProduct";
import { ProductCard } from "../components/ProductCard";
import { ProductProps } from "../types/types";
import { SortProduct, SortOptions } from "../components/SortProduct";
import { useProductContext } from "../Context/ProductPageContext";
import { SearchProduct } from "../components/SearchProduct";
import { MultiSelectDropdown, Option } from "../components/MultiSelectDropdown";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

export function Home() {
  const { products, addProduct, deleteProduct } = useProductContext();

  const [searchProduct, setSearchProduct] = useState("");
  const [sortOption, setSortOption] =useState<SortOptions>("--please select--");
  const [selectBusinessOptions, setSelectBusinessOptions] = useState<Option[] | null>(null);
  const [selectRegionOptions, setSelectRegionOptions] = useState<Option[] | null>(null);
  const [filter, setFilter] = useState<'active'|'non-active'>('active')

  const handleSelectBusinessFilterChange = (selectedOptions: Option[] | null) => {
    setSelectBusinessOptions(selectedOptions);
  };

  const handleSelectRegionFilterChange = (selectedOptions: Option[] | null) => {
    setSelectRegionOptions(selectedOptions);
  };

  const handleSearch = (value: string) => {
    setSearchProduct(value);
  };

  const handleProductSort = (sortProduct: SortOptions) => {
    setSortOption(sortProduct);
  };

  const toggleFilter = () => {
    setFilter(prevFilter => prevFilter === 'active'? 'non-active': 'active');
  }

  const applyFilterAndSort = (product: ProductProps) => {
    if (!product) return false;

    if(filter === 'active' && product.status !== 'active') return false;
    if(filter==='non-active' && product.status === 'active') return false;

    if (searchProduct && !product.name.toLowerCase().includes(searchProduct.toLowerCase())) {
      return false;
    }

    if (selectBusinessOptions && selectBusinessOptions.length > 0 && !selectBusinessOptions.every((option) => product.business.includes(option.value))) {
        return false;
    }

    if (selectRegionOptions && selectRegionOptions.length > 0 && !selectRegionOptions.every((option) => product.regions.includes(option.value))) {
      return false;
    }

    return true;
  };

  const handleDelete = (id:string) => {
    
        deleteProduct(id)
    
  }

  const sortedAndFilteredProducts = products
    .filter(applyFilterAndSort)
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "business") {
        return a.business.join("").localeCompare(b.business.join(""));
      } else if (sortOption === "regions") {
        return a.regions.join("").localeCompare(b.regions.join(""));
      }
      return 0;
    });

    const containerVariants = {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    };
  
    const itemVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    };
  

  const businessOptions: string[] = [
    ...new Set(products.filter(Boolean).flatMap((product) => product.business)),
  ]; 
  const regionOptions: string[] = [
    ...new Set(products.filter(Boolean).flatMap((product) => product.regions)),
  ]; 
  
  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
        <div className="">
          <AddProduct onSubmit={addProduct} title="Add New Product" />
        </div>
        <SortProduct onProductSort={handleProductSort} />
        <div className="d-flex m-2 align-items-center">
          Filter By:
          <div
            className="d-flex border align-items-center mx-2 p-2"
            style={{ borderRadius: "10px", background:'#fff' }}
          >
            <SearchProduct
              placeholder="Search Product"
              onSearch={handleSearch}
            />
            <div className="d-flex align-items-center">
              <h6 className="mx-2 mb-0">Business:</h6>
              <MultiSelectDropdown
                options={businessOptions}
                placeholder="Select Business"
                onChange={handleSelectBusinessFilterChange}
                value={selectBusinessOptions}
              />
            </div>
            <div className="d-flex align-items-center">
              <h6 className="mx-2 mb-0">Regions:</h6>
              <MultiSelectDropdown
                options={regionOptions}
                placeholder="Select Regions"
                onChange={handleSelectRegionFilterChange}
                value={selectRegionOptions}
              />
            </div>
          </div>
        </div>
        <div>
          <Button onClick={toggleFilter}>Show {filter === 'active' ? 'Request List' : 'Active Products'}</Button>
        </div>
      </div>
      <motion.div
        className="d-flex flex-wrap mt-4 justify-content-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedAndFilteredProducts.length > 0 ? (
          sortedAndFilteredProducts.map((product) => (
            <motion.div
              key={product.id}
              style={{ margin: "10px" }}
              variants={itemVariants}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                business={product.business}
                regions={product.regions}
                withLink
                deleteProduct={handleDelete}
                isDelete
                status={product.status}
              />
            </motion.div>
          ))
        ) : (
          <div
            className="w-100 d-flex justify-content-center"
            style={{ marginTop: "10%" }}
          >
            <h4>No Card found</h4>
          </div>
        )}
      </motion.div>
    </div>
  );
}