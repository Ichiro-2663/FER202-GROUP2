import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { 
  fetchDatabase, 
  fetchFeaturedBooks, 
  fetchNewBooks, 
  fetchBestsellerBooks,
  fetchCategories,
  fetchPromotions,
  fetchStats
} from "../../services/api";

function Home() {
  const [databaseData, setDatabaseData] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [bestsellerBooks, setBestsellerBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState(null);
  const [stats, setStats] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [dbData, featured, newBks, bestsellers, cats, promo, statsData] = await Promise.all([
          fetchDatabase(),
          fetchFeaturedBooks(),
          fetchNewBooks(),
          fetchBestsellerBooks(),
          fetchCategories(),
          fetchPromotions(),
          fetchStats()
        ]);

        setDatabaseData(dbData);
        setFeaturedBooks(featured);
        setNewBooks(newBks);
        setBestsellerBooks(bestsellers);
        setCategories(cats);
        setPromotions(promo);
        setStats(statsData);
        setCountdown(promo.specialOffer.countdown);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (loading || !databaseData) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section 
        style={{ 
          backgroundColor: "#000",
          color: "white",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              {/* Special Offer Badge */}
              <div className="mb-3">
                <span 
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  🔥 Special Offer
                </span>
              </div>

              <h1 
                style={{ 
                  fontSize: "48px", 
                  fontWeight: "700",
                  lineHeight: "1.2",
                  marginBottom: "20px"
                }}
              >
                Discover the World of Knowledge Through Books
              </h1>
              
              <p 
                style={{ 
                  fontSize: "18px", 
                  marginBottom: "30px",
                  color: "#e9ecef"
                }}
              >
                Thousands of high-quality books at the best prices. 
                Free shipping nationwide for orders from 200,000 VND.
              </p>

              <div className="d-flex gap-3">
                <Button 
                  size="lg"
                  onClick={() => navigate("/products")}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "25px",
                    padding: "12px 30px",
                    fontWeight: "600"
                  }}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  BUY NOW
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  style={{
                    borderRadius: "25px",
                    padding: "12px 30px",
                    fontWeight: "600"
                  }}
                  onClick={() => {
                    const section = document.getElementById("featured-books");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <i className="fas fa-search me-2"></i>
                  EXPLORE
                </Button>
              </div>
            </Col>
            
            <Col lg={6} className="text-center">
              <div 
                style={{
                  width: "300px",
                  height: "300px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.2)"
                }}
              >
                <i 
                  className="fas fa-book-open" 
                  style={{ 
                    fontSize: "120px", 
                    color: "rgba(255,255,255,0.8)" 
                  }}
                ></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: "#333", padding: "40px 0" }}>
        <Container>
          <Row className="text-center text-white">
            <Col md={3}>
              <div className="mb-2">
                <i className="fas fa-shipping-fast mb-2" style={{ fontSize: "24px" }}></i>
                <h5 style={{ fontWeight: "600", margin: "8px 0 4px 0" }}>Free</h5>
                <p style={{ fontSize: "14px", margin: 0, color: "#e9ecef" }}>Shipping</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <i className="fas fa-headset mb-2" style={{ fontSize: "24px" }}></i>
                <h5 style={{ fontWeight: "600", margin: "8px 0 4px 0" }}>24/7</h5>
                <p style={{ fontSize: "14px", margin: 0, color: "#e9ecef" }}>Support</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <i className="fas fa-shield-alt mb-2" style={{ fontSize: "24px" }}></i>
                <h5 style={{ fontWeight: "600", margin: "8px 0 4px 0" }}>100%</h5>
                <p style={{ fontSize: "14px", margin: 0, color: "#e9ecef" }}>Authentic</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <i className="fas fa-medal mb-2" style={{ fontSize: "24px" }}></i>
                <h5 style={{ fontWeight: "600", margin: "8px 0 4px 0" }}>99%</h5>
                <p style={{ fontSize: "14px", margin: 0, color: "#e9ecef" }}>Satisfaction</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Numbers Section */}
      <section style={{ backgroundColor: "#000", padding: "60px 0", color: "white" }}>
        <Container>
          <Row className="text-center">
            <Col md={3}>
              <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#fff" }}>
                {stats?.totalBooks || "0"}
              </h2>
              <p style={{ fontSize: "16px", color: "#e9ecef" }}>Books</p>
            </Col>
            <Col md={3}>
              <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#fff" }}>
                {stats?.customers || "0"}
              </h2>
              <p style={{ fontSize: "16px", color: "#e9ecef" }}>Customers</p>
            </Col>
            <Col md={3}>
              <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#fff" }}>
                {stats?.support || "0"}
              </h2>
              <p style={{ fontSize: "16px", color: "#e9ecef" }}>Support</p>
            </Col>
            <Col md={3}>
              <h2 style={{ fontSize: "48px", fontWeight: "700", color: "#fff" }}>
                {stats?.satisfaction || "0"}
              </h2>
              <p style={{ fontSize: "16px", color: "#e9ecef" }}>Satisfaction</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Books Section */}
      <section id="featured-books" style={{ padding: "80px 0", backgroundColor: "#f8f9fa" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>
              Featured Books
            </h2>
            <div 
              style={{ 
                width: "80px", 
                height: "4px", 
                backgroundColor: "#000", 
                margin: "0 auto 20px auto" 
              }}
            ></div>
          </div>
          
          <Row>
            {featuredBooks.map((book) => (
              <Col lg={3} md={6} className="mb-4" key={book.id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Promotion Section */}
      <section style={{ backgroundColor: "#ecf0f1", padding: "60px 0" }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow-lg" style={{ borderRadius: "15px" }}>
                <Card.Body className="text-center" style={{ padding: "40px" }}>
                  <div className="mb-3">
                    <i className="fas fa-percentage" style={{ fontSize: "48px", color: "#f39c12" }}></i>
                  </div>
                  
                  <h3 style={{ fontWeight: "700", marginBottom: "16px" }}>
                    {promotions?.specialOffer?.title || ""}
                  </h3>
                  
                  <p style={{ fontSize: "16px", color: "#7f8c8d", marginBottom: "24px" }}>
                    {promotions?.specialOffer?.description || ""}
                  </p>
                  
                  <p style={{ fontSize: "14px", color: "#7f8c8d", marginBottom: "20px" }}>
                    Valid from {promotions?.specialOffer?.startDate || ""} - {promotions?.specialOffer?.endDate || ""}
                  </p>

                  <Button 
                    href="#contact"
                    style={{
                      backgroundColor: "#000",
                      border: "none",
                      borderRadius: "25px",
                      padding: "10px 24px",
                      fontWeight: "600",
                      marginBottom: "24px",
                      color: "#fff"
                    }}
                  >
                    <i className="fas fa-envelope me-2"></i>
                    Contact for Advertising
                  </Button>

                  <div style={{ marginBottom: "20px" }}>
                    <h6 style={{ fontWeight: "600", marginBottom: "16px" }}>Time Remaining:</h6>
                    <Row className="justify-content-center">
                      <Col xs={3}>
                        <div style={{ 
                          backgroundColor: "#000", 
                          color: "white", 
                          padding: "15px 10px", 
                          borderRadius: "8px",
                          margin: "0 5px"
                        }}>
                          <div style={{ fontSize: "24px", fontWeight: "700" }}>
                            {formatNumber(countdown.days)}
                          </div>
                          <div style={{ fontSize: "12px" }}>Days</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div style={{ 
                          backgroundColor: "#000", 
                          color: "white", 
                          padding: "15px 10px", 
                          borderRadius: "8px",
                          margin: "0 5px"
                        }}>
                          <div style={{ fontSize: "24px", fontWeight: "700" }}>
                            {formatNumber(countdown.hours)}
                          </div>
                          <div style={{ fontSize: "12px" }}>Hours</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div style={{ 
                          backgroundColor: "#000", 
                          color: "white", 
                          padding: "15px 10px", 
                          borderRadius: "8px",
                          margin: "0 5px"
                        }}>
                          <div style={{ fontSize: "24px", fontWeight: "700" }}>
                            {formatNumber(countdown.minutes)}
                          </div>
                          <div style={{ fontSize: "12px" }}>Minutes</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div style={{ 
                          backgroundColor: "#000", 
                          color: "white", 
                          padding: "15px 10px", 
                          borderRadius: "8px",
                          margin: "0 5px"
                        }}>
                          <div style={{ fontSize: "24px", fontWeight: "700" }}>
                            {formatNumber(countdown.seconds)}
                          </div>
                          <div style={{ fontSize: "12px" }}>Seconds</div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Button 
                      variant="outline-primary"
                      style={{ 
                        borderRadius: "20px",
                        padding: "8px 20px",
                        fontWeight: "500",
                        marginRight: "12px"
                      }}
                      onClick={() => navigate("/products?category=Literature")}
                    >
                      VIEW OFFER
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section style={{ padding: "80px 0" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>
              Book Categories
            </h2>
            <div 
              style={{ 
                width: "80px", 
                height: "4px", 
                backgroundColor: "#000", 
                margin: "0 auto 20px auto" 
              }}
            ></div>
          </div>
          
          <Row>
            {categories.filter(cat => cat.icon).map((category) => (
              <Col lg={3} md={6} className="mb-4" key={category.id}>
                <Card
                    className="text-center h-100 border-0 shadow-sm"
                    style={{
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(
                          category.name.replace(/\*\*/g, "")
                        )}`
                      )
                    }
                  >
                  <Card.Body 
                    style={{ padding: "40px 20px" }}
                    onMouseEnter={(e) => e.currentTarget.parentElement.style.transform = "translateY(-5px)"}
                    onMouseLeave={(e) => e.currentTarget.parentElement.style.transform = "translateY(0)"}
                  >
                    <i 
                      className={category.icon} 
                      style={{ 
                        fontSize: "48px", 
                        color: "#000",
                        marginBottom: "20px"
                      }}
                    ></i>
                    <h5 style={{ fontWeight: "600", marginBottom: "12px" }}>
                      {category.name}
                    </h5>
                    <p style={{ color: "#7f8c8d", marginBottom: 0 }}>
                      {category.bookCount ? category.bookCount.toLocaleString() + "+" : "Many"} books
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* New Books Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f8f9fa" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>
              New Books
            </h2>
            <div 
              style={{ 
                width: "80px", 
                height: "4px", 
                backgroundColor: "#000", 
                margin: "0 auto 20px auto" 
              }}
            ></div>
          </div>
          
          <Row>
            {newBooks.map((book) => (
              <Col lg={3} md={6} className="mb-4" key={book.id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Best Sellers Section */}
      <section style={{ padding: "80px 0" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "16px" }}>
              Best Seller
            </h2>
            <div 
              style={{ 
                width: "80px", 
                height: "4px", 
                backgroundColor: "#000", 
                margin: "0 auto 20px auto" 
              }}
            ></div>
          </div>
          
          <Row>
            {bestsellerBooks.map((book) => (
              <Col lg={3} md={6} className="mb-4" key={`bestseller-${book.id}`}>
                <BookCard book={book} />
              </Col>
            ))}
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
    </div>
  );
}

export default Home;