import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";

function ManageAccount() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9999/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "seller":
        return "Seller";
      case "customer":
        return "Customer";
      default:
        return "Unknown";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "approved":
        return <Badge bg="primary">Approved</Badge>;
      case "disabled":
        return <Badge bg="danger">Disabled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
      const matchSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = filterRole ? user.role === filterRole : true;

      return matchSearch && matchRole;
    });

  const handleDisableChange = (userId, value) => {
    const updatedUser = users.find((u) => u.id === userId);
    if (!updatedUser) return;

    const newStatus = value === "disabled" ? "disabled" : "active";

    axios
      .put(`http://localhost:9999/users/${userId}`, {
        ...updatedUser,
        status: newStatus,
      })
      .then(() => {
        const updatedList = users.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u
        );
        setUsers(updatedList);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update status.");
      });
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-4">Account Management</h3>

      {/* Search and filter */}
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="search"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All roles</option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </Form.Select>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <i className="fas fa-users me-2"></i> User List
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading data...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Disabled?</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{getRoleLabel(user.role)}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={user.status === "disabled" ? "disabled" : "none"}
                        onChange={(e) =>
                          handleDisableChange(user.id, e.target.value)
                        }
                      >
                        <option value="none">None</option>
                        <option value="disabled">Disabled</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default ManageAccount;



// // File: ManageAccount.js

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, Table, Form, Spinner, Button, Modal, Row, Col } from "react-bootstrap";
// import DashboardLayout from "../components/DashboardLayout";
// import Topbar from "../components/Topbar";

// function ManageAccount() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:9999/users")
//       .then((response) => {
//         setUsers(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi tải danh sách người dùng:", error);
//         setLoading(false);
//       });
//   }, []);

//   const getRoleLabel = (role) => {
//     switch (role) {
//       case "admin":
//         return "Admin";
//       case "seller":
//         return "Employee";
//       case "customer":
//         return "Customer";
//       default:
//         return "Unknown";
//     }
//   };

//   const getRoleValue = (label) => {
//     switch (label) {
//       case "Employee":
//         return "seller";
//       case "Customer":
//         return "customer";
//       default:
//         return "unknown";
//     }
//   };

//   const filteredUsers = users
//     .filter((user) => user.role !== "admin")
//     .filter((user) => {
//       const matchSearch =
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.name.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchRole = filterRole ? user.role === filterRole : true;

//       return matchSearch && matchRole;
//     });

//   const handleEditClick = (user) => {
//     setEditingUser({ ...user });
//     setShowModal(true);
//   };

//   const handleSave = () => {
//     axios
//       .put(`http://localhost:9999/users/${editingUser.id}`, editingUser)
//       .then(() => {
//         const updatedUsers = users.map((u) =>
//           u.id === editingUser.id ? editingUser : u
//         );
//         setUsers(updatedUsers);
//         alert("✅ Cập nhật thành công!");
//         setShowModal(false);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi cập nhật người dùng:", error);
//         alert("❌ Có lỗi xảy ra khi cập nhật.");
//       });
//   };

//   return (
//     <DashboardLayout>
//       <h3 className="mb-4">Quản lý tài khoản</h3>

//       {/* Tìm kiếm và lọc */}
//       <Row className="mb-3">
//         <Col md={8}>
//           <Form.Control
//             type="search"
//             placeholder="Tìm kiếm theo email hoặc họ tên..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </Col>
//         <Col md={4}>
//           <Form.Select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//           >
//             <option value="">Tất cả vai trò</option>
//             <option value="seller">Employee</option>
//             <option value="customer">Customer</option>
//           </Form.Select>
//         </Col>
//       </Row>

//       <Card>
//         <Card.Header>
//           <i className="fas fa-users me-2"></i> Danh sách tài khoản
//         </Card.Header>
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Đang tải dữ liệu...</p>
//             </div>
//           ) : (
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>Email</th>
//                   <th>Họ tên</th>
//                   <th>Vai trò</th>
//                   <th>Chức năng</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.email}</td>
//                     <td>{user.name}</td>
//                     <td>{getRoleLabel(user.role)}</td>
//                     <td>
//                       <Button
//                         variant="warning"
//                         size="sm"
//                         onClick={() => handleEditClick(user)}
//                       >
//                         Sửa
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Modal chỉnh sửa */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {editingUser && (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, email: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Họ tên</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, name: e.target.value })
//                   }
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Vai trò</Form.Label>
//                 <Form.Select
//                   value={getRoleLabel(editingUser.role)}
//                   onChange={(e) =>
//                     setEditingUser({
//                       ...editingUser,
//                       role: getRoleValue(e.target.value),
//                     })
//                   }
//                 >
//                   <option>Employee</option>
//                   <option>Customer</option>
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Hủy
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Lưu thay đổi
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </DashboardLayout>
//   );
// }

// export default ManageAccount;

