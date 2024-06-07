// src/pages/StatusPage.tsx
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useProductContext } from "../Context/ProductPageContext";
import { ProductProps } from "../types/types";
import { MultiSelectDropdown, Option } from "../components/MultiSelectDropdown";
import { ProductForm } from "../components/ProductForm";
import { useNavigate, useLocation } from "react-router-dom";

export function StatusPage() {
  const { products, approveProductStep, rejectProduct, addProduct, updateProduct } = useProductContext();
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<Option[] | null>(null);
  const [statusData, setStatusData] = useState<ProductProps[]>(products);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setStatusData(products);
  }, [products]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("editProductId");
    if (productId) {
      const productToEdit = products.find(product => product.id === productId);
      setEditingProduct(productToEdit || null);
    } else {
      setEditingProduct(null);
    }
  }, [location.search, products]);

  const handleApproveStepChange = async (
    productId: string,
    step: "step1" | "step2"
  ) => {
    try {
      await approveProductStep(productId, step);
      if (step === "step2") {
        setStatusData((prevStatusData) =>
          prevStatusData.filter((product) => product.id !== productId)
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleRejectStatusChange = async (
    productId: string,
    status: "rejected"
  ) => {
    try {
      await rejectProduct(productId, status);
      setStatusData((prevStatusData) =>
        prevStatusData.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleStatusFilterChange = (selectedOptions: Option[] | null) => {
    setSelectedStatusFilters(selectedOptions);
  };

  const handleFormSubmit = (product: ProductProps) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    navigate('/status');
  };

  const filteredProducts =
    selectedStatusFilters && selectedStatusFilters.length > 0
      ? statusData.filter((product) =>
          selectedStatusFilters.some(
            (filter) => filter.value === product.status
          )
        )
      : statusData;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-4 w-full flex justify-center items-center sticky top-0 z-50">
        <p className="mx-2">Filter Status :</p>
        <MultiSelectDropdown
          options={["active", "pending", "rejected", "deleted"]}
          placeholder="Select Status"
          onChange={handleStatusFilterChange}
          value={selectedStatusFilters}
        />
      </div>
      <div className="flex justify-center flex-col">
        {editingProduct ? (
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            title="Edit Product"
          />
        ) : (
          <ProductForm
            onSubmit={handleFormSubmit}
            title="Add New Product"
          />
        )}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                Product
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                Status
              </th>
              <th className="py-2 px-4 border-b-2 border-gray-200 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  {product.status}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  <div className="inline-flex">
                    <Button
                      variant="outline-primary"
                      disabled={["active", "rejected", "deleted"].includes(
                        product.status
                      )}
                      className="mr-2"
                      onClick={() =>
                        handleApproveStepChange(product.id, "step1")
                      }
                    >
                      Approve Step 1
                    </Button>
                    <Button
                      variant="outline-primary"
                      disabled={["active", "rejected", "deleted"].includes(
                        product.status
                      )}
                      className="mr-2"
                      onClick={() =>
                        handleApproveStepChange(product.id, "step2")
                      }
                    >
                      Approve Step 2
                    </Button>
                    <Button
                      variant="outline-danger"
                      disabled={["active", "rejected", "deleted"].includes(
                        product.status
                      )}
                      onClick={() =>
                        handleRejectStatusChange(product.id, "rejected")
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate(`/status?editProductId=${product.id}`)}
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
