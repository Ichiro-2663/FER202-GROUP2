import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SalerSidebar from './SalerSidebar';

function DashboardLayout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isSaler = location.pathname.startsWith('/seller');

  const sidebar = isAdmin ? <Sidebar /> : isSaler ? <SalerSidebar /> : null;

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-dark text-white vh-100">
          {sidebar}
        </Col>
        <Col md={10}>
          <div className="p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;


// import React from "react";
// import Sidebar from "./Sidebar";
// import { Container, Row, Col } from 'react-bootstrap';

// function DashboardLayout({ children, sidebar }) {
//   return (
//     <Container fluid>
//       <Row>
//         <Col md={2} className="bg-dark text-white vh-100">
//           {sidebar}
//         </Col>
//         <Col md={10}>
//           <div className="p-4">{children}</div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
// export default DashboardLayout;

