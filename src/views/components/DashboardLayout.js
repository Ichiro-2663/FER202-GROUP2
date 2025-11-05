import React from "react";
import Sidebar from "./Sidebar";
import { Container, Row, Col } from 'react-bootstrap';

function DashboardLayout({ children }) {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-dark text-white vh-100">
          <Sidebar />
        </Col>
        <Col md={10}>
          <div className="p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
}
export default DashboardLayout;

// function DashboardLayout({ children }) {
//   return (
//     <div className="d-flex" >
//       <Sidebar />
//       <div className="flex-grow-1">
//         {/* <Topbar /> */}
//         <div className="p-4">{children}</div>
//       </div>
//     </div>
//   );
// }

// export default DashboardLayout;