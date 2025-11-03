import React from "react";
import { Navbar, Form, FormControl, FormSelect } from "react-bootstrap";

function Topbar({ onSearch, onFilterRole }) {
  return (
    <Navbar bg="light" className="px-3">
      <Navbar.Brand>Tra cứu</Navbar.Brand>
      <Form className="d-flex ms-auto align-items-center gap-3">
        <FormControl
          type="search"
          placeholder="Tìm kiếm tài khoản..."
          onChange={(e) => onSearch(e.target.value)}
          style={{width: '500px'}}
        />
        <FormSelect onChange={(e) => onFilterRole(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="seller">Employee</option>
          <option value="customer">Customer</option>
        </FormSelect>
      </Form>
    </Navbar>
  );
}

export default Topbar;



// import React from "react";
// import { Navbar, Form, FormControl, Button } from "react-bootstrap";

// function Topbar() {
//   return (
//     <Navbar bg="light" className="px-3">
//       <Navbar.Brand>Dashboard</Navbar.Brand>
//       <Form className="d-flex ms-auto">
//         <FormControl type="search" placeholder="Search..." className="me-2" />
//         <Button variant="outline-primary">Search</Button>
//       </Form>
//     </Navbar>
//   );
// }

// export default Topbar;