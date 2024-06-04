import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useProductContext } from "../Context/ProductPageContext";
import { ProductProps } from "../types/types";
import { MultiSelectDropdown, Option } from "../components/MultiSelectDropdown";

export function StatusPage() {
  const { products, approveProduct, rejectProduct } = useProductContext();
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<Option[] | null>(null);
  const [statusData, setStatusData] = useState<ProductProps[]>(products);

  useEffect(() => {
    setStatusData(products);
  }, [products]);

  const handleApproveStatusChange = async (
    productId: string,
    status: "active"
  ) => {
    try {
      await approveProduct(productId, status);
      setStatusData((prevStatusData) =>
        prevStatusData.filter((product) => product.id !== productId)
      );
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

  const filteredProducts = selectedStatusFilters && selectedStatusFilters.length > 0
  ? statusData.filter(product => selectedStatusFilters.some(filter => filter.value === product.status))
  : statusData;


  return (
    <div className="flex justify-center flex-col">
      <div className="mb-4 w-full flex justify-center items-center">
        <p className="mx-2">Filter Status :</p>
        <MultiSelectDropdown
          options={['active', 'pending', 'rejected', 'delete_pending', 'deleted']}
          placeholder="Select Status"
          onChange={handleStatusFilterChange}
          value={selectedStatusFilters}
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Product</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Status</th>
            <th className="py-2 px-4 border-b-2 border-gray-200 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.name}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">{product.status}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-center">
                <div className="inline-flex">
                  <Button variant="outline-primary" disabled={product.status === "active" || product.status === "rejected" || product.status === "deleted"} className="mr-2" onClick={() => handleApproveStatusChange(product.id, 'active')}>Approve</Button>
                  <Button variant="outline-danger" disabled={product.status === "active" || product.status === "rejected" || product.status === "deleted"} onClick={() => handleRejectStatusChange(product.id, 'rejected')}>Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
