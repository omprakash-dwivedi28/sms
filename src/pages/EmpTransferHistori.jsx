import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/css/EmpAnalysis.css"; // Assuming you create a CSS file for custom styles

function EmpTransferHistori() {
  const [pfNo, setPfNo] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setPfNo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/getEmpHistory.php?pf_no=${pfNo}`
      );
      const data = await response.json();
      if (data.success) {
        setEmployeeDetails(data.employees); // Set employees data from the API
        setErrorMessage("");
      } else {
        setErrorMessage(data.message);
        setEmployeeDetails([]);
      }
    } catch (error) {
      setErrorMessage("Error fetching data");
      setEmployeeDetails([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const calculateWorkingYears = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); // 365.25 to account for leap years
    return diffYears.toFixed(1); // Return the result rounded to 1 decimal place
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-sm p-4 mb-5 bg-white rounded"
        style={{ overflow: "auto", width: "75rem" }}
      >
        <Card.Body style={{ height: "550px" }}>
          <Card.Title className="text-center mb-4 display-6 text-primary">
            Employee Transfer History
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text className="input-label">PF NO</InputGroup.Text>
              <Form.Control
                name="pf_no"
                value={pfNo}
                onChange={handleInputChange}
                aria-label="pf_no"
                required
                className="input-field"
              />
            </InputGroup>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit" className="submit-button">
                Submit
              </Button>
            </div>
          </Form>
          {errorMessage && (
            <div className="text-center mt-3 text-danger error-message">
              {errorMessage}
            </div>
          )}
          {employeeDetails.length > 0 && (
            <Container className="mt-4">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>TID</th>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Current Designation</th>
                    <th>Previous Designation</th>
                    <th>From Depot</th>
                    <th>To Depot</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>working year</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeDetails.map((employee, index) => (
                    <tr key={index}>
                      <td>{employee.tid}</td>
                      <td>{employee.emp_id}</td>
                      <td>{employee.emp_name}</td>
                      <td>{employee.curr_desg}</td>
                      <td>{employee.prev_desg}</td>
                      <td>{employee.from_depot_name}</td>
                      <td>{employee.to_depot_name}</td>
                      <td>{formatDate(employee.from_date)}</td>
                      <td>{formatDate(employee.to_date)}</td>
                      <td>
                        {calculateWorkingYears(
                          employee.from_date,
                          employee.to_date
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default EmpTransferHistori;
