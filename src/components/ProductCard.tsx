import { Trash2 } from "lucide-react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { notifyDeleteProduct } from "../utils/NotificationUtils";
import { Button } from "react-bootstrap";

type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  withLink: boolean;
  deleteProduct: (id: string) => void;
  isDelete: boolean;
  status: string;
};

export function ProductCard({
  id,
  name,
  business,
  regions,
  withLink = true,
  isDelete = true,
  deleteProduct,
  status,
}: ProductListProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    notifyDeleteProduct({ id, name }, () => deleteProduct(id));
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
        <div>
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
        <Link to='/status' className="mt-2">
          <Button variant="outline-primary">Edit</Button>
        </Link>
        <div className="absolute bottom-3 right-2">
          {isDelete && <Trash2 onClick={handleDelete} />}
        </div>
      </Card.Body>
    </Card>
  );

  if (withLink) {
    return (
      <div key={id} className="m-3">
        <Link to={`/product/${id}`} style={{ textDecoration: "none" }}>
          {cardContent}
        </Link>
      </div>
    );
  } else {
    return (
      <div key={id} className="m-3">
        {cardContent}
      </div>
    );
  }
}
