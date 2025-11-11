import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spinner, Table, Modal, Button } from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from 'react-router-dom';
import chartsData from "../data.json";

function SalerDashboard() {
  const [sellerBooks, setSellerBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "seller") {
      alert("You don't have permission to access this page!");
      navigate("/"); // return to home page
    } else {
      axios.get("/database.json")
        .then(res => {
          const usersList = res.data.users || [];
          const booksList = res.data.books || [];
          setUsers(usersList);
          setBooks(booksList);
          setTotalUsers(usersList.length);
          setTotalBooks(booksList.length);
          const sellerInventory = res.data.inventory.filter(
            (item) => item.sellerId === currentUser.id
          );
          const sellerBookIds = sellerInventory.map((item) => item.bookId);
          const books = res.data.books.filter((book) =>
            sellerBookIds.includes(book.id)
          );
          setSellerBooks(books);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    }
  }, [navigate]);

  const sellerCharts = chartsData.saler;

  const areaChartPoints = useMemo(() => {
    const data = sellerCharts?.areaChart?.data || [];
    if (data.length === 0) return "";
    const width = 700;
    const height = 240;
    const padding = 30;
    const xs = data.map((_, i) => padding + (i * (width - 2 * padding)) / (data.length - 1 || 1));
    const ysRaw = data.map(d => d.value);
    const minY = Math.min(...ysRaw);
    const maxY = Math.max(...ysRaw);
    const scaleY = (v) => {
      if (maxY === minY) return height / 2;
      return padding + (height - 2 * padding) * (1 - (v - minY) / (maxY - minY));
    };
    const points = xs.map((x, i) => `${x},${scaleY(ysRaw[i])}`).join(" ");
    const areaPath = `M ${padding},${height - padding} L ${points.replaceAll(" ", " L ")} L ${width - padding},${height - padding} Z`;
    return { width, height, padding, points, areaPath, labels: data.map(d => d.month) };
  }, [sellerCharts]);

  const barChartBars = useMemo(() => {
    const data = sellerCharts?.barChart?.data || [];
    const width = 700;
    const height = 240;
    const padding = 30;
    const values = data.map(d => d.value);
    const maxY = Math.max(...values, 1);
    const barWidth = (width - 2 * padding) / (data.length || 1) * 0.6;
    const bars = data.map((d, i) => {
      const x = padding + i * ((width - 2 * padding) / (data.length || 1)) + (((width - 2 * padding) / (data.length || 1)) - barWidth) / 2;
      const barHeight = (height - 2 * padding) * (d.value / maxY);
      const y = height - padding - barHeight;
      return { x, y, barWidth, barHeight, label: d.month, value: d.value };
    });
    return { width, height, padding, bars };
  }, [sellerCharts]);

  return (
    <DashboardLayout>
      <h3 className="mb-4">Seller Dashboard</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card bg="primary" text="white" className="mb-4" style={{ cursor: "pointer" }} onClick={() => setShowUsersModal(true)}>
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <h2>{totalUsers}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card bg="success" text="white" className="mb-4" style={{ cursor: "pointer" }} onClick={() => setShowBooksModal(true)}>
                <Card.Body>
                  <Card.Title>Total Books</Card.Title>
                  <h2>{totalBooks}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Card className="mb-4">
                <Card.Header><strong>{sellerCharts?.areaChart?.title || "Area Chart"}</strong></Card.Header>
                <Card.Body>
                  <svg width="100%" height="240" viewBox={`0 0 ${areaChartPoints.width} ${areaChartPoints.height}`} preserveAspectRatio="none">
                    <path d={areaChartPoints.areaPath || ""} fill="rgba(54, 162, 235, 0.2)" />
                    <polyline points={areaChartPoints.points || ""} fill="none" stroke="#36A2EB" strokeWidth="2" />
                    {/* Circles and value labels */}
                    {(sellerCharts?.areaChart?.data || []).map((d, i) => {
                      const width = areaChartPoints.width;
                      const padding = areaChartPoints.padding;
                      const data = sellerCharts?.areaChart?.data || [];
                      const xs = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
                      const ysRaw = data.map(item => item.value);
                      const minY = Math.min(...ysRaw);
                      const maxY = Math.max(...ysRaw);
                      const height = areaChartPoints.height;
                      const scaleY = (v) => {
                        if (maxY === minY) return height / 2;
                        return padding + (height - 2 * padding) * (1 - (v - minY) / (maxY - minY));
                      };
                      const y = scaleY(d.value);
                      return (
                        <g key={i}>
                          <circle cx={xs} cy={y} r="3" fill="#36A2EB" />
                          <text x={xs} y={y - 8} fontSize="10" textAnchor="middle" fill="#2c3e50">{d.value}</text>
                        </g>
                      );
                    })}
                  </svg>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Card className="mb-4">
                <Card.Header><strong>{sellerCharts?.barChart?.title || "Bar Chart"}</strong></Card.Header>
                <Card.Body>
                  <svg width="100%" height="240" viewBox={`0 0 ${barChartBars.width} ${barChartBars.height}`} preserveAspectRatio="none">
                    {barChartBars.bars?.map((b, idx) => (
                      <g key={idx}>
                        <rect x={b.x} y={b.y} width={b.barWidth} height={b.barHeight} fill="#4BC0C0" />
                        <text x={b.x + b.barWidth / 2} y={b.y - 6} fontSize="10" textAnchor="middle" fill="#2c3e50">{b.value}</text>
                      </g>
                    ))}
                  </svg>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Users Modal */}
          <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Users ({totalUsers})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id}>
                      <td>{idx + 1}</td>
                      <td>{u.name || "-"}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowUsersModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Books Modal */}
          <Modal show={showBooksModal} onHide={() => setShowBooksModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Books ({totalBooks})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b, idx) => (
                    <tr key={b.id}>
                      <td>{idx + 1}</td>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>{(typeof b.price === "number" ? b.price : Number(b.price || 0)).toLocaleString()} VND</td>
                      <td>{b.source || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBooksModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </DashboardLayout>
  );
}

export default SalerDashboard;
