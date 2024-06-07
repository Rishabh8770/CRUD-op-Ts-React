import { Trash2 } from "lucide-react";
import Card from "react-bootstrap/Card";
import { notifyDeleteProduct } from "../utils/NotificationUtils";
import { Link } from 'react-router-dom';

type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  deleteProduct: (id: string) => void;
  isDelete: boolean;
  status: string;
  onEdit: (id: string) => void; // Add onEdit prop
};

export function ProductCard({
  id,
  name,
  business,
  regions,
  isDelete = true,
  deleteProduct,
  status,
  onEdit, // Destructure onEdit prop
}: ProductListProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    notifyDeleteProduct({ id, name }, () => deleteProduct(id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(id); // Call onEdit with product ID
  };

  const cardContent = (
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
            <p
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
            </p>
          </Card.Text>
        </div>
        <Link to='/status' onClick={handleEdit} className="underline hover:text-blue-600">Edit</Link>
        <div className="absolute bottom-3 right-2 cursor-pointer">
          {isDelete && <Trash2 onClick={handleDelete} />}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div key={id} className="m-3">
      {cardContent}
    </div>
  );
}
