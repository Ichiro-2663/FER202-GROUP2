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
  Pagination,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function ManageAccount() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/");
    }
  }, [navigate]);

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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
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
            <>
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
                  {paginatedUsers.map((user) => (
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

              {/* Pagination */}
              <Pagination>
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default ManageAccount;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   Table,
//   Form,
//   Spinner,
//   Row,
//   Col,
//   Badge,
// } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
// import DashboardLayout from "../../components/DashboardLayout";
// import { useNavigate } from "react-router-dom";
// function ManageAccount() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("");
//  const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser || currentUser.role !== "admin") {
//       alert("You don't have permission to access this page!");
//       navigate("/"); // return to home page
//     }
//   }, [navigate]);
//   useEffect(() => {
//     axios
//       .get("http://localhost:9999/users")
//       .then((response) => {
//         setUsers(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//         setLoading(false);
//       });
//   }, []);

//   const getRoleLabel = (role) => {
//     switch (role) {
//       case "admin":
//         return "Admin";
//       case "seller":
//         return "Seller";
//       case "customer":
//         return "Customer";
//       default:
//         return "Unknown";
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "active":
//         return <Badge bg="success">Active</Badge>;
//       case "approved":
//         return <Badge bg="primary">Approved</Badge>;
//       case "disabled":
//         return <Badge bg="danger">Disabled</Badge>;
//       default:
//         return <Badge bg="secondary">Unknown</Badge>;
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

//   const handleDisableChange = (userId, value) => {
//     const updatedUser = users.find((u) => u.id === userId);
//     if (!updatedUser) return;

//     const newStatus = value === "disabled" ? "disabled" : "active";

//     axios
//       .put(`http://localhost:9999/users/${userId}`, {
//         ...updatedUser,
//         status: newStatus,
//       })
//       .then(() => {
//         const updatedList = users.map((u) =>
//           u.id === userId ? { ...u, status: newStatus } : u
//         );
//         setUsers(updatedList);
//       })
//       .catch((error) => {
//         console.error("Error updating status:", error);
//         alert("Failed to update status.");
//       });
//   };

//   return (
//     <DashboardLayout sidebar={<Sidebar />}>
//       <h3 className="mb-4">Account Management</h3>

//       {/* Search and filter */}
//       <Row className="mb-3">
//         <Col md={8}>
//           <Form.Control
//             type="search"
//             placeholder="Search by email or name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </Col>
//         <Col md={4}>
//           <Form.Select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//           >
//             <option value="">All roles</option>
//             <option value="seller">Seller</option>
//             <option value="customer">Customer</option>
//           </Form.Select>
//         </Col>
//       </Row>

//       <Card>
//         <Card.Header>
//           <i className="fas fa-users me-2"></i> User List
//         </Card.Header>
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Loading data...</p>
//             </div>
//           ) : (
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>Email</th>
//                   <th>Name</th>
//                   <th>Role</th>
//                   <th>Status</th>
//                   <th>Disabled?</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.email}</td>
//                     <td>{user.name}</td>
//                     <td>{getRoleLabel(user.role)}</td>
//                     <td>{getStatusBadge(user.status)}</td>
//                     <td>
//                       <Form.Select
//                         size="sm"
//                         value={user.status === "disabled" ? "disabled" : "none"}
//                         onChange={(e) =>
//                           handleDisableChange(user.id, e.target.value)
//                         }
//                       >
//                         <option value="none">None</option>
//                         <option value="disabled">Disabled</option>
//                       </Form.Select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </Card.Body>
//       </Card>
//     </DashboardLayout>
//   );
// }

// export default ManageAccount;

