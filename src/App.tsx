import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./layouts/PageHeader";
import { ProductDisplayAndEdit } from "./pages/PDP";
import { useState } from "react";

type ProductProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

function App() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  const handleSubmit = (editedProduct: ProductProps) => {
    // Update the product data in React state
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    localStorage.setItem("products", JSON.stringify(products));
  };
  return (
    <>
      <PageHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDisplayAndEdit  onSubmit={handleSubmit}/>}></Route>
      </Routes>
    </>
  );
}

export default App;
