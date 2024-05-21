import { Trash2 } from "lucide-react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  withLink: boolean;
  deleteProduct: (id: string) => void;
  isDelete: boolean
};

export function ProductCard({
  id,
  name,
  business,
  regions,
  withLink = true,
  isDelete = true,
  deleteProduct,
}: ProductListProps) {

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteProduct(id);
  };

  const cardContent = (
    <Card
      style={{
        width: "17rem",
        boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1)",
        height: "15rem",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <div className="d-flex flex-column">
          <div className="my-4">
            <Card.Text>
              <strong>Business :</strong> {business.join(", ")}
            </Card.Text>
          </div>
          <div>
            <Card.Text>
              <strong>Regions :</strong> {regions.join(", ")}
            </Card.Text>
          </div>
        </div>
        {isDelete && <Trash2
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={handleDelete}
        />}
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
      <div key={id} style={{ margin: "10px" }}>
        {cardContent}
      </div>
    );
  }
}
