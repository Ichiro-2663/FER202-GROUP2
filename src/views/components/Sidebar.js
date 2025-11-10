import React from "react";
import { Nav, Button } from "react-bootstrap";

function Sidebar() {
 
  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      
      localStorage.removeItem("currentUser");

      alert("Logged out successfully!");
     
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px", height: '100%' }}>
      <h4 className="text-center mb-4">Hello, Admin</h4>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Link href="/admin" className="text-white">Dashboard</Nav.Link>
        <Nav.Link href="/admin/manageAccount" className="text-white">Manage Account</Nav.Link>
        <Nav.Link href="/admin/adminProfile" className="text-white">Profile</Nav.Link>
        <Nav.Link href="/admin/sellerRequests" className="text-white">Seller Requests</Nav.Link>
        <Nav.Link href="/admin/createVoucher-admin" className="text-white">Create Voucher</Nav.Link>
        <Nav.Link href="/admin/category-admin" className="text-white">Category</Nav.Link>
        <Nav.Link href="/admin/manage-blog-admin" className="text-white">Manage Blog</Nav.Link>
        <Nav.Link href="/admin/orders" className="text-white">Manage Order</Nav.Link>

        <Button
          variant="danger"
          className="mt-4"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Nav>
    </div>
  );
}

export default Sidebar;
