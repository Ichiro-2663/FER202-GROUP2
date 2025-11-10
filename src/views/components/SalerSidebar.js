import React from "react";
import { Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function SalerSidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h4 className="text-center mb-4">Hello, Saler</h4>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Link as={Link} to="/saler" className="text-white">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/saler/manage-book" className="text-white">Manage Book</Nav.Link>
        <Nav.Link as={Link} to="/saler/blogs" className="text-white">Manage Blog</Nav.Link>
        <Button
          variant="danger"
          className="mb-3 float-end"
          onClick={() => {
            // Handle logout here
            alert("Log out Successfully!");
            // Example: redirect to login page
            window.location.href = "/";
          }}
        >
          Log out
        </Button>
      </Nav>
    </div>
  );
}

export default SalerSidebar;
