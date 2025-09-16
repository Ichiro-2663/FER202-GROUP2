import React from "react";
import { Navbar, Form, FormControl, Button } from "react-bootstrap";

function Topbar() {
  return (
    <Navbar bg="light" className="px-3">
      <Navbar.Brand>Dashboard</Navbar.Brand>
      <Form className="d-flex ms-auto">
        <FormControl type="search" placeholder="Search..." className="me-2" />
        <Button variant="outline-primary">Search</Button>
      </Form>
    </Navbar>
  );
}

export default Topbar;