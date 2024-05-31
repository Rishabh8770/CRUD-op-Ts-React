import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./layouts/PageHeader";
import { ProductDisplayAndEdit } from "./pages/PDP";
import { ProductProvider } from "./Context/ProductPageContext";
import StatusUpDate from "./pages/StatusUpDate";

function App() {
  return (
    <div>
      <ProductProvider>
        <PageHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDisplayAndEdit />} />
          <Route path="/status" element={<StatusUpDate/>}/>
        </Routes>
      </ProductProvider>
    </div>
  );
}

export default App;
