import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo-ss.png";
import useAuth from "../hooks/useAuth";

export default function NavigationBar() {
  const { isAuthenticated, role, loginAsAdmin, loginAsUser, logout } =
    useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Heritage Room Logo"
            width="auto"
            height="50"
            className="d-inline-block align-top me-2"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && role === "ADMIN" && (
              <>
                <Nav.Link as={Link} to="/rooms">
                  Rooms
                </Nav.Link>
                <Nav.Link as={Link} to="/bookings">
                  Bookings
                </Nav.Link>
                <Nav.Link as={Link} to="/clients">
                  Clients
                </Nav.Link>
              </>
            )}
            {isAuthenticated && role === "USER" && (
              <Nav.Link as={Link} to="/bookings">
                My Bookings
              </Nav.Link>
            )}
          </Nav>
          <div className="d-flex">
            {isAuthenticated ? (
              <Button variant="outline-danger" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-success"
                  className="me-2"
                  onClick={loginAsAdmin}
                >
                  Login Admin
                </Button>
                <Button variant="outline-primary" onClick={loginAsUser}>
                  Login User
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
