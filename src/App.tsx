import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./layouts/PageHeader";
import { ProductProvider } from "./Context/ProductPageContext";
import { StatusPage } from "./pages/StatusPage";

function App() {
  return (
    <div>
      <ProductProvider>
        <PageHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </ProductProvider>
    </div>
  );
}

export default App;
