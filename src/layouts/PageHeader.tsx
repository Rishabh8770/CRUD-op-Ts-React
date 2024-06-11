import { Navbar as NavbarBs, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export function PageHeader() {
  return (
    <NavbarBs sticky="top" className="bg-white shadow-sm mb-3 px-5">
      <NavbarBs.Brand href="/">Product-Page</NavbarBs.Brand>
      <Nav className="me-auto">
        <Nav.Link to="/" as={NavLink}>
          Home
        </Nav.Link>
        {/* <Nav.Link
          to="/status"
          as={NavLink}
          state={{
            viewOnlyStatus: true,
          }}
        >
          Product Status
        </Nav.Link> */}
      </Nav>
    </NavbarBs>
  );
}
