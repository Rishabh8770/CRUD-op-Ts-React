import { useState } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";


type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  withLink: boolean;
};

export function ProductCard({
  id,
  name,
  business,
  regions,
  withLink = true,
}: ProductListProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    width: "17rem",
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1)",
    height: "15rem",
    transition: "transform 0.3s ease-in-out"
  };

  const hoverStyle = {
    transform: "scale(1.05)"
  };

  const combinedStyle = isHovered && withLink ? { ...baseStyle, ...hoverStyle } : baseStyle;

  const cardContent = (
    <Card
    style={combinedStyle}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <div className="d-flex flex-column">
          <div className="my-4">
            <Card.Text><strong>Business :</strong> {business.join(", ")}</Card.Text>
          </div>
          <div>
            <Card.Text><strong>Regions :</strong> {regions.join(", ")}</Card.Text>
          </div>
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
      <div key={id} style={{ margin: "10px" }}>
        {cardContent}
      </div>
    );
  }
}
