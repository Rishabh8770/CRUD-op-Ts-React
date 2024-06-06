import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useProductContext } from "../Context/ProductPageContext";
import { ProductProps } from "../types/types";
import { MultiSelectDropdown, Option } from "../components/MultiSelectDropdown";

export function StatusPage() {
  const { products, approveProductStep, rejectProduct } = useProductContext();
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<
    Option[] | null
  >(null);
  const [statusData, setStatusData] = useState<ProductProps[]>(products);

  useEffect(() => {
    setStatusData(products);
  }, [products]);

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
                      disabled={["active", "rejected", "deleted",  "approval_pending",
                      "delete_approval_pending"].includes(
                        product.status
                      )}
                      className="mr-2"
                      onClick={() =>
                        handleApproveStepChange(product.id, "step1")
                      }
                    >
                      Approve-1
                    </Button>
                    <Button
                      variant="outline-primary"
                      disabled={["active", "rejected", "deleted", "pending", "delete_pending"].includes(
                        product.status
                      )}
                      className="mr-2"
                      onClick={() =>
                        handleApproveStepChange(product.id, "step2")
                      }
                    >
                      Approve-2
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
