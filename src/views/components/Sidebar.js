import React from "react";
import { Nav } from "react-bootstrap";

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h4 className="text-center mb-4">Start Bootstrap</h4>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Link href="/dashboard" className="text-white">Dashboard</Nav.Link>
        <Nav.Link href="/charts" className="text-white">Charts</Nav.Link>
        <Nav.Link href="/tables" className="text-white">Tables</Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;