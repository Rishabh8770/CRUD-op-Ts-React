import { Trash2, Edit } from "lucide-react";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import { notifyDeleteProduct } from "../utils/NotificationUtils";
import { ProductListProps } from "../types/types";
import { Button } from "react-bootstrap";
import {debounce} from 'lodash'

export function ProductCard({
  id,
  name,
  business,
  regions,
  isDelete = true,
  deleteProduct,
  status,
  isAddNewProduct = false,
}: ProductListProps) {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    debounce(() => {
      notifyDeleteProduct({ id, name }, () => deleteProduct(id));
    }, 500)();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/status", {
      state: {
        product: { id, name, business, regions, status },
        editingProduct: true,
        viewOnly: false,
      },
    });
  };

  const handleAddProductClick = () => {
    navigate("/status", { state: { addingNewProduct: true } });
  };

  if (isAddNewProduct) {
    return (
      <div className="overflow-y-hidden drop-shadow-xl flex items-center justify-center mt-3">
        <Button variant="success" onClick={handleAddProductClick}>
          <div>Add New Product</div>
        </Button>
      </div>
    );
  }

  const cardContent = (
    <>
      <Card className="w-[17rem] h-[22rem] overflow-y-hidden drop-shadow-xl">
        <Card.Body className="flex flex-col h-full">
          <Card.Title className="underline">{name}</Card.Title>
          <div className="d-flex flex-column flex-grow">
            <div className="my-4 h-16">
              <Card.Text>
                <strong>Business :</strong> {business.join(", ")}
              </Card.Text>
            </div>
            <div className="h-20">
              <Card.Text>
                <strong>Regions :</strong> {regions.join(", ")}
              </Card.Text>
            </div>
          </div>
          <div className="mb-4">
            <Card.Text>
              <span
                className={`text-base p-2 mb-2 text-center ${
                  status === "pending"
                    ? "text-gray-500 bg-gray-200"
                    : status === "active"
                    ? "text-green-500 bg-green-100"
                    : status === "rejected"
                    ? "text-red-500 bg-red-100"
                    : "text-white bg-gray-700"
                }`}
              >
                {status}
              </span>
            </Card.Text>
          </div>
          <div className="flex justify-between gap-2">
            <Edit onClick={handleEdit} />
            {isDelete && !["deleted", "delete_pending"].includes(status) && (
              <Trash2 onClick={handleDelete} />
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <div key={id} className="m-3">
      <Link
        to="/status"
        state={{
          product: { id, name, business, regions, status },
          viewOnly: true,
        }}
        style={{ textDecoration: "none" }}
      >
        {cardContent}
      </Link>
    </div>
  );
}
