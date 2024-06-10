import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddAndEditForm from "../components/AddAndEditForm";
import { v4 as uuidv4 } from "uuid";
import { MultiSelectDropdown, Option } from "../components/MultiSelectDropdown";
import { ProductProps } from "../types/types";
import {
  notifyMandatoryWarn,
  notifyAddProduct,
  notifyErrorAddingProduct,
  notifyEditProduct,
  notifyErrorEditingProduct,
} from "../utils/NotificationUtils";
import { useProductContext } from "../Context/ProductPageContext";
import { Button } from "react-bootstrap";
import React from "react";
import { NotificationContainer } from "../components/UserFeedbacks";
import { ArrowLeft } from "lucide-react";

type LocationState = {
  product?: ProductProps;
  editingProduct?: boolean;
  addingNewProduct?: boolean;
  viewOnly?: boolean;
  viewOnlyStatus?: boolean;
};

export function StatusPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  const editingProduct = state?.editingProduct || false;
  const viewOnly = state?.viewOnly || false;
  const viewOnlyStatus = state?.viewOnlyStatus || false;
  const productToEdit = state?.product;
  const {
    addProduct,
    updateProduct,
    products,
    approveProductStep,
    rejectProduct,
  } = useProductContext();
  const navigate = useNavigate();

  const [selectedStatusFilters, setSelectedStatusFilters] = useState<
    Option[] | null
  >(null);
  const [statusData, setStatusData] = useState<ProductProps[]>(products);

  const initialProductState: ProductProps = {
    id: uuidv4(),
    name: "",
    business: [],
    regions: [],
    status: "pending",
  };

  const [newProduct, setNewProduct] = useState<ProductProps>(
    productToEdit || initialProductState
  );

  useEffect(() => {
    if (productToEdit) {
      setNewProduct(productToEdit);
    }
    setStatusData(products);
  }, [productToEdit, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleBusinessChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions) {
      setNewProduct({
        ...newProduct,
        business: selectedOptions.map((option) => option.value),
      });
    }
  };

  const handleRegionsChange = (selectedOptions: Option[] | null) => {
    if (selectedOptions) {
      setNewProduct({
        ...newProduct,
        regions: selectedOptions.map((option) => option.value),
      });
    }
  };

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

  const handleArrowClick = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    if (newProduct.business.length === 0 || newProduct.regions.length === 0) {
      notifyMandatoryWarn();
      return;
    }

    try {
      if (editingProduct) {
        newProduct.status = "pending";
        await updateProduct(newProduct);
        setNewProduct(newProduct);
        notifyEditProduct();
      } else {
        await addProduct(newProduct);
        setNewProduct(initialProductState);
        notifyAddProduct();
      }
    } catch (error) {
      if (editingProduct) {
        notifyErrorEditingProduct();
      } else {
        notifyErrorAddingProduct();
      }
      console.error("Error:", error);
    }
  };

  const productDetailsBlock = productToEdit && (
    <div className="container">
    <p className="text-3xl my-2">Product Details :</p>
    <div className="mb-4 p-4 border border-gray-200 rounded">
      <h2 className="text-xl font-bold mb-4 underline">{productToEdit.name}</h2>
      <p>
        <strong>Business:</strong> {productToEdit.business.join(", ")}
      </p>
      <p className="my-4">
        <strong>Regions:</strong> {productToEdit.regions.join(", ")}
      </p>
      <p>
        <strong>Status:</strong> {productToEdit.status}
      </p>
    </div>
    </div>
  );

  const statusView = (
    <>
      <div className="mb-4 w-full flex justify-center items-center">
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
            {filteredProducts.length !== 0
              ? filteredProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr>
                      <td
                        className="py-2 px-4 border-b border-gray-200 text-center font-bold"
                        rowSpan={2}
                      >
                        <strong>{product.name}</strong>
                      </td>
                      <td
                        className="py-2 px-4 border-b border-gray-200 text-center"
                        rowSpan={2}
                      >
                        {product.status}
                      </td>
                      <td className="py-2 px-4 border border-gray-200 text-center">
                        <div className="flex justify-center items-center">
                          <span className="mx-4">Approval-1</span>

                          <Button
                            variant="outline-primary"
                            disabled={[
                              "active",
                              "rejected",
                              "deleted",
                              "approval_pending",
                              "delete_approval_pending",
                            ].includes(product.status)}
                            className="mr-2"
                            onClick={() =>
                              handleApproveStepChange(product.id, "step1")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline-danger"
                            disabled={[
                              "active",
                              "rejected",
                              "deleted",
                            ].includes(product.status)}
                            onClick={() =>
                              handleRejectStatusChange(product.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border border-gray-200 text-center">
                        <div className="flex justify-center items-center">
                          <span className="mx-4">Approval-2</span>
                          <Button
                            variant="outline-primary"
                            disabled={[
                              "active",
                              "rejected",
                              "deleted",
                              "pending",
                              "delete_pending",
                            ].includes(product.status)}
                            className="mr-2"
                            onClick={() =>
                              handleApproveStepChange(product.id, "step2")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline-danger"
                            disabled={[
                              "active",
                              "rejected",
                              "deleted",
                            ].includes(product.status)}
                            onClick={() =>
                              handleRejectStatusChange(product.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              : "No product with filtered status"}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <>
      <div className="px-10">
        <ArrowLeft
          width={50}
          height={30}
          onClick={handleArrowClick}
          className="cursor-pointer border rounded"
        />
      </div>
      {viewOnlyStatus && (
        <div>{statusView}</div>
      )}
      {viewOnly ? (
        <div className="h-full overflow-y-auto">
          {productDetailsBlock}
          <div>{statusView}</div>
        </div>
      ) : (
        <div className="h-full overflow-y-auto">
          <AddAndEditForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            title={editingProduct ? "Edit Product" : "Add New Product"}
            newProduct={newProduct}
            editMode={editingProduct}
            handleBusinessChange={handleBusinessChange}
            handleRegionsChange={handleRegionsChange}
          />
          <div>{statusView}</div>
          <NotificationContainer />
        </div>
      )}
    </>
  );
}
