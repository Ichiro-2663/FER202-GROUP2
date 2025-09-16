import React from "react";
import { Card, Row, Col, Table, Form, Button } from "react-bootstrap";
import DashboardLayout from "../components/DashboardLayout";
import data from "../data.json";

function AdminDashboard() {
  const { title, cards, areaChart, barChart, dataTable } = data.admin;

  // Simple chart placeholder component
  const AreaChartPlaceholder = ({ data, title }) => (
    <div style={{ height: '300px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '20px' }}>
      <h6><i className="fas fa-chart-area me-2"></i>{title}</h6>
      <div style={{ height: '250px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', paddingTop: '20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: 'center', flex: 1 }}>
            <div 
              style={{ 
                height: `${(item.value / 40000) * 200}px`, 
                backgroundColor: '#007bff', 
                marginBottom: '5px',
                borderRadius: '2px'
              }}
            ></div>
            <small style={{ fontSize: '10px' }}>{item.month}</small>
          </div>
        ))}
      </div>
    </div>
  );

  const BarChartPlaceholder = ({ data, title }) => (
    <div style={{ height: '300px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '20px' }}>
      <h6><i className="fas fa-chart-bar me-2"></i>{title}</h6>
      <div style={{ height: '250px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', paddingTop: '20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ textAlign: 'center', flex: 1, margin: '0 2px' }}>
            <div 
              style={{ 
                height: `${(item.value / 15000) * 200}px`, 
                backgroundColor: '#007bff', 
                marginBottom: '5px',
                borderRadius: '2px'
              }}
            ></div>
            <small style={{ fontSize: '10px' }}>{item.month}</small>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">{title}</li>
          </ol>
        </nav>
      </div>

      {/* Cards Row */}
      <Row className="mb-4">
        {cards.map((card, index) => (
          <Col md={3} key={index}>
            <Card bg={card.type} text="white" className="mb-4">
              <Card.Body>
                <Card.Title>{card.text}</Card.Title>
                <Card.Text>
                  {card.actionText}
                  <span className="float-end">
                    <i className="fas fa-arrow-circle-right"></i>
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <AreaChartPlaceholder data={areaChart.data} title={areaChart.title} />
        </Col>
        <Col md={6}>
          <BarChartPlaceholder data={barChart.data} title={barChart.title} />
        </Col>
      </Row>

      {/* DataTable */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                <i className="fas fa-table me-2"></i>
                {dataTable.title}
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3 d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <Form.Select size="sm" style={{ width: 'auto' }}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </Form.Select>
                  <span className="ms-2">entries</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Search:</span>
                  <Form.Control 
                    type="text" 
                    size="sm" 
                    style={{ width: '200px' }}
                    placeholder=""
                  />
                </div>
              </div>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name <i className="fas fa-sort"></i></th>
                    <th>Position <i className="fas fa-sort"></i></th>
                    <th>Office <i className="fas fa-sort"></i></th>
                    <th>Age <i className="fas fa-sort"></i></th>
                    <th>Start date <i className="fas fa-sort"></i></th>
                    <th>Salary <i className="fas fa-sort"></i></th>
                  </tr>
                </thead>
                <tbody>
                  {dataTable.data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.name}</td>
                      <td>{row.position}</td>
                      <td>{row.office}</td>
                      <td>{row.age}</td>
                      <td>{row.startDate}</td>
                      <td>{row.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

export default AdminDashboard;
