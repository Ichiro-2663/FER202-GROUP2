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
  Button,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function ManageAccount() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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
        return <Badge bg="danger">Locked</Badge>;
      case "requested":
        return <Badge bg="warning">Requested to Seller?</Badge>;
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
      const matchStatus = filterStatus ? user.status === filterStatus : true;
      return matchSearch && matchRole && matchStatus;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateUserStatus = (userId, newStatus) => {
    axios
      .patch(`http://localhost:9999/users/${userId}`, {
        status: newStatus,
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, status: newStatus } : u
          )
        );
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update account status.");
      });
  };

  // const updateUserStatus = (userId, newStatus) => {
  //   const updatedUser = users.find((u) => u.id === userId);
  //   if (!updatedUser) return;

  //   axios
  //     .put(`http://localhost:9999/users/${userId}`, {
  //       ...updatedUser,
  //       status: newStatus,
  //     })
  //     .then(() => {
  //       const updatedList = users.map((u) =>
  //         u.id === userId ? { ...u, status: newStatus } : u
  //       );
  //       setUsers(updatedList);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating status:", error);
  //       alert("Failed to update account status.");
  //     });
  // };

  const handleToggleLock = (user) => {
    const isLocked = user.status === "disabled";
    const confirmText = isLocked
      ? "Are you sure you want to unlock this account?"
      : "Are you sure you want to lock this account?";
    if (window.confirm(confirmText)) {
      let newStatus;

      if (isLocked) {
        // Khi mở khóa thì trả về previousStatus
        newStatus = user.previousStatus || "active";
      } else {
        // Khi khóa lại thì lưu previousStatus
        newStatus = "disabled";
        axios.patch(`http://localhost:9999/users/${user.id}`, {
          previousStatus: user.status, // lưu trạng thái trước khi bị khóa
          status: newStatus,
        });
        return;
      }

      updateUserStatus(user.id, newStatus);
    }
  };

  



  const handleDeleteAccount = (userId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      axios
        .delete(`http://localhost:9999/users/${userId}`)
        .then(() => {
          setUsers(users.filter((u) => u.id !== userId));
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          alert("Failed to delete account.");
        });
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-4">Account Management</h3>

      {/* Search and filter */}
      <Row className="mb-3">
        <Col md={6}>
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
        <Col md={3}>
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
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="approved">Approved</option>
            <option value="disabled">Locked</option>
            <option value="requested">Requested (Become Seller)</option>
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
                    <th style={{ width: '200px' }}>Status</th>
                    <th>Actions</th>
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
                        <Button
                          variant={user.status === "disabled" ? "success" : "warning"}
                          size="sm"
                          className="me-2"
                          onClick={() => handleToggleLock(user)}
                        >
                          <i
                            className={`fas ${user.status === "disabled" ? "fa-unlock" : "fa-lock"
                              }`}
                          ></i>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAccount(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
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
//   Pagination,
//   Button,
// } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
// import DashboardLayout from "../../components/DashboardLayout";
// import { useNavigate } from "react-router-dom";

// function ManageAccount() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterRole, setFilterRole] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser || currentUser.role !== "admin") {
//       alert("You don't have permission to access this page!");
//       navigate("/");
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
//         return <Badge bg="danger">Locked</Badge>;
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
//       const matchStatus = filterStatus
//         ? user.status === filterStatus
//         : true;
//       return matchSearch && matchRole && matchStatus;
//     });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleLockAccount = (userId) => {
//     if (window.confirm("Are you sure you want to lock this account?")) {
//       const updatedUser = users.find((u) => u.id === userId);
//       if (!updatedUser) return;
//       axios
//         .put(`http://localhost:9999/users/${userId}`, {
//           ...updatedUser,
//           status: "disabled",
//         })
//         .then(() => {
//           const updatedList = users.map((u) =>
//             u.id === userId ? { ...u, status: "disabled" } : u
//           );
//           setUsers(updatedList);
//         })
//         .catch((error) => {
//           console.error("Error locking account:", error);
//           alert("Failed to lock account.");
//         });
//     }
//   };

//   const handleDeleteAccount = (userId) => {
//     if (window.confirm("Are you sure you want to delete this account?")) {
//       axios
//         .delete(`http://localhost:9999/users/${userId}`)
//         .then(() => {
//           setUsers(users.filter((u) => u.id !== userId));
//         })
//         .catch((error) => {
//           console.error("Error deleting account:", error);
//           alert("Failed to delete account.");
//         });
//     }
//   };

//   return (
//     <DashboardLayout sidebar={<Sidebar />}>
//       <h3 className="mb-4">Account Management</h3>

//       {/* Search and filter */}
//       <Row className="mb-3">
//         <Col md={6}>
//           <Form.Control
//             type="search"
//             placeholder="Search by email or name..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </Col>
//         <Col md={3}>
//           <Form.Select
//             value={filterRole}
//             onChange={(e) => {
//               setFilterRole(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All roles</option>
//             <option value="seller">Seller</option>
//             <option value="customer">Customer</option>
//           </Form.Select>
//         </Col>
//         <Col md={3}>
//           <Form.Select
//             value={filterStatus}
//             onChange={(e) => {
//               setFilterStatus(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="">All statuses</option>
//             <option value="active">Active</option>
//             <option value="disabled">Locked</option>
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
//             <>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Email</th>
//                     <th>Name</th>
//                     <th>Role</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedUsers.map((user) => (
//                     <tr key={user.id}>
//                       <td>{user.email}</td>
//                       <td>{user.name}</td>
//                       <td>{getRoleLabel(user.role)}</td>
//                       <td>{getStatusBadge(user.status)}</td>
//                       <td>
//                         <Button
//                           variant="warning"
//                           size="sm"
//                           className="me-2"
//                           onClick={() => handleLockAccount(user.id)}
//                         >
//                           <i className="fas fa-lock"></i>
//                         </Button>
//                         <Button
//                           variant="danger"
//                           size="sm"
//                           onClick={() => handleDeleteAccount(user.id)}
//                         >
//                           <i className="fas fa-trash"></i>
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>

//               {/* Pagination */}
//               <Pagination>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <Pagination.Item
//                     key={i}
//                     active={i + 1 === currentPage}
//                     onClick={() => setCurrentPage(i + 1)}
//                   >
//                     {i + 1}
//                   </Pagination.Item>
//                 ))}
//               </Pagination>
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </DashboardLayout>
//   );
// }

// export default ManageAccount;
