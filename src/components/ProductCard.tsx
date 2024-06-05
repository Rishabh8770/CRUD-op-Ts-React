import { Trash2 } from "lucide-react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { notifyDeleteProduct } from "../utils/NotificationUtils";

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
    <Card className="w-[17rem] h-[17rem] overflow-y-hidden drop-shadow-xl">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <div className="d-flex flex-column">
          <div className="my-4 h-16">
            <Card.Text>
              <strong>Business :</strong> {business.join(", ")}
            </Card.Text>
          </div>
          <div>
            <Card.Text>
              <strong>Regions :</strong> {regions.join(", ")}
            </Card.Text>
          </div>
          <div>
            <Card.Text>
                <p
                  className={`absolute bottom-1 text-sm p-1 ${
                    status === "pending"
                      ? "text-gray-500 bg-gray-200"
                      : status === "active"
                      ? "text-green-500 bg-green-100"
                      : status === "rejected"
                      ? "text-red-500 bg-red-100"
                      : "no status"
                  }`}
                >
                  {status}
                </p>
            </Card.Text>
          </div>
        </div>
        {isDelete && (
          <Trash2
            className="absolute bottom-3 right-3 cursor-pointer"
            onClick={handleDelete}
          />
        )}
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
