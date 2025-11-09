import React, { useState, useEffect } from "react";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchBooks } from "../../services/api";
const AuthContext = React.createContext();
const CartContext = React.createContext();

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
};

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return { cartItems, cartCount };
};

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { isLoggedIn, user, login, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error("Error loading books:", err);
      }
    };
    loadBooks();
  }, []);

  // ✅ Lấy user trong localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser && !isLoggedIn) login(storedUser);
  }, []);

  // ✅ Xử lý lọc realtime khi gõ
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks([]);
      setShowResults(false);
      return;
    }

    const results = books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredBooks(results);
    setShowResults(true);
  }, [searchQuery, books]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowResults(true);
  };

  const handleLogin = () => (window.location.href = "/login");

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ padding: "8px 0", position: "relative" }}>
      <Container fluid className="px-4">
        {/* Logo */}
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(45deg, #fff, #f8f9fa, #e9ecef)",
              borderRadius: "4px",
              marginRight: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-book" style={{ color: "#333", fontSize: "16px" }}></i>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}>
            The Reading Nook
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Search Bar */}
          <Form
            className="d-flex mx-auto position-relative"
            style={{ maxWidth: "400px", width: "100%" }}
            onSubmit={handleSearchSubmit}
          >
            <FormControl
              type="search"
              placeholder="Search books..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              style={{ borderRadius: "20px" }}
            />
            <Button variant="outline-light" type="submit" style={{ borderRadius: "20px", minWidth: "80px" }}>
              <i className="fas fa-search"></i>
            </Button>

            {/* Search Results Dropdown */}
            {showResults && (
              <ListGroup
                className="position-absolute bg-white shadow-sm"
                style={{
                  top: "45px",
                  width: "100%",
                  zIndex: 999,
                  borderRadius: "8px",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <ListGroup.Item
                      key={book.id}
                      action
                      onClick={() => {
                        window.location.href = `/book/${book.id}`;
                      }}
                    >
                      <strong>{book.title}</strong> <br />
                      <small className="text-muted">{book.author}</small>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center text-muted">
                    No related products found
                  </ListGroup.Item>
                )}
              </ListGroup>
            )}
          </Form>

          {/* Navigation Links */}
          <Nav className="ms-auto d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <Nav.Link href="#orders" className="me-3">
                  <i className="fas fa-shopping-bag me-1"></i>
                  Orders
                </Nav.Link>

                <Nav.Link href="#cart" className="me-3 position-relative">
                  <i className="fas fa-shopping-cart me-1"></i>
                  Cart
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: "10px" }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    id="user-dropdown"
                    className="text-decoration-none d-flex align-items-center"
                    style={{ border: "none", color: "#fff" }}
                  >
                    <i className="fas fa-user-circle" style={{ fontSize: "24px" }}></i>
                    <span className="ms-2 d-none d-md-inline">{user?.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#profile">
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item href="#settings">
                      <i className="fas fa-cog me-2"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  className="me-2"
                  onClick={handleLogin}
                  style={{ borderRadius: "20px" }}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Button>

                <Button
                  variant="light"
                  style={{ borderRadius: "20px", color: "#333" }}
                  onClick={() => (window.location.href = "/register")}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
export { AuthContext, CartContext, useAuth, useCart };
