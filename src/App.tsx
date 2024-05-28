import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./layouts/PageHeader";
import { ProductDisplayAndEdit } from "./pages/PDP";
import { ProductProvider } from "./Context/ProductPageContext";

function App() {
  return (
    <div>
      <ProductProvider>
        <PageHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDisplayAndEdit />} />
        </Routes>
      </ProductProvider>
    </div>
  );
}

export default App;
