import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";
import SalerSidebar from "../../components/SalerSidebar";
import { useNavigate } from 'react-router-dom';
function SellerRequests() {
  const [requests, setRequests] = useState([]);
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
      .get("http://localhost:9999/users?role=seller")
      .then((res) => {
        const pendingSellers = res.data.filter(
          (user) => user.status === "pending" || user.status === "requested"
        );
        setRequests(pendingSellers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading seller requests:", err);
        setLoading(false);
      });
  }, []);

  const handleAction = (userId, action) => {
    const updatedStatus = action === "approve" ? "approved" : "rejected";

    axios
      .patch(`http://localhost:9999/users/${userId}`, { status: updatedStatus })
      .then(() => {
        setRequests((prev) => prev.filter((u) => u.id !== userId));
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        alert("Failed to update user status.");
      });
  };

  return (
    <DashboardLayout sidebar={<SalerSidebar />} className="p-4">
      <h3 className="mb-4">Seller Registration Requests</h3>

      <Card>
        <Card.Header>
          <i className="fas fa-user-check me-2"></i> Pending Seller Accounts
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-muted">No pending seller requests.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Shop Name</th>
                  <th>Bio</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.profile?.shopName || "N/A"}</td>
                    <td>{user.profile?.bio || "N/A"}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction(user.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(user.id, "reject")}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default SellerRequests;
