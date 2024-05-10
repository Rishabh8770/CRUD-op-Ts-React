import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  withLink: boolean;
  customStyles?: {
    cardStyle: React.CSSProperties;
    cardBodyStyle: React.CSSProperties;
  };
};

export function ProductList({
  id,
  name,
  business,
  regions,
  withLink = true,
  customStyles,
}: ProductListProps) {
  const cardStyle = customStyles?.cardStyle || {};
  const cardBodyStyle = customStyles?.cardBodyStyle || {};
  
  const cardContent = (
    <Card
      style={{
        ...cardStyle,
        width: "20rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        height:"10rem"
      }}
    >
      <Card.Body style={{ ...cardBodyStyle }}>
        <Card.Title>{name}</Card.Title>
        <Card.Text>Business: {business.join(", ")}</Card.Text>
        <Card.Text>Regions: {regions.join(", ")}</Card.Text>
      </Card.Body>
    </Card>
  );
  if (withLink) {
    return (
      <div key={id} style={{ margin: "10px" }}>
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
