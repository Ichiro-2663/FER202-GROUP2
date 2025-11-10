import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spinner, Table } from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from 'react-router-dom';

function SalerDashboard() {
  const [sellerBooks, setSellerBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "seller") {
      alert("You don't have permission to access this page!");
      navigate("/"); // return to home page
    } else {
      axios.get("/database.json")
        .then(res => {
          const sellerInventory = res.data.inventory.filter(
            (item) => item.sellerId === currentUser.id
          );
          const sellerBookIds = sellerInventory.map((item) => item.bookId);
          const books = res.data.books.filter((book) =>
            sellerBookIds.includes(book.id)
          );
          setSellerBooks(books);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <h3 className="mb-4">Saler Dashboard</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card bg="primary" text="white" className="mb-4">
                <Card.Body>
                  <Card.Title>Number of Your Books</Card.Title>
                  <h2>{sellerBooks.length}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <strong>Your Books</strong>
            </Card.Header>
            <Card.Body>
              {sellerBooks.length === 0 ? (
                <p>You have no books for sale.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name of book</th>
                      <th>Author</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerBooks.map((book, index) => (
                      <tr key={book.id}>
                        <td>{index + 1}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.price.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}

export default SalerDashboard;
