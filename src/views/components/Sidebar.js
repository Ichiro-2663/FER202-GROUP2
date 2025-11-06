import React from "react";
import { Nav, Button } from "react-bootstrap";

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h4 className="text-center mb-4">Hello, Admin</h4>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Link href="/admin" className="text-white">Dashboard</Nav.Link>
        <Nav.Link href="/manageAccount" className="text-white">Manage Account</Nav.Link>
        <Nav.Link href="/adminProfile" className="text-white">Profile</Nav.Link>
        <Nav.Link href="/sellerRequests" className="text-white">Seller Requests</Nav.Link>
        <Nav.Link href="/createVoucher-admin" className="text-white">Create Voucher</Nav.Link>
        <Nav.Link href="/category-admin" className="text-white">Category</Nav.Link>
        <Nav.Link href="/manage-blog-admin" className="text-white">Manage Blog</Nav.Link>
   <Nav.Link href="/orders" className="text-white">Manage Order</Nav.Link>
        <Button
          variant="danger"
          className="mb-3 float-end"
          onClick={() => {
            // Xử lý logout ở đây
            alert("Log out Successfully!");
            // Ví dụ: chuyển hướng về trang đăng nhập
            window.location.href = "/";
          }}
        >
          Log out
        </Button>
        {/* <Nav.Link href="/tables" className="text-white">Tables</Nav.Link> */}
      </Nav>
    </div>
  );
}

export default Sidebar;
