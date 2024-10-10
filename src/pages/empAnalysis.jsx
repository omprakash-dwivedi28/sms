import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/css/EmpAnalysis.css"; // Assuming you create a CSS file for custom styles

function EmpAnalysis() {
  const [pfNo, setPfNo] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const { depots } = useGlobalContext();

  const handleInputChange = (e) => {
    setPfNo(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (selectedDepot === "") {
      alert("Please select a Depot name for the Transfer you want.");
    } else {
      e.preventDefault();
      try {
        const response = await fetch(
          `https://railwaymcq.com/sms/getEmpDetail.php?pf_no=${pfNo}&tr_depo_id=${selectedDepot}`
        );
        const data = await response.json();
        if (data.success) {
          setEmployeeDetails(data);
          setErrorMessage("");
        } else {
          setErrorMessage(data.message);
          setEmployeeDetails(null);
        }
      } catch (error) {
        setErrorMessage("Error fetching data");
        setEmployeeDetails(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDepotChange = (e) => {
    setSelectedDepot(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-sm p-4 mb-5 bg-white rounded"
        style={{ overflow: "auto", width: "75rem" }}
      >
        <Card.Body style={{ height: "550px" }}>
          <Card.Title className="text-center mb-4 display-6 text-primary">
            Employee Analysis
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
            <InputGroup className="mb-3">
              <Form.Select
                aria-label="Select Depot"
                name="depot"
                value={selectedDepot}
                onChange={handleDepotChange}
                className="custom-select"
              >
                <option value="">
                  Select Depot which you want to transfer
                </option>
                {depots?.map((depot) => (
                  <option key={depot.depo_id} value={depot.depo_id}>
                    {depot.depot_name}
                  </option>
                ))}
              </Form.Select>
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
          {employeeDetails && (
            <Container className="mt-4">
              <Row>
                <Col md={6}>
                  <Card className="info-card mb-4">
                    <Card.Body>
                      <h5 className="text-center text-secondary mb-3">
                        <strong>Employee Information</strong>
                      </h5>
                      <Container>
                        <Row>
                          <Col>
                            <p>
                              <strong>Name :</strong>{" "}
                              {employeeDetails.employee.emp_name}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Mobile No:</strong>{" "}
                              {employeeDetails.employee.mobile_no}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Email Id:</strong>{" "}
                              {employeeDetails.employee.email_id}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <strong>PF No:</strong>{" "}
                              {employeeDetails.employee.pf_no}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>HRMS NO:</strong>{" "}
                              {employeeDetails.employee.hrms_id}
                            </p>
                          </Col>

                          <Col>
                            <p>
                              <strong>GRADE PAY:</strong>{" "}
                              {employeeDetails.employee.gp}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <strong>DOB:</strong>{" "}
                              {formatDate(employeeDetails.employee.dob)}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>DOA:</strong>{" "}
                              {formatDate(employeeDetails.employee.doa)}
                            </p>
                          </Col>

                          <Col>
                            <p>
                              <strong>DOR:</strong>{" "}
                              {formatDate(employeeDetails.employee.dor)}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <strong>Post:</strong>{" "}
                              {employeeDetails.employee.post}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Overall rating:</strong>{" "}
                              {employeeDetails.employee.rating}
                            </p>
                          </Col>

                          <Col>
                            <p>
                              <strong>Level:</strong>{" "}
                              {employeeDetails.employee.level}
                            </p>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="info-card mb-4">
                    <Card.Body>
                      <h6 className="text-secondary mb-3">
                        <strong>Employee skills with rating</strong>
                      </h6>
                      <ul className="skill-list">
                        {employeeDetails.skills.map((skill, index) => (
                          <li key={index}>
                            <strong>{skill.skill} :: </strong>
                            {"  "} {skill.sub_skill_rating}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="info-card mb-4">
                    <Card.Body>
                      <h5 className="text-center text-secondary mb-3">
                        <strong>To Depot. (Information)</strong>
                      </h5>
                      <Container>
                        <Row>
                          <Col>
                            <p>
                              <strong>Depot Name:</strong>{" "}
                              {employeeDetails.tr_depot.depot_name}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Depot Size:</strong>{" "}
                              {employeeDetails.tr_depot.depot_size}tkm
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Staff Capacity:</strong>{" "}
                              {employeeDetails.tr_depot.staff_capacity}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <strong>Staff Available:</strong>{" "}
                              {employeeDetails.tr_depot.staff_avail}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Staff Required:</strong>{" "}
                              {employeeDetails.tr_depot.staff_required}
                            </p>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="info-card mb-4">
                    <Card.Body>
                      <h5 className="text-center text-secondary mb-3">
                        <strong>From Depot. (Information)</strong>
                      </h5>
                      <Container>
                        <Row>
                          <Col>
                            <p>
                              <strong>Depot Name:</strong>{" "}
                              {employeeDetails.depot.depot_name}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Depot Size:</strong>{" "}
                              {employeeDetails.depot.depot_size}tkm
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Staff Capacity:</strong>{" "}
                              {employeeDetails.depot.staff_capacity}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>
                              <strong>Staff Available:</strong>{" "}
                              {employeeDetails.depot.staff_avail}
                            </p>
                          </Col>
                          <Col>
                            <p>
                              <strong>Staff Required:</strong>{" "}
                              {employeeDetails.depot.staff_required}
                            </p>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default EmpAnalysis;
