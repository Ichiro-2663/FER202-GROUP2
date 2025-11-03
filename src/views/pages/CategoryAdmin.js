import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (field, value) => {
    setNewCategory({ ...newCategory, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...newCategory,
      id: `c_${newCategory.slug}`,
      createdAt: new Date().toISOString(),
    };

    axios
      .post("http://localhost:9999/categories", payload)
      .then(() => {
        setCategories([...categories, payload]);
        setNewCategory({ name: "", slug: "" });
        setSuccess(true);
        setError("");
      })
      .catch((err) => {
        console.error("Error creating category:", err);
        setError("Failed to create category.");
        setSuccess(false);
      });
  };

  return (
    <DashboardLayout>
      <h3 className="mb-4">Category Management</h3>

      <Card className="mb-3">
        <Card.Body>
          <p>
            <strong>REQ.8.1:</strong> Admin is responsible for creating,
            updating, and managing the global category system (Literature,
            Business, etc.).
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <i className="fas fa-list me-2"></i> Category List
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading categories...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    <td>{cat.slug}</td>
                    <td>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Form thêm mới */}
      <Card className="mt-4">
        <Card.Header>
          <i className="fas fa-plus me-2"></i> Add New Category
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert variant="success">Category added successfully!</Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default CategoryAdmin;
