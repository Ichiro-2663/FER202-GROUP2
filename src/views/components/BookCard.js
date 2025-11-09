import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useCart } from "./Navbar";

function BookCard({ book, showDiscount = true }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <Card className="h-100 shadow-sm position-relative" style={{ border: "1px solid #e0e0e0" }}>
      {/* Discount Badge */}
      {showDiscount && book.discount && (
        <Badge 
          bg="danger" 
          className="position-absolute"
          style={{ 
            top: "10px", 
            left: "10px", 
            zIndex: 1,
            fontSize: "12px"
          }}
        >
          -{book.discount}%
        </Badge>
      )}

      {/* Favorite Icon */}
      {book.isFavorite && (
        <div 
          className="position-absolute"
          style={{ 
            top: "10px", 
            right: "10px", 
            zIndex: 1,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i className="fas fa-heart" style={{ fontSize: "14px" }}></i>
        </div>
      )}

      {/* Book Image */}
      <div style={{ height: "250px", overflow: "hidden" }}>
        <Card.Img 
          variant="top" 
          src={book.image || "/images/placeholder-book.jpg"} 
          alt={book.title}
          style={{ 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Title */}
        <Card.Title 
          style={{ 
            fontSize: "16px", 
            fontWeight: "600",
            marginBottom: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {book.title}
        </Card.Title>

        {/* Author */}
        <Card.Text 
          className="text-muted mb-2" 
          style={{ fontSize: "14px" }}
        >
          {book.author}
        </Card.Text>

        {/* Rating */}
        <div className="mb-2">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i}
              className={`fa${i < Math.floor(book.rating) ? 's' : 'r'} fa-star`}
              style={{ 
                color: i < Math.floor(book.rating) ? "#ffc107" : "#e4e5e9",
                fontSize: "12px"
              }}
            ></i>
          ))}
          <span className="ms-1 text-muted" style={{ fontSize: "12px" }}>
            ({book.rating})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="d-flex align-items-center">
            <span 
              style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                color: "#000" 
              }}
            >
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span 
                className="text-muted text-decoration-line-through ms-2"
                style={{ fontSize: "14px" }}
              >
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="dark" 
          className="mt-auto w-100"
          onClick={handleAddToCart}
          style={{ 
            borderRadius: "4px",
            fontWeight: "500",
            backgroundColor: "#000",
            borderColor: "#000"
          }}
        >
          <i className="fas fa-shopping-cart me-2"></i>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
