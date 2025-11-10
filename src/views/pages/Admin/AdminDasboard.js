import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Spinner,
  Collapse,
  Form,
  Table,
  Pagination,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [bookPage, setBookPage] = useState(1);
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
    Promise.all([
      axios.get("http://localhost:9999/users"),
      axios.get("http://localhost:9999/books"),
    ])
      .then(([userRes, bookRes]) => {
        setUsers(userRes.data || []);
        setBooks(
          (bookRes.data || []).map((book) => ({
            ...book,
            authors: book.author ? [book.author] : [],
            categories: book.category
              ? [book.category.replace(/\*\*/g, "").trim()]
              : [],
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  const getSellerName = (sellerId) => {
    const seller = users.find((u) => u.id === sellerId && u.role === "seller");
    return seller ? seller.name : "N/A";
  };

  const allCategories = Array.from(
    new Set(books.flatMap((book) => book.categories))
  );

  const filteredBooks = books.filter((book) =>
    filterCategory ? book.categories.includes(filterCategory) : true
  );
  const renderEmptyMessage = (message) => (
    <p className="fw-bold text-danger">{message}</p>
  );

  const usersByRole = Object.entries(
    users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user.name);
      return acc;
    }, {})
  );

  const totalUserPages = Math.ceil(usersByRole.length / itemsPerPage);
  const paginatedUsers = usersByRole.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );

  const totalBookPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (bookPage - 1) * itemsPerPage,
    bookPage * itemsPerPage
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
            <Col md={6}>
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
                  <h2>{users.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
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
                  <h2>{books.length}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Product Statistics */}
          <Collapse in={activeSection === "products"}>
            <div>
              <Card>
                <Card.Header>
                  <strong>Books by category</strong>
                </Card.Header>
                <Card.Body>
                  <Form.Select
                    className="mb-3"
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setBookPage(1);
                    }}
                  >
                    <option value="">-- Filter category --</option>
                    {allCategories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>

                  {filteredBooks.length === 0 ? (
                    renderEmptyMessage("There is no book information")
                  ) : (
                    <>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Name of book</th>
                            <th>Authors</th>
                            <th>Category</th>
                            {/* <th>Name of Seller</th> */}
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedBooks.map((book, index) => (
                            <tr key={book.id}>
                              <td>{(bookPage - 1) * itemsPerPage + index + 1}</td>
                              <td>{book.title}</td>
                              <td>{book.authors.join(", ") || "N/A"}</td>
                              <td>{book.categories.join(", ") || "N/A"}</td>
                              {/* <td>{getSellerName(book.sellerId)}</td> */}
                              <td>1</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination>
                        {[...Array(totalBookPages)].map((_, i) => (
                          <Pagination.Item
                            key={i}
                            active={i + 1 === bookPage}
                            onClick={() => setBookPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Collapse>

          {/* User Statistics */}
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
                    <>
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
                          {paginatedUsers.map(([role, names], index) => (
                            <tr key={role}>
                              <td>{(userPage - 1) * itemsPerPage + index + 1}</td>
                              <td>{role}</td>
                              <td>{names.join(", ")}</td>
                              <td>{names.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination>
                        {[...Array(totalUserPages)].map((_, i) => (
                          <Pagination.Item
                            key={i}
                            active={i + 1 === userPage}
                            onClick={() => setUserPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </>
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
// import {
//   Card,
//   Row,
//   Col,
//   Spinner,
//   Table,
//   Collapse,
//   Form,
// } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
// import DashboardLayout from "../../components/DashboardLayout";
// import { useNavigate } from "react-router-dom";

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState(null);
//   const [filterCategory, setFilterCategory] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser || currentUser.role !== "admin") {
//       alert("You don't have permission to access this page!");
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     Promise.all([
//       axios.get("http://localhost:9999/users"),
//       axios.get("http://localhost:9999/books"),
//     ])
//       .then(([userRes, bookRes]) => {
//         setUsers(userRes.data || []);
//         setBooks(
//           (bookRes.data || []).map((book) => ({
//             ...book,
//             authors: book.author ? [book.author] : [],
//             categories: book.category
//               ? [book.category.replace(/\*\*/g, "").trim()]
//               : [],
//           }))
//         );
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//         setLoading(false);
//       });
//   }, []);

//   const getSellerName = (sellerId) => {
//     const seller = users.find((u) => u.id === sellerId && u.role === "seller");
//     return seller ? seller.name : "N/A";
//   };

//   const allCategories = Array.from(
//     new Set(books.flatMap((book) => book.categories))
//   );

//   const filteredBooks = books.filter((book) =>
//     filterCategory ? book.categories.includes(filterCategory) : true
//   );

//   const renderEmptyMessage = (message) => (
//     <p className="fw-bold text-danger">{message}</p>
//   );

//   return (
//     <DashboardLayout sidebar={<Sidebar />}>
//       <h3 className="mb-4">Dashboard</h3>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Loading...</p>
//         </div>
//       ) : (
//         <>
//           <Row>
//             <Col md={4}>
//               <Card
//                 bg="primary"
//                 text="white"
//                 className="mb-4"
//                 style={{ cursor: "pointer" }}
//                 onClick={() =>
//                   setActiveSection(activeSection === "users" ? null : "users")
//                 }
//               >
//                 <Card.Body>
//                   <Card.Title>Number of users</Card.Title>
//                   <h2>{users.length}</h2>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card
//                 bg="warning"
//                 text="white"
//                 className="mb-4"
//                 style={{ cursor: "pointer" }}
//                 onClick={() =>
//                   setActiveSection(
//                     activeSection === "products" ? null : "products"
//                   )
//                 }
//               >
//                 <Card.Body>
//                   <Card.Title>Number of products</Card.Title>
//                   <h2>{books.length}</h2>
//                 </Card.Body>
//               </Card>
//             </Col>
//             {/* <Col md={4}>
//               <Card
//                 bg="success"
//                 text="white"
//                 className="mb-4"
//                 style={{ cursor: "pointer" }}
//                 onClick={() =>
//                   setActiveSection(
//                     activeSection === "revenue" ? null : "revenue"
//                   )
//                 }
//               >
//                 <Card.Body>
//                   <Card.Title>Money received</Card.Title>
//                   <h2>0 VND</h2>
//                 </Card.Body>
//               </Card>
//             </Col> */}
//           </Row>
//           {/* Product Statistics */}
//           <Collapse in={activeSection === "products"}>
//             <div>
//               <Card>
//                 <Card.Header>
//                   <strong>
//                     Number of books:{" "}
//                     <span
//                       className={
//                         filteredBooks.length === 0
//                           ? "text-danger fw-bold"
//                           : ""
//                       }
//                     >
//                       {filteredBooks.length}
//                     </span>
//                   </strong>
//                 </Card.Header>
//                 <Card.Body>
//                   <Form.Select
//                     className="mb-3"
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                   >
//                     <option value="">-- Filter category --</option>
//                     {allCategories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </Form.Select>

//                   {filteredBooks.length === 0 ? (
//                     renderEmptyMessage("There is no book information")
//                   ) : (
//                     <Table striped bordered hover responsive>
//                       <thead>
//                         <tr>
//                           <th>No</th>
//                           <th>Name of book</th>
//                           <th>Authors</th>
//                           <th>Category</th>
//                           <th>Name of Seller</th>
//                           <th>Quantity</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredBooks.map((book, index) => (
//                           <tr key={book.id}>
//                             <td>{index + 1}</td>
//                             <td>{book.title}</td>
//                             <td>
//                               {book.authors.length > 0
//                                 ? book.authors.join(", ")
//                                 : "N/A"}
//                             </td>
//                             <td>
//                               {book.categories.length > 0
//                                 ? book.categories.join(", ")
//                                 : "N/A"}
//                             </td>
//                             <td>{getSellerName(book.sellerId)}</td>
//                             <td>1</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Card.Body>
//               </Card>
//             </div>
//           </Collapse>

//           {/* User Statistics */}
//           <Collapse in={activeSection === "users"}>
//             <div>
//               <Card>
//                 <Card.Header>
//                   <strong>User statistics by role</strong>
//                 </Card.Header>
//                 <Card.Body>
//                   {users.length === 0 ? (
//                     renderEmptyMessage("There is no user information")
//                   ) : (
//                     <Table striped bordered hover responsive>
//                       <thead>
//                         <tr>
//                           <th>No</th>
//                           <th>Role</th>
//                           <th>Name of users</th>
//                           <th>Quantity</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {Object.entries(
//                           users.reduce((acc, user) => {
//                             if (!acc[user.role]) acc[user.role] = [];
//                             acc[user.role].push(user.name);
//                             return acc;
//                           }, {})
//                         ).map(([role, names], index) => (
//                           <tr key={role}>
//                             <td>{index + 1}</td>
//                             <td>{role}</td>
//                             <td>{names.join(", ")}</td>
//                             <td>{names.length}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Card.Body>
//               </Card>
//             </div>
//           </Collapse>

//           {/* Revenue Statistics */}
//           <Collapse in={activeSection === "revenue"}>
//             <div>
//               <Card>
//                 <Card.Header>
//                   <strong>Statistics of collected money</strong>
//                 </Card.Header>
//                 <Card.Body>
//                   {renderEmptyMessage("There is no purchase information")}
//                 </Card.Body>
//               </Card>
//             </div>
//           </Collapse>
//         </>
//       )}
//     </DashboardLayout>
//   );
// }

// export default AdminDashboard;




