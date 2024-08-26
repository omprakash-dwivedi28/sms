import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../components/css/DepotWiseAnalysis.css";

function DepotWiseAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://railwaymcq.com/sms/depotWiseEmpinfo.php")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Depot-Wise Employee Analysis</h2>
      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Depot Name</th>
              <th>Employee Name</th>
              <th>Post</th>
              <th>Level</th>
              <th>Mobile No</th>
              <th>Email ID</th>
              <th>PF No</th>
              <th>HRMS ID</th>
              <th>Grade Pay</th>
              <th>DOB</th>
              <th>DOA</th>
              <th>DOR</th>
              <th>Overall Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => (
              <tr>
                <td>{employee.depot_name}</td>
                <td>{employee.emp_name}</td>
                <td>{employee.post}</td>
                <td>{employee.level}</td>
                <td>{employee.mobile_no}</td>
                <td>{employee.email_id}</td>
                <td>{employee.pf_no}</td>
                <td>{employee.hrms_id}</td>
                <td>{employee.gp}</td>
                <td>{new Date(employee.dob).toLocaleDateString()}</td>
                <td>{new Date(employee.doa).toLocaleDateString()}</td>
                <td>{new Date(employee.dor).toLocaleDateString()}</td>
                <td>{employee.rating}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default DepotWiseAnalysis;
