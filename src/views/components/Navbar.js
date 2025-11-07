import React, { useState, useContext } from "react";
import { 
  Navbar as BSNavbar, 
  Nav, 
  Container, 
  Form, 
  FormControl, 
  Button, 
  Dropdown, 
  Badge 
} from "react-bootstrap";
import { Link } from "react-router-dom";

// Context cho authentication và cart (sẽ tạo sau)
const AuthContext = React.createContext();
const CartContext = React.createContext();

// Mock authentication context
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

// Mock cart context
const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  
  return { cartItems, cartCount, addToCart, removeFromCart };
};

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, user, login, logout } = useAuth();
  const { cartCount } = useCart();
  React.useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (storedUser && !isLoggedIn) {
    login(storedUser); // cập nhật mock login
  }
}, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const handleLogin = () => {
    // Navigate to login page instead of mock login
    window.location.href = "/login";
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ padding: "8px 0" }}>
      <Container fluid className="px-4">
        {/* Logo và BookStore */}
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div style={{ 
            width: "32px", 
            height: "32px", 
            background: "linear-gradient(45deg, #fff, #f8f9fa, #e9ecef)", 
            borderRadius: "4px",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <i className="fas fa-book" style={{ color: "#333", fontSize: "16px" }}></i>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}>
            Trạm Đọc
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Search Bar */}
          <Form className="d-flex mx-auto" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Tìm kiếm sách..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "20px" }}
            />
            <Button 
              variant="outline-light" 
              type="submit"
              style={{ borderRadius: "20px", minWidth: "80px" }}
            >
              <i className="fas fa-search"></i>
            </Button>
          </Form>

          {/* Navigation Links */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Product List */}
            <Nav.Link href="#products" className="me-3">
              <i className="fas fa-list me-1"></i>
              Danh Mục Sách
            </Nav.Link>

            {/* Conditional rendering based on login status */}
            {isLoggedIn ? (
              <>
                {/* My Orders */}
                <Nav.Link href="#orders" className="me-3">
                  <i className="fas fa-shopping-bag me-1"></i>
                  Đơn Hàng
                </Nav.Link>

                {/* My Cart */}
                <Nav.Link href="#cart" className="me-3 position-relative">
                  <i className="fas fa-shopping-cart me-1"></i>
                  Giỏ Hàng
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

                {/* User Profile Dropdown */}
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
                      Hồ Sơ
                    </Dropdown.Item>
                    <Dropdown.Item href="#settings">
                      <i className="fas fa-cog me-2"></i>
                      Cài Đặt
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Đăng Xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  onClick={handleLogin}
                  style={{ borderRadius: "20px" }}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Đăng Nhập
                </Button>
                
                {/* Register Button */}
                <Button 
                  variant="light"
                  style={{ borderRadius: "20px", color: "#333" }}
                  onClick={() => window.location.href = "/register"}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Đăng Ký
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

// Export contexts và components
export default Navbar;
export { AuthContext, CartContext, useAuth, useCart };
