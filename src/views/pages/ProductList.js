import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { fetchDatabase } from "../../services/api";

function ProductList() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    priceRange: "",
  });
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  // 🧠 Load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDatabase();
        setBooks(data.books);
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🧩 Lấy danh sách tác giả duy nhất
  const authors = [...new Set(books.map((b) => b.author))];

  // 🎯 Lọc & Sắp xếp
  useEffect(() => {
    let result = [...books];

    // Lọc theo danh mục
    if (filters.category) {
      result = result.filter(
        (b) => b.category.replace(/\*/g, "").trim() === filters.category
      );
    }

    // Lọc theo tác giả
    if (filters.author) {
      result = result.filter((b) => b.author === filters.author);
    }

    // Lọc theo khoảng giá
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case "low":
          result = result.filter((b) => b.price <= 150000);
          break;
        case "mid":
          result = result.filter((b) => b.price > 150000 && b.price <= 300000);
          break;
        case "high":
          result = result.filter((b) => b.price > 300000);
          break;
        default:
          break;
      }
    }

    // Sắp xếp
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "bestseller") {
      result = result.filter((b) => b.source === "bestseller");
    } else if (sortBy === "newest") {
      result = result.filter((b) => b.source === "new");
    }

    setFilteredBooks(result);
  }, [filters, sortBy, books]);

  // 🌀 Loading
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
    <>
      <Navbar />

      <Container style={{ padding: "80px 0" }}>
        <Row>
          {/* 🎚️ Sidebar Filter */}
          <Col md={3}>
            <div className="p-3 shadow-sm rounded bg-light">
              <h5 className="fw-bold mb-3">Filters</h5>

              {/* Danh mục */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.name.replace(/\*/g, "").trim()}
                    >
                      {cat.name.replace(/\*/g, "")}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Tác giả */}
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Select
                  value={filters.author}
                  onChange={(e) =>
                    setFilters({ ...filters, author: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {authors.map((author, i) => (
                    <option key={i} value={author}>
                      {author}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Khoảng giá */}
              <Form.Group className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <Form.Select
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="low">0 - 150,000₫</option>
                  <option value="mid">150,000₫ - 300,000₫</option>
                  <option value="high">Above 300,000₫</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="dark"
                className="w-100"
                onClick={() =>
                  setFilters({ category: "", author: "", priceRange: "" })
                }
              >
                Reset Filters
              </Button>
            </div>
          </Col>

          {/* 📚 Book List */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">Book Collection</h4>
              <Form.Select
                style={{ width: "220px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="bestseller">Best Sellers</option>
                <option value="newest">Newest Books</option>
              </Form.Select>
            </div>

            <Row>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Col lg={4} md={6} className="mb-4" key={book.id}>
                    <BookCard book={book} />
                  </Col>
                ))
              ) : (
                <div className="text-center mt-5">
                  <p>No books found.</p>
                </div>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* 🦶 Footer */}
      <footer style={{ backgroundColor: "#000", color: "white", padding: "40px 0" }}>
        <Container>
          <Row>
            <Col md={6}>
              <h5 className="fw-bold">The Reading Nook</h5>
              <p>
                Vietnam's leading online bookstore. Thousands of quality books at the best prices.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-1">© 2025 The Reading Nook. All rights reserved.</p>
              <small>Designed by GROUP 2</small>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default ProductList;
