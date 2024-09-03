import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { useGlobalContext } from "../context/GlobalContext";

const PostEmployeeModification = () => {
  const [pfNo, setPfNo] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState("");

  const { depots, skills, gps, desgs, qualifications } = useGlobalContext();

  // Fetch employee data by PF Number
  const fetchEmployeeData = async () => {
    setError(""); // Reset error

    const data = new URLSearchParams();
    data.append("pf_no", pfNo);
    data.append("action", "fetch"); // Include the action for the API to handle correctly

    try {
      const response = await fetch(
        "https://railwaymcq.com/sms/empInfoForModification.php", // API URL
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setEmployeeData(null);
      } else {
        setEmployeeData(result[0]); // Access the first object of the array
      }
    } catch (error) {
      setError("Error fetching employee data");
    }
  };

  const handleUpdateEmployee = async () => {
    setError("");

    const data = {
      pf_no: pfNo,
      emp_name: employeeData.emp_name,
      new_post: employeeData.new_post,
      new_gp: employeeData.new_gp,
      prev_gp: employeeData.gp, // Use previous grade pay
      new_level: employeeData.new_level,
      prev_level: employeeData.level, // Use previous level
      joining_date: employeeData.joining_date,
      depot_joining_date: employeeData.depot_joining_date,
    };
    console.log("data", data);
    try {
      const response = await fetch(
        "https://railwaymcq.com/sms/update_joining.php", // API URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(result.success);
        setPfNo("");
        setEmployeeData(null);
        // console.log("output", result.max_id);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Error updating employee");
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Post Employee Modification
              </Card.Title>

              <Form>
                <Form.Group className="mb-3" controlId="formPfNumber">
                  <Form.Label>PF Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter PF Number"
                    value={pfNo}
                    onChange={(e) => setPfNo(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={fetchEmployeeData}>
                    Fetch Employee Data
                  </Button>
                </div>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {employeeData && (
                <div className="mt-4">
                  <h4 className="mb-3">Update Employee Details</h4>

                  <Form.Group className="mb-3" controlId="formEmployeeName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={employeeData.emp_name || ""}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          emp_name: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formJoiningDate">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={employeeData.joining_date || ""}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          joining_date: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Designation"
                      name="post"
                      value={employeeData.new_post || ""}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          new_post: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Designation</option>
                      {desgs?.map((desg) => (
                        <option key={desg.desg_id} value={desg.desg_name}>
                          {desg.desg_name}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Grade Pay"
                      name="gp"
                      value={employeeData.new_gp || ""}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          new_gp: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Grade Pay</option>
                      {gps?.map((gp) => (
                        <option key={gp.gp_id} value={gp.gp}>
                          {gp.gp}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Pay Level"
                      name="level"
                      value={employeeData.new_level || ""}
                      onChange={(e) =>
                        setEmployeeData({
                          ...employeeData,
                          new_level: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Pay Level</option>
                      {gps?.map((gp) => (
                        <option key={gp.gp_id} value={gp.level}>
                          {gp.level}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <div className="d-grid gap-2">
                    <Button variant="success" onClick={handleUpdateEmployee}>
                      Update Employee
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostEmployeeModification;
