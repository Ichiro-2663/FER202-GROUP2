import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// can ket noi voi db
function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  //   // Validation
  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Mật khẩu xác nhận không khớp");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!formData.agreeTerms) {
  //     setError("Vui lòng đồng ý với điều khoản sử dụng");
  //     setLoading(false);
  //     return;
  //   }

  //   // Simulate API call
  //   setTimeout(() => {
  //     if (formData.fullName && formData.email && formData.password) {
  //       console.log("Registration successful:", formData);
  //       navigate("/login"); // Redirect to login page
  //     } else {
  //       setError("Vui lòng nhập đầy đủ thông tin");
  //     }
  //     setLoading(false);
  //   }, 1000);
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Check password confirmation
  if (formData.password !== formData.confirmPassword) {
    setError("Password confirmation does not match");
    setLoading(false);
    return;
  }

  if (!formData.agreeTerms) {
    setError("Please agree to the terms of service");
    setLoading(false);
    return;
  }

  try {
    // Check if email already exists
    const checkResponse = await fetch(`http://localhost:9999/users?email=${formData.email}`);
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      setError("This email is already registered!");
      setLoading(false);
      return;
    }

    // Send new data to database.json
    const response = await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `u_${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        password: formData.password, // can be encrypted later
        role: "customer",
        status:"ative",
        createdAt: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      setError("Registration failed, please try again.");
    }
  } catch (err) {
    console.error(err);
    setError("Connection error! Please make sure json-server is running.");
  } finally {
    setLoading(false);
  }
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

              <h2 style={{ 
                fontSize: "28px", 
                fontWeight: "700", 
                color: "#2c3e50",
                marginBottom: "8px"
              }}>
                Book Library
              </h2>

              <p style={{ 
                fontSize: "14px", 
                color: "#6c757d"
              }}>
                Create an account to explore the endless treasure of knowledge
              </p>
            </div>

            {/* Register Card */}
            <Card className="shadow-lg border-0" style={{ borderRadius: "16px" }}>
              <Card.Body style={{ padding: "40px" }}>
                {/* Register Header */}
                <div className="text-center mb-4">
                  <h4 style={{ 
                    fontSize: "20px", 
                    fontWeight: "600", 
                    color: "#2c3e50",
                    marginBottom: "8px"
                  }}>
                    📝 Register Account
                  </h4>
                  <p style={{ 
                    fontSize: "14px", 
                    color: "#6c757d",
                    margin: 0
                  }}>
                    Join our book-loving community
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {/* Register Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Full Name Field */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>
                      Full Name
                    </Form.Label>
                    <div className="position-relative">
                      <i 
                        className="fas fa-user position-absolute" 
                        style={{ 
                          left: "12px", 
                          top: "50%", 
                          transform: "translateY(-50%)", 
                          color: "#6c757d",
                          zIndex: 10
                        }}
                      ></i>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
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

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "500", color: "#2c3e50" }}>
                      Confirm Password
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
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                        <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Terms Agreement */}
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      label={
                        <span style={{ fontSize: "14px", color: "#6c757d" }}>
                          I agree to the{" "}
                          <Link to="/terms" style={{ color: "#007bff" }}>
                            terms of service
                          </Link>
                          {" "}and{" "}
                          <Link to="/privacy" style={{ color: "#007bff" }}>
                            privacy policy
                          </Link>
                        </span>
                      }
                    />
                  </Form.Group>

                  {/* Register Button */}
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
                        Create Account 🚀
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>
                Already have an account? {" "}
                <Link 
                  to="/login" 
                  style={{ 
                    color: "#007bff", 
                    textDecoration: "none", 
                    fontWeight: "500"
                  }}
                >
                  Login now →
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;