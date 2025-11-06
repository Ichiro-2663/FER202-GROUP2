import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card } from "react-bootstrap";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import SalerSidebar from "../components/SalerSidebar";

function SalerDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:9999/users");
        const productsResponse = await axios.get("http://localhost:9999/books");
        setUsers(usersResponse.data);
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout sidebar={<SalerSidebar />}>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Users
              </h6>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Products
              </h6>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

export default SalerDashboard;

