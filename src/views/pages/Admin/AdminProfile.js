import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from 'react-router-dom';
function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // return to home page
    }
  }, [navigate]);
  useEffect(() => {
    axios
      .get("http://localhost:9999/users?role=admin")
      .then((res) => {
        setAdmin(res.data[0]); // assume there is only 1 admin
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin info:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    if (!admin.email || !admin.email.includes("@")) {
      alert("❌ Invalid email. Email must contain '@' and cannot be empty.");
      setAdmin({ ...admin, email: "" }); // Clear email field
      return;
    }

    if (!admin.name || admin.name.trim() === "") {
      alert("❌ Full name cannot be empty.");
      return;
    }

    axios
      .put(`http://localhost:9999/users/${admin.id}`, admin)
      .then(() => {
        alert("✅ Admin profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating admin:", err);
        alert("❌ Something went wrong. Check again.");
      });
  };


  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-4">Admin information</h3>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      ) : (
        <Card>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={admin.email}
                  onChange={(e) =>
                    setAdmin({ ...admin, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  value={admin.name}
                  onChange={(e) =>
                    setAdmin({ ...admin, name: e.target.value })
                  }
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSave}>
                Save change
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default AdminProfile;
