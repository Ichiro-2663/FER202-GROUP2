import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { fetchBookById, fetchFeedbacksByBookId, createFeedbackOnServer } from "../../services/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rate, setRate] = useState(5);
  const [comment, setComment] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const data = await fetchBookById(id);
        setBook(data);
        // Load feedbacks for this book (visible for everyone)
        const fbs = await fetchFeedbacksByBookId(id);
        setFeedbacks((fbs || []).filter(f => !f.hidden));
      } catch (error) {
        console.error("Error loading book:", error);
      }
      setLoading(false);
    };
    loadBook();
  }, [id]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to submit feedback.");
      return;
    }
    try {
      const newFeedback = {
        id: Date.now().toString(),
        bookId: id,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email,
        rate: Number(rate),
        comment: comment.trim(),
        createdAt: new Date().toISOString()
      };
      await createFeedbackOnServer(newFeedback);
      setComment("");
      setRate(5);
      const fbs = await fetchFeedbacksByBookId(id);
      setFeedbacks(fbs);
      alert("Thanks for your feedback!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center mt-5">
        <h4>Book not found.</h4>
        <Button onClick={() => navigate("/products")} className="mt-3">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Product Detail Section */}
      <section style={{ padding: "80px 0" }}>
        <Container>
          <Row>
            <Col md={5} className="text-center mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={book.image || "/images/book-placeholder.png"}
                  alt={book.title}
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                    padding: "20px",
                  }}
                />
              </Card>
            </Col>

            <Col md={7}>
              <h2 style={{ fontWeight: "700" }}>{book.title}</h2>
              <p style={{ color: "#7f8c8d" }}>{book.author}</p>

              {/* ⭐ Hiển thị rating */}
              {book.rating && (
                <div className="d-flex align-items-center mb-3">
                  <span style={{ color: "#f1c40f", fontSize: "1.2rem" }}>
                    {"★".repeat(Math.round(book.rating))}
                    {"☆".repeat(5 - Math.round(book.rating))}
                  </span>
                  <span className="ms-2 text-muted">
                    {book.rating} / 5 ({book.reviews} reviews)
                  </span>
                </div>
              )}

              {/* 💸 Hiển thị giá gốc, discount và giá giảm */}
              <div className="mt-3 mb-3">
                {book.originalPrice && (
                  <div>
                    <span className="text-muted text-decoration-line-through">
                      {book.originalPrice.toLocaleString()} VND
                    </span>
                    {book.discount && (
                      <span
                        className="ms-2 px-2 py-1 bg-danger text-white rounded"
                        style={{ fontSize: "0.9rem", fontWeight: "600" }}
                      >
                        -{book.discount}%
                      </span>
                    )}
                  </div>
                )}
                <h3 className="mt-2 text-danger fw-bold">
                  {book.price?.toLocaleString()} VND
                </h3>
              </div>

              <p className="mt-4">{book.description}</p>

              <div className="mt-4">
                <Button
                  variant="dark"
                  size="lg"
                  style={{ borderRadius: "30px", padding: "10px 24px" }}
                >
                  <i className="fas fa-cart-plus me-2"></i>
                  Add to Cart
                </Button>
                <Button
                  variant="outline-dark"
                  size="lg"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 24px",
                    marginLeft: "12px",
                  }}
                  onClick={() => navigate("/products")}
                >
                  Back to List
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feedback Section */}
      <section style={{ padding: "20px 0 60px 0" }}>
        <Container>
          <Row>
            <Col md={12}>
              <h4 className="mb-3">Feedback</h4>
              {feedbacks.length === 0 ? (
                <p className="text-muted">No feedback yet.</p>
              ) : (
                feedbacks.map((fb) => (
                  <Card className="mb-2" key={fb.id}>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{fb.userName || "User"}</strong>{" "}
                          <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                            {new Date(fb.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div style={{ color: "#f1c40f" }}>
                          {"★".repeat(Math.round(fb.rate || 0))}
                          {"☆".repeat(5 - Math.round(fb.rate || 0))}
                        </div>
                      </div>
                      <div className="mt-2">{fb.comment}</div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <Card className="p-3">
                <h5 className="mb-3">Add your feedback</h5>
                {!currentUser ? (
                  <div className="text-muted">
                    Please login to submit feedback.
                  </div>
                ) : (
                  <Form onSubmit={handleSubmitFeedback}>
                    <Row className="g-3">
                      <Col md={3}>
                        <Form.Group controlId="rate">
                          <Form.Label>Rate</Form.Label>
                          <Form.Select value={rate} onChange={(e) => setRate(e.target.value)}>
                            <option value={5}>5 - Excellent</option>
                            <option value={4}>4 - Good</option>
                            <option value={3}>3 - Average</option>
                            <option value={2}>2 - Poor</option>
                            <option value={1}>1 - Terrible</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={9}>
                        <Form.Group controlId="comment">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Share your thoughts about this book"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Button type="submit" variant="dark">
                        Submit Feedback
                      </Button>
                    </div>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#000", color: "white", padding: "40px 0" }}>
        <Container>
          <Row>
            <Col md={3}>
              <div className="d-flex align-items-center mb-3">
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
                <span style={{ fontSize: "20px", fontWeight: "600" }}>The Reading Nook</span>
              </div>
              <p style={{ fontSize: "14px", color: "#e9ecef" }}>
                Vietnam's leading online bookstore. We 
                provide thousands of quality books at the best prices.
              </p>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>Categories</h6>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#van-hoc" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Literature
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#kinh-te" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Economics
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#khoa-hoc" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Science
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#thieu-nhi" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Children
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>Support</h6>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#lien-he" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Contact
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#huong-dan" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Guide
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#chinh-sach" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    Policy
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a href="#faq" style={{ color: "#e9ecef", textDecoration: "none", fontSize: "14px" }}>
                    FAQ
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>Subscribe</h6>
              <p style={{ fontSize: "14px", color: "#e9ecef", marginBottom: "16px" }}>
                Get information about new books and special offers
              </p>
              <div className="d-flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #555",
                    borderRadius: "4px 0 0 4px",
                    fontSize: "14px"
                  }}
                />
                <Button 
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "0 4px 4px 0",
                    padding: "8px 16px"
                  }}
                >
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
          
          <hr style={{ margin: "30px 0", borderColor: "#555" }} />
          
          <div className="text-center">
            <p style={{ margin: 0, fontSize: "14px", color: "#e9ecef" }}>
              © 2025 The Reading Nook. All rights reserved.
            </p>
            <div className="mt-2">
              <span style={{ fontSize: "14px", color: "#e9ecef" }}>
                Designed by 
              </span>
              <a 
                href="#team" 
                style={{ color: "#fff", textDecoration: "none", marginLeft: "4px" }}
              >
                GROUP 2
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default ProductDetail;
