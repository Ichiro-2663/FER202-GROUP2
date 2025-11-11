import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   // Simulate API call
  //   setTimeout(() => {
  //     if (formData.email && formData.password) {
  //       // Mock login success
  //       console.log("Login successful:", formData);
  //       navigate("/"); // Redirect to home page
  //     } else {
  //       setError("Vui lòng nhập đầy đủ thông tin");
  //     }
  //     setLoading(false);
  //   }, 1000);
  // };
  //  const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     // Gọi dữ liệu từ json-server
  //     const response = await fetch("http://localhost:9999/users");
  //     if (!response.ok) throw new Error("Không thể kết nối server");
  //     const users = await response.json();

  //     // Tìm user có email trùng
  //     const foundUser = users.find(
  //       (u) => u.email === formData.email && u.passwordHash === `$hashed$${formData.password}`
  //     );

  //     if (foundUser) {
  //       alert("Đăng nhập thành công!");
  //       // Lưu user vào localStorage (tùy chọn)
  //       localStorage.setItem("currentUser", JSON.stringify(foundUser));

  //       // Điều hướng về trang chủ
  //       navigate("/");
  //     } else {
  //       setError("Email hoặc mật khẩu không đúng!");
  //     }
  //   } catch (err) {
  //     setError("Lỗi kết nối đến server! Hãy chắc chắn json-server đang chạy.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://localhost:9999/users");
    if (!response.ok) throw new Error("Không thể kết nối server");

    const users = await response.json();

    // Find user with matching email
    const foundUser = users.find(
  (u) =>
    u.email === formData.email &&
    (u.password === formData.password ||
      u.passwordHash === formData.password)
);

   if (foundUser) {
  if (foundUser.role === "seller" && foundUser.status !== "approved") {
    alert("⏳ Your seller account is not yet approved by admin!");
    return;
  }

  alert("🎉 Login successful!");
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      // ✅ If admin, redirect to admin page
      if (foundUser.role === "admin") {
        navigate("/admin");
        } else if (foundUser.role === "saler") {
      navigate("/dashboardseller");
      } else {
        navigate("/"); // regular user
      }
    } else {
      setError("❌ Email or password is incorrect!");
    }
  } catch (err) {
    console.error(err);
    setError("⚠️ Connection error! Please make sure json-server is running.");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google login logic
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Implement Facebook login logics
  };
  


  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 0"
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={9}>
            {/* Header Section */}
            <div className="text-center mb-4">
              {/* Logo */}
              <div className="mb-3">
                <div style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#2c3e50",
                  borderRadius: "16px",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <i className="fas fa-book" style={{ color: "white", fontSize: "32px" }}></i>
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#2c3e50",
                marginBottom: "8px"
              }}>
                Book Library
              </h2>

              {/* Subtitle */}
              <p style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px"
              }}>
                📖 "Books are the door to the world of knowledge" 📖
              </p>

              {/* Description */}
              <p style={{
                fontSize: "14px",
                color: "#6c757d"
              }}>
                Login to explore the endless treasure of knowledge
              </p>
            </div>

            {/* Login Card */}
            <Card className="shadow-lg border-0" style={{ borderRadius: "16px" }}>
              <Card.Body style={{ padding: "40px" }}>
                {/* Login Header */}
                <div className="text-center mb-4">
                  <h4 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "8px"
                  }}>
                    👋 Login ✨
                  </h4>
                  <p style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    margin: 0
                  }}>
                    Enter your information to access your account
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>
                      Email Address
                    </Form.Label>
                    <div className="position-relative">
                      <i
                        className="fas fa-envelope position-absolute"
                        style={{
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                          zIndex: 10
                        }}
                      ></i>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          paddingLeft: "40px",
                          height: "48px",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                          fontSize: "14px"
                        }}
                      />
                    </div>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <i
                        className="fas fa-lock position-absolute"
                        style={{
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                          zIndex: 10
                        }}
                      ></i>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                          paddingLeft: "40px",
                          paddingRight: "40px",
                          height: "48px",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                          fontSize: "14px"
                        }}
                      />
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "none",
                          color: "#6c757d",
                          padding: "4px 8px"
                        }}
                      >
                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      label="Remember me"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      style={{ fontSize: "14px", color: "#6c757d" }}
                    />
                    <Link 
                      to="/forgotpassword" 
                      style={{ 
                        fontSize: "14px", 
                        color: "#007bff", 
                        textDecoration: "none"
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: "48px",
                      backgroundColor: "#2c3e50",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "20px"
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Login ✨
                      </>
                    )}
                  </Button>

                  {/* OR Divider */}
                  <div className="text-center mb-3">
                    <span style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      backgroundColor: "#fff",
                      padding: "0 16px"
                    }}>
                      OR LOGIN WITH
                    </span>
                  </div>

                  {/* Social Login Buttons */}
                  <Row className="mb-4">
                    <Col xs={6}>
                      <Button
                        variant="outline-secondary"
                        onClick={handleGoogleLogin}
                        style={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                      >
                        <i className="fab fa-google me-2"></i>
                        Google
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant="outline-primary"
                        onClick={handleFacebookLogin}
                        style={{
                          width: "100%",
                          height: "48px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                      >
                        <i className="fab fa-facebook-f me-2"></i>
                        Facebook
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            {/* Register Link */}
            <div className="text-center mt-4">
              <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>
                Don't have an account? {" "}
                <Link
                  to="/register"
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    fontWeight: "500"
                  }}
                >
                  Register now →
                </Link>
              </p>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center gap-3">
                <Link
                  to="/terms"
                  style={{
                    fontSize: "12px",
                    color: "#6c757d",
                    textDecoration: "none"
                  }}
                >
                  Terms
                </Link>
                <span style={{ fontSize: "12px", color: "#dee2e6" }}>|</span>
                <Link
                  to="/privacy"
                  style={{
                    fontSize: "12px",
                    color: "#6c757d",
                    textDecoration: "none"
                  }}
                >
                  Privacy
                </Link>
                <span style={{ fontSize: "12px", color: "#dee2e6" }}>|</span>
                <Link
                  to="/support"
                  style={{
                    fontSize: "12px",
                    color: "#6c757d",
                    textDecoration: "none"
                  }}
                >
                  Support
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;