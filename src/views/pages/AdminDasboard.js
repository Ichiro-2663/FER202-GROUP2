import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Spinner,
  Table,
  Collapse,
  Button,
} from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null); // "users", "products", "revenue"

  useEffect(() => {
    axios
      .get("http://localhost:9999/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy số người dùng:", error);
        setLoading(false);
      });
  }, []);

  const userCount = users.length;

  const groupUsersByRole = () => {
    const grouped = {};
    users.forEach((user) => {
      if (!grouped[user.role]) {
        grouped[user.role] = [];
      }
      grouped[user.role].push(user.name);
    });
    return grouped;
  };

  const roleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "seller":
        return "Employee";
      case "customer":
        return "Customer";
      default:
        return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <h3 className="mb-4">Dashboard</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card
                bg="primary"
                text="white"
                className="mb-4"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setActiveSection(
                    activeSection === "users" ? null : "users"
                  )
                }
              >
                <Card.Body>
                  <Card.Title>Số người dùng</Card.Title>
                  <h2>{userCount}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                bg="warning"
                text="white"
                className="mb-4"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setActiveSection(
                    activeSection === "products" ? null : "products"
                  )
                }
              >
                <Card.Body>
                  <Card.Title>Số lượng sản phẩm</Card.Title>
                  <h2>0</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                bg="success"
                text="white"
                className="mb-4"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setActiveSection(
                    activeSection === "revenue" ? null : "revenue"
                  )
                }
              >
                <Card.Body>
                  <Card.Title>Số tiền thu được</Card.Title>
                  <h2>0</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Bảng thống kê người dùng */}
          <Collapse in={activeSection === "users"}>
            <div>
              <Card>
                <Card.Header>
                  <strong>Thống kê người dùng theo vai trò</strong>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Vai trò</th>
                        <th>Người dùng</th>
                        <th>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupUsersByRole()).map(
                        ([role, names], index) => (
                          <tr key={role}>
                            <td>{index + 1}</td>
                            <td>{roleLabel(role)}</td>
                            <td>{names.join(", ")}</td>
                            <td>{names.length}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Row, Col, Spinner } from "react-bootstrap";
// import DashboardLayout from "../components/DashboardLayout";

// function AdminDashboard() {
//   const [userCount, setUserCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get("http://localhost:9999/users")
//       .then((response) => {
//         setUserCount(response.data.length);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy số người dùng:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <DashboardLayout>
//       <h3 className="mb-4">Dashboard</h3>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Đang tải dữ liệu...</p>
//         </div>
//       ) : (
//         <Row>
//           <Col md={4}>
//             <Card bg="primary" text="white" className="mb-4">
//               <Card.Body>
//                 <Card.Title>Số người dùng</Card.Title>
//                 <h2>{userCount}</h2>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4}>
//             <Card bg="warning" text="white" className="mb-4">
//               <Card.Body>
//                 <Card.Title>Số lượng sản phẩm</Card.Title>
//                 <h2>0</h2> {/* Cập nhật sau nếu có API */}
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4}>
//             <Card bg="success" text="white" className="mb-4">
//               <Card.Body>
//                 <Card.Title>Số tiền thu được</Card.Title>
//                 <h2>0</h2> {/* Cập nhật sau nếu có API */}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </DashboardLayout>
//   );
// }

// export default AdminDashboard;

