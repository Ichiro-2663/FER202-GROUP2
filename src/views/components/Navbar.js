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
  Modal,
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
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

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
  const handleShowProfile = () => {
    setFormData(user);
    setShowProfileModal(true);
  };
  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setEditMode(false);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- Update user info ----------
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        login(formData);
        setEditMode(false);
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed!");
    }
  };

  // ---------- Become a seller ----------
  const handleBecomeSeller = async () => {
  if (user.role === "seller") {
    alert("✅ You are already a seller!");
    return;
  }

  if (user.status === "requested") {
    alert("⏳ Your request is pending admin approval.");
    return;
  }

  try {
    const updated = { ...user, status: "requested" };
    const res = await fetch(`http://localhost:9999/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert("📩 Your request to become a seller has been sent for approval!");
      login(updated);
      setFormData(updated);
    } else {
      alert("❌ Failed to send request!");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Server connection failed!");
  }
};



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
  <Dropdown.Item onClick={handleShowProfile}>
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
      <Modal show={showProfileModal} onHide={handleCloseProfile} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={formData.email || ""} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!editMode ? (
            <>
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Update
              </Button>
              <Button variant="warning" onClick={handleBecomeSeller}>
                Become a Seller
              </Button>
            </>
          ) : (
            <>
              <Button variant="success" onClick={handleUpdate}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </BSNavbar>
  );
}

export default Navbar;
export { AuthContext, CartContext, useAuth, useCart };
