import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-ss.png";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

export default function NavigationBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, role } = useSelector((state) => state.user);
  const isAuthenticated = !!email;

  console.log("Redux auth check:", { email, role }); // Debug

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

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

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-user"
                  className="d-flex align-items-center"
                >
                  <Image
                    src={`https://ui-avatars.com/api/?name=${email}&size=32&background=random`}
                    roundedCircle
                    className="me-2"
                  />
                  <span className="text-muted">{role}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="btn btn-outline-primary"
              >
                Login
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
