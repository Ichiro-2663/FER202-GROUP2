import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Spinner,
  Table,
  Collapse,
  Form,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
 const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/"); // quay lại trang chủ
    }
  }, [navigate]);
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:9999/users"),
      axios.get("http://localhost:9999/books"),
      axios.get("http://localhost:9999/categories"),
    ])
      .then(([userRes, bookRes, categoryRes]) => {
        setUsers(userRes.data);
        setBooks(bookRes.data);
        setCategories(categoryRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Không rõ";
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

  const filteredBooks = books.filter((book) =>
    filterCategory ? book.categoryIds.includes(filterCategory) : true
  );

  // Giả lập dữ liệu mua hàng (hiện tại chưa có)
  const purchaseStats = []; // nếu có: [{ name: "Le Thi B", amount: 120000 }, ...]

  const renderEmptyMessage = (message) => (
    <p className="fw-bold text-danger">{message}</p>
  );

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-4">Dashboard</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
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
                  setActiveSection(activeSection === "users" ? null : "users")
                }
              >
                <Card.Body>
                  <Card.Title>Number of users</Card.Title>
                  <h2 className={users.length === 0 ? "text-danger fw-bold" : ""}>
                    {users.length === 0 ? "0" : users.length}
                  </h2>
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
                  <Card.Title>Number of products</Card.Title>
                  <h2 className={books.length === 0 ? "text-danger fw-bold" : ""}>
                    {books.length === 0 ? "0" : books.length}
                  </h2>
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
                  <Card.Title>Money received</Card.Title>
                  <h2
                    className={
                      purchaseStats.length === 0 ? "text-danger fw-bold" : ""
                    }
                  >
                    {purchaseStats.length === 0
                      ? "0 "
                      : purchaseStats
                          .reduce((sum, item) => sum + item.amount, 0)
                          .toLocaleString() + " VND"}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Thống kê người dùng */}
          <Collapse in={activeSection === "users"}>
            <div>
              <Card>
                <Card.Header>
                  <strong>User statistics by role</strong>
                </Card.Header>
                <Card.Body>
                  {users.length === 0 ? (
                    renderEmptyMessage("There is no user information")
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Role</th>
                          <th>Name of users</th>
                          <th>Quantity</th>
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
                  )}
                </Card.Body>
              </Card>
            </div>
          </Collapse>

          {/* Thống kê sản phẩm */}
          <Collapse in={activeSection === "products"}>
            <div>
              <Card>
                <Card.Header>
                  <strong>
                    Number of books:{" "}
                    <span
                      className={
                        filteredBooks.length === 0 ? "text-danger fw-bold" : ""
                      }
                    >
                      {filteredBooks.length}
                    </span>
                  </strong>
                </Card.Header>
                <Card.Body>
                  <Form.Select
                    className="mb-3"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">-- Filter category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>

                  {filteredBooks.length === 0 ? (
                    renderEmptyMessage("There is no book information")
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name of book</th>
                          <th>Authors</th>
                          <th>Category</th>
                          <th>Name of Seller</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBooks.map((book, index) => (
                          <tr key={book.id}>
                            <td>{index + 1}</td>
                            <td>{book.title}</td>
                            <td>{book.authors.join(", ")}</td>
                            <td>
                              {book.categoryIds
                                .map((id) => getCategoryName(id))
                                .join(", ")}
                            </td>
                            <td>N/A</td>
                            <td>1</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Collapse>

          {/* Thống kê doanh thu */}
          <Collapse in={activeSection === "revenue"}>
            <div>
              <Card>
                <Card.Header>
                  <strong>Statistics of collected money</strong>
                </Card.Header>
                <Card.Body>
                  {purchaseStats.length === 0 ? (
                    renderEmptyMessage("There is no purchase information")
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Customer</th>
                          <th>Money (VND)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseStats.map((entry, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td>{entry.amount.toLocaleString()} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
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

