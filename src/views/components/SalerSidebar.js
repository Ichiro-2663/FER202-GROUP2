import React from "react";
import { Nav, Button } from "react-bootstrap";

function SalerSidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
      <h4 className="text-center mb-4">Hello, Saler</h4>
      <Nav defaultActiveKey="/dashboard" className="flex-column">
        <Nav.Link href="/saler" className="text-white">Dashboard</Nav.Link>
        <Nav.Link href="/saler/products" className="text-white">Products</Nav.Link>
        <Nav.Link href="/saler/blogs" className="text-white">Manage Blog</Nav.Link>
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
      </Nav>
    </div>
  );
}

export default SalerSidebar;
