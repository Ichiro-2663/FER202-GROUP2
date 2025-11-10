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
} from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from 'react-router-dom';

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
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
      .get("http://localhost:9999/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (value) => {
    setNewCategory({ name: value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = newCategory.name.trim();

    if (/^\d/.test(name)) {
      setError("Category name cannot start with a number.");
      setSuccess(false);
      return;
    }

    const id = `c_${Date.now()}`;
    const payload = {
      id: id,
      name: name,
      createdAt: new Date().toISOString(),
    };

    axios
      .post("http://localhost:9999/categories", payload)
      .then(() => {
        setCategories([...categories, payload]);
        setNewCategory({ name: "" });
        setSuccess(true);
        setError("");
      })
      .catch((err) => {
        console.error("Error creating category:", err);
        setError("Failed to create category.");
        setSuccess(false);
      });
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <h3 className="mb-4">Category Management</h3>

      <Card>
        <Card.Header>
          <i className="fas fa-list me-2"></i> Category List
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading categories...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    {/* <td>{cat.id}</td> */}
                    <td>{cat.name}</td>
                    <td>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header>
          <i className="fas fa-plus me-2"></i> Add New Category
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert variant="success">Category added successfully!</Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
}

export default CategoryAdmin;


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
// // Function to convert Vietnamese text with diacritics to slug without diacritics, with hyphens
// const generateSlug = (text) => {
//   return text
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") // remove diacritics
//     .replace(/[^a-z0-9\s-]/g, "") // remove special characters
//     .trim()
//     .replace(/\s+/g, "-"); // replace spaces with hyphens
// };

// function CategoryAdmin() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newCategory, setNewCategory] = useState({ name: "" });
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
//     axios
//       .get("http://localhost:9999/categories")
//       .then((res) => {
//         setCategories(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading categories:", err);
//         setLoading(false);
//       });
//   }, []);

//   const handleChange = (value) => {
//     setNewCategory({ name: value });
//     setError(""); // reset error when user types again
//     setSuccess(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const name = newCategory.name.trim();

//     // Check if name starts with a number
//     if (/^\d/.test(name)) {
//       setError("Category name cannot start with a number.");
//       setSuccess(false);
//       return;
//     }

//     const slug = generateSlug(name);
//     const slugExists = categories.some(
//       (cat) => cat.slug.toLowerCase() === slug
//     );

//     if (slugExists) {
//       setError("Category & Slug already exist. Please choose a different name.");
//       setSuccess(false);
//       return;
//     }

//     const payload = {
//       id: `c_${slug}`,
//       name: name,
//       slug: slug,
//       createdAt: new Date().toISOString(),
//     };

//     axios
//       .post("http://localhost:9999/categories", payload)
//       .then(() => {
//         setCategories([...categories, payload]);
//         setNewCategory({ name: "" });
//         setSuccess(true);
//         setError("");
//       })
//       .catch((err) => {
//         console.error("Error creating category:", err);
//         setError("Failed to create category.");
//         setSuccess(false);
//       });
//   };

//   return (
//     <DashboardLayout sidebar={<Sidebar />}>
//       <h3 className="mb-4">Category Management</h3>

//       <Card>
//         <Card.Header>
//           <i className="fas fa-list me-2"></i> Category List
//         </Card.Header>
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-3">Loading categories...</p>
//             </div>
//           ) : (
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Slug</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categories.map((cat) => (
//                   <tr key={cat.id}>
//                     <td>{cat.name}</td>
//                     <td>{cat.slug}</td>
//                     <td>
//                       {cat.createdAt
//                         ? new Date(cat.createdAt).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Add New Form */}
//       <Card className="mt-4">
//         <Card.Header>
//           <i className="fas fa-plus me-2"></i> Add New Category
//         </Card.Header>
//         <Card.Body>
//           {success && (
//             <Alert variant="success">Category added successfully!</Alert>
//           )}
//           {error && <Alert variant="danger">{error}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={newCategory.name}
//                     onChange={(e) => handleChange(e.target.value)}
//                     required
//                   />
//                   {newCategory.name && (
//                     <Form.Text className="text-muted">
//                       Slug: <strong>{generateSlug(newCategory.name)}</strong>
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="primary" type="submit">
//               Add Category
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </DashboardLayout>
//   );
// }

// export default CategoryAdmin;
