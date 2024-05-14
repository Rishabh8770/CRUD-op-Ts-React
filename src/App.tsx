import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./layouts/PageHeader";
import { ProductDisplayAndEdit } from "./pages/PDP";
import { useState } from "react";
import { ProductProvider } from "./Context/ProductPageContext";
import { productData } from "./data/productData";

type ProductProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
};

function App() {
  const [products, setProducts] = useState<ProductProps[]>(productData);

  const handleSubmit = (editedProduct: ProductProps) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    localStorage.setItem("productData", JSON.stringify([...products]));
  };
  return (
    <>
      <ProductProvider>
        <PageHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/product/:id"
            element={<ProductDisplayAndEdit onSubmit={handleSubmit} />}
          ></Route>
        </Routes>
      </ProductProvider>
    </>
  );
}

export default App;
