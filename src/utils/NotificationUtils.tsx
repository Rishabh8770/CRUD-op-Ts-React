import { OctagonAlert } from "lucide-react";
import { Button } from "react-bootstrap";
import { toast, ToastOptions } from "react-toastify";

const options: ToastOptions = {
  position: "bottom-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifyAddProduct = () => {
  toast.success("Product added successfully!", options);
};

export const notifyErrorAddingProduct = () => {
  toast.error("There is an error on adding the product", options);
};

export const notifyEditProduct = () => {
  toast.info("Product edited successfully!", options);
};

export const notifyErrorEditingProduct = () => {
  toast.error("There is an error on Editing the product", options);
};

export const notifyMandatoryWarn = () => {
  toast.warn("Please fill all the mandatory field(s)", options);
};

export const notifyDeleteProduct = (
  _id: string,
  deleteCallback: () => void
) => {
  const confirmDelete = () => {
    deleteCallback();
    toast.dismiss();
    toast.success("Product deleted successfully!", options);
  };

  const cancelDelete = () => {
    toast.dismiss();
    toast.error("Deletion Cancelled", options);
  };

  const DeleteConfirmation = () => (
    <div className="p-1">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <OctagonAlert color="#f20202" />
        <p className="mx-2 mb-0">
          Are you sure you want to delete this product?
        </p>
      </div>
      <div className="m-2 d-flex align-items-center justify-content-center">
        <Button
          className="mx-2"
          variant="outline-danger"
          onClick={confirmDelete}
        >
          Yes
        </Button>
        <Button variant="outline-primary" onClick={cancelDelete}>
          No
        </Button>
      </div>
    </div>
  );

  toast(<DeleteConfirmation />, {
    ...options,
    position: "top-center",
    autoClose: false,
    style: {
      width: "35rem",
      fontSize: "1.2rem",
      right: "7.5rem",
    },
  });
};

export const notifyDeletionError = () => {
  toast.error("Error deleting a product", options);
};
