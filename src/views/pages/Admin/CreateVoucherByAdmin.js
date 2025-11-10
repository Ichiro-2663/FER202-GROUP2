import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Pagination,
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

function CreateVoucher() {
  const [voucher, setVoucher] = useState({
    code: "",
    type: "percentage",
    value: 0,
    validFrom: "",
    validTo: "",
    usageLimit: 100,
    createdBy: "u_admin",
    appliesTo: "global",
  });

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("You don't have permission to access this page!");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = () => {
    axios
      .get("http://localhost:9999/vouchers")
      .then((res) => {
        setVouchers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading vouchers:", err);
        setLoading(false);
      });
  };

  const handleChange = (field, value) => {
    setVoucher({ ...voucher, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const codeExists = vouchers.some(
      (v) => v.code.trim().toLowerCase() === voucher.code.trim().toLowerCase()
    );

    if (codeExists) {
      setError("Voucher code already exists.");
      setSuccess(false);
      return;
    }

    const fromDate = new Date(voucher.validFrom);
    const toDate = new Date(voucher.validTo);

    if (fromDate >= toDate) {
      setError("Valid From date must be earlier than Valid To date.");
      setSuccess(false);
      return;
    }

   const value = parseInt(voucher.value);
    if (isNaN(value)) {
      setError("Voucher value must be a valid number.");
      setSuccess(false);
      return;
    }

    if (voucher.type === "amount" && value < 1000) {
      setError("Voucher value must be at least 1000 for fixed amount type.");
      setSuccess(false);
      return;
    }



    axios
      .post("http://localhost:9999/vouchers", {
        ...voucher,
        value: value,
      })
      .then(() => {
        setSuccess(true);
        setError("");
        setVoucher({
          code: "",
          type: "percentage",
          value: 0,
          validFrom: "",
          validTo: "",
          usageLimit: 100,
          createdBy: "admin",
          appliesTo: "global",
        });
        fetchVouchers();
      })
      .catch((err) => {
        console.error("Error creating voucher:", err);
        setError("Failed to create voucher.");
        setSuccess(false);
      });
  };

  const totalPages = Math.ceil(vouchers.length / itemsPerPage);
  const paginatedVouchers = vouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
      if (window.confirm("Are you sure you want to delete this voucher?")) {
        axios
          .delete(`http://localhost:9999/vouchers/${id}`)
          .then(() => {
            fetchVouchers(); // reload list
          })
          .catch((err) => {
            console.error("Error deleting voucher:", err);
            alert("Failed to delete voucher.");
          });
      }
    };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-2">Voucher Management</h3>

      {/* Create Voucher Form */}
      <Card className="mb-3">
        <Card.Header>
          <i className="fas fa-plus me-2"></i> Create New Voucher
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert variant="success">Voucher created successfully!</Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={voucher.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={voucher.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Fixed Amount</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
              <Form.Group className="mb-2">
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={voucher.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    required
                    step={voucher.type === "percentage" ? "0.01" : "1"}
                    {...(voucher.type === "amount" ? { min: 1000 } : {})}
                  />
                  <Form.Text className="text-muted">
                    {voucher.type === "amount"
                      ? "Minimum value: 1000 VND"
                      : "Percentage must bigger than 0"}
                  </Form.Text>
              </Form.Group>
                
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Usage Limit</Form.Label>
                  <Form.Control
                    type="number"
                    value={voucher.usageLimit}
                    onChange={(e) =>
                      handleChange("usageLimit", parseInt(e.target.value))
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valid From</Form.Label>
                  <Form.Control
                    type="date"
                    value={voucher.validFrom}
                    onChange={(e) => handleChange("validFrom", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valid To</Form.Label>
                  <Form.Control
                    type="date"
                    value={voucher.validTo}
                    onChange={(e) => handleChange("validTo", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Applies To</Form.Label>
              <Form.Control type="text" value="global" disabled readOnly />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Voucher
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Voucher Table */}
      <Card className="mb-4">
        <Card.Header>
          <i className="fas fa-ticket-alt me-2"></i> Existing Vouchers
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading vouchers...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-muted">No vouchers available.</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Usage</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVouchers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.code}</td>
                      <td>{v.type}</td>
                      <td>
                        {v.type === "percentage"
                          ? `${v.value}%`
                          : `${v.value.toLocaleString()} VND`}
                      </td>
                      <td>{v.validFrom}</td>
                      <td>{v.validTo}</td>
                      <td>
                        {v.usedCount || 0} / {v.usageLimit}
                      </td>
                      <td>{v.createdBy ||'Saler'}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(v.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  />
                </Pagination>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default CreateVoucher;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   Table,
//   Form,
//   Button,
//   Row,
//   Col,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import Sidebar from "../../components/Sidebar";
// import DashboardLayout from "../../components/DashboardLayout";
// import { useNavigate } from 'react-router-dom';
// function CreateVoucher() {
//   const [voucher, setVoucher] = useState({
//     code: "",
//     type: "percentage",
//     value: 0,
//     validFrom: "",
//     validTo: "",
//     usageLimit: 100,
//     createdBy: "u_admin",
//     appliesTo: "global",
//   });

//   const [vouchers, setVouchers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//  const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     if (!currentUser || currentUser.role !== "admin") {
//       alert("You don't have permission to access this page!");
//       navigate("/"); // return to home page
//     }
//   }, [navigate]);
//   useEffect(() => {
//     fetchVouchers();
//   }, []);

//   const fetchVouchers = () => {
//     axios
//       .get("http://localhost:9999/vouchers")
//       .then((res) => {
//         setVouchers(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading vouchers:", err);
//         setLoading(false);
//       });
//   };

//   const handleChange = (field, value) => {
//     setVoucher({ ...voucher, [field]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const codeExists = vouchers.some(
//       (v) => v.code.trim().toLowerCase() === voucher.code.trim().toLowerCase()
//     );

//     if (codeExists) {
//       setError("Voucher code already exists.");
//       setSuccess(false);
//       return;
//     }

//     const fromDate = new Date(voucher.validFrom);
//     const toDate = new Date(voucher.validTo);

//     if (fromDate >= toDate) {
//       setError("Valid From date must be earlier than Valid To date.");
//       setSuccess(false);
//       return;
//     }

//     const value = parseInt(voucher.value);
//     if (isNaN(value) || value < 1000) {
//       setError("Voucher value must be at least 1000.");
//       setSuccess(false);
//       return;
//     }

//     axios
//       .post("http://localhost:9999/vouchers", {
//         ...voucher,
//         value: value,
//       })
//       .then(() => {
//         setSuccess(true);
//         setError("");
//         setVoucher({
//           code: "",
//           type: "percentage",
//           value: 0,
//           validFrom: "",
//           validTo: "",
//           usageLimit: 100,
//           createdBy: "admin",
//           appliesTo: "global",
//         });
//         fetchVouchers();
//       })
//       .catch((err) => {
//         console.error("Error creating voucher:", err);
//         setError("Failed to create voucher.");
//         setSuccess(false);
//       });
//   };

//   return (
//     <DashboardLayout sidebar={<Sidebar />}>
//       <h3 className="mb-4">Voucher Management</h3>

//       {/* Create Voucher Form */}
//       <Card className="mb-4">
//         <Card.Header>
//           <i className="fas fa-plus me-2"></i> Create New Voucher
//         </Card.Header>
//         <Card.Body>
//           {success && (
//             <Alert variant="success">Voucher created successfully!</Alert>
//           )}
//           {error && <Alert variant="danger">{error}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Code</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={voucher.code}
//                     onChange={(e) => handleChange("code", e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Type</Form.Label>
//                   <Form.Select
//                     value={voucher.type}
//                     onChange={(e) => handleChange("type", e.target.value)}
//                   >
//                     <option value="percentage">Percentage</option>
//                     <option value="amount">Fixed Amount</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Value</Form.Label>
//                   <Form.Control
//                     type="number"
//                     value={voucher.value}
//                     onChange={(e) =>
//                       handleChange("value", parseInt(e.target.value))
//                     }
//                     required
//                     min={1000}
//                   />
//                   <Form.Text className="text-muted">
//                     Minimum value: 1000
//                   </Form.Text>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Usage Limit</Form.Label>
//                   <Form.Control
//                     type="number"
//                     value={voucher.usageLimit}
//                     onChange={(e) =>
//                       handleChange("usageLimit", parseInt(e.target.value))
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Valid From</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={voucher.validFrom}
//                     onChange={(e) => handleChange("validFrom", e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Valid To</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={voucher.validTo}
//                     onChange={(e) => handleChange("validTo", e.target.value)}
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Applies To</Form.Label>
//               <Form.Control type="text" value="global" disabled readOnly />
//             </Form.Group>

//             <Button variant="primary" type="submit">
//               Create Voucher
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>


//       {/* Voucher Table */}
//       <Card className="mb-4">
//         <Card.Header>
//           <i className="fas fa-ticket-alt me-2"></i> Existing Vouchers
//         </Card.Header>
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Loading vouchers...</p>
//             </div>
//           ) : vouchers.length === 0 ? (
//             <p className="text-muted">No vouchers available.</p>
//           ) : (
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>Code</th>
//                   <th>Type</th>
//                   <th>Value</th>
//                   <th>Valid From</th>
//                   <th>Valid To</th>
//                   <th>Usage</th>
//                   <th>Created By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {vouchers.map((v) => (
//                   <tr key={v.id}>
//                     <td>{v.code}</td>
//                     <td>{v.type}</td>
//                     <td>
//                       {v.type === "percentage"
//                         ? `${v.value}%`
//                         : `${v.value.toLocaleString()} VND`}
//                     </td>
//                     <td>{v.validFrom}</td>
//                     <td>{v.validTo}</td>
//                     <td>
//                       {v.usedCount || 0} / {v.usageLimit}
//                     </td>
//                     <td>{v.createdBy}</td>
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

// export default CreateVoucher;
