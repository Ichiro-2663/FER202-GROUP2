import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { fetchDatabase } from "../../services/api";

function ProductList() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    setCategory(categoryParam);
  }, [location.search]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchDatabase();
        setBooks(data.books);
      } catch (err) {
        console.error("Failed to load books:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    if (!books.length) return;

    if (category) {
      const normalized = category.trim().toLowerCase();
      const filtered = books.filter(
        (b) =>
          b.category.replace(/\*/g, "").trim().toLowerCase() === normalized
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [books, category]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 🧭 Navbar */}
      <Navbar />

      {/* 📚 Product List */}
      <Container style={{ padding: "100px 0" }}>
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: "700" }}>
            {category ? `${category} Books` : "All Books"}
          </h2>
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "#000",
              margin: "10px auto 30px auto",
            }}
          ></div>
        </div>

        <Row>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Col lg={3} md={6} className="mb-4" key={book.id}>
                <BookCard book={book} />
              </Col>
            ))
          ) : (
            <div className="text-center">
              <p>No books found for this category.</p>
            </div>
          )}
        </Row>
      </Container>

      {/* 🦶 Footer */}
      <footer style={{ backgroundColor: "#000", color: "white", padding: "40px 0" }}>
        <Container>
          <Row>
            <Col md={3}>
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background:
                      "linear-gradient(45deg, #fff, #f8f9fa, #e9ecef)",
                    borderRadius: "4px",
                    marginRight: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-book"
                    style={{ color: "#333", fontSize: "16px" }}
                  ></i>
                </div>
                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                  The Reading Nook
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "#e9ecef" }}>
                Vietnam's leading online bookstore. We provide thousands of
                quality books at the best prices.
              </p>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>
                Categories
              </h6>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#van-hoc"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Literature
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#kinh-te"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Economics
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#khoa-hoc"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Science
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#thieu-nhi"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Children
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>
                Support
              </h6>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#lien-he"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Contact
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#huong-dan"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Guide
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#chinh-sach"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    Policy
                  </a>
                </li>
                <li style={{ marginBottom: "8px" }}>
                  <a
                    href="#faq"
                    style={{
                      color: "#e9ecef",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>
                Subscribe
              </h6>
              <p
                style={{
                  fontSize: "14px",
                  color: "#e9ecef",
                  marginBottom: "16px",
                }}
              >
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
                    fontSize: "14px",
                  }}
                />
                <Button
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "0 4px 4px 0",
                    padding: "8px 16px",
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
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  marginLeft: "4px",
                }}
              >
                GROUP 2
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default ProductList;
