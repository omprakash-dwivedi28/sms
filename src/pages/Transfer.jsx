import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useGlobalContext } from "../context/GlobalContext";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

function Transfer() {
  const [selectedFromDepot, setSelectedFromDepot] = useState("");
  const [selectedToDepot, setSelectedToDepot] = useState("");
  const [fromDepotEmployees, setFromDepotEmployees] = useState([]);
  const [fromPostWiseData, setFromPostWiseData] = useState([]);
  const [fromDepotData, setFromDepotData] = useState({});
  const [toDepotEmployees, setToDepotEmployees] = useState([]);
  const [toPostWiseData, setToPostWiseData] = useState([]);
  const [toDepotData, setToDepotData] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [transferredEmployees, setTransferredEmployees] = useState([]);
  const [combinedEmployees, setCombinedEmployees] = useState([]);

  const { depots } = useGlobalContext();
  const [averageRating, setAverageRating] = useState(0);
  const [ToaverageRating, setToAverageRating] = useState(0);
  const [fromselectedCurrentStaff, setselectedfromCurrentStaff] = useState(0);

  const handleToDepotChange = (e) => {
    setSelectedToDepot(e.target.value);
  };
  useEffect(() => {
    if (selectedFromDepot) {
      fetch(
        `https://railwaymcq.com/sms/employeeTransferOperaton.php?depot_id=${selectedFromDepot}`
      )
        .then((response) => response.json())
        .then((data) => {
          setFromDepotEmployees(data.employee_data || []);
          setFromDepotData(data.depot_data || {});
          setFromPostWiseData(data.post_wise_data || []);
        })
        .catch((error) => {
          console.error("Error fetching employees and depot data:", error);
        });
    }
  }, [selectedFromDepot]);

  useEffect(() => {
    if (selectedToDepot) {
      fetch(
        `https://railwaymcq.com/sms/employeeTransferOperaton.php?depot_id=${selectedToDepot}`
      )
        .then((response) => response.json())
        .then((data) => {
          setToDepotEmployees(data.employee_data || []);
          setToDepotData(data.depot_data || {});
          setToPostWiseData(data.post_wise_data || []);
        })
        .catch((error) => {
          console.error("Error fetching employees and depot data:", error);
        });
    }
  }, [selectedToDepot]);

  const handleFromDepotChange = (e) => {
    setSelectedFromDepot(e.target.value);
  };
  useEffect(() => {}, []);
  const handleEmployeeSelection = (e, employee) => {
    let updatedSelectedEmployees;

    if (e.target.checked) {
      updatedSelectedEmployees = [...selectedEmployees, employee];
    } else {
      updatedSelectedEmployees = selectedEmployees.filter(
        (emp) => emp.emp_id !== employee.emp_id
      );
    }

    setSelectedEmployees(updatedSelectedEmployees);
    setselectedfromCurrentStaff(updatedSelectedEmployees.length);

    // Filter remaining employees in the "From Depot" (those not selected)
    const remainings = fromDepotEmployees.filter(
      (fromEmp) =>
        !updatedSelectedEmployees.some(
          (empData) => fromEmp.hrms_id === empData.hrms_id
        )
    );

    // Calculate average rating for remaining employees in "From Depot"
    const selectedFromDepotRatings = remainings.reduce(
      (sum, emp) => sum + parseFloat(emp.rating || 0),
      0
    );

    const selectedFromTotalStaff = remainings.length;
    const fromAvgRating =
      selectedFromTotalStaff > 0
        ? selectedFromDepotRatings / selectedFromTotalStaff
        : 0;

    setAverageRating(fromAvgRating.toFixed(2));

    const combinedEmployeesNow = [
      ...toDepotEmployees,
      ...updatedSelectedEmployees,
    ];

    // Calculate average rating for "To Depot"
    const combinedToDepotRatings = combinedEmployeesNow.reduce(
      (sum, emp) => sum + parseFloat(emp.rating || 0),
      0
    );

    const toAvgRating = combinedEmployeesNow.length
      ? combinedToDepotRatings / combinedEmployeesNow.length
      : 0;

    setCombinedEmployees(combinedEmployeesNow);
    setToAverageRating(toAvgRating.toFixed(2));

    // console.log("toAvgRating", toAvgRating);
  };

  const handleTransfer = () => {
    if (!selectedToDepot) {
      alert("Please select a depot to transfer employees to.");
      return;
    }

    const updatedEmployees = selectedEmployees.map((emp) => ({
      ...emp,
      depot_id: selectedToDepot,
    }));

    const updatedFromPostWiseData = fromPostWiseData.map((post) => {
      const postCount = selectedEmployees.filter(
        (emp) => emp.post === post.desg_name
      ).length;
      return {
        ...post,
        mor: Number(post.mor) - postCount,
      };
    });

    const updatedToPostWiseData = toPostWiseData.map((post) => {
      const postCount = selectedEmployees.filter(
        (emp) => emp.post === post.desg_name
      ).length;
      return {
        ...post,
        mor: Number(post.mor) + postCount,
      };
    });

    setFromDepotEmployees(
      fromDepotEmployees.filter((emp) => !selectedEmployees.includes(emp))
    );
    setTransferredEmployees([...transferredEmployees, ...updatedEmployees]);

    setSelectedEmployees([]);
    setFromPostWiseData(updatedFromPostWiseData);
    setToPostWiseData(updatedToPostWiseData);
    console.log("updatedEmployees", updatedEmployees);
    console.log("toDepot", selectedToDepot);
    console.log("fromDepot", selectedFromDepot);

    fetch("https://railwaymcq.com/sms/update_transfer.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employees: updatedEmployees,
        fromDepot: selectedFromDepot,
        toDepot: selectedToDepot,
        toDepotName: toDepotEmployees[0].depot_name,
        fromPostWiseData: updatedFromPostWiseData,
        toPostWiseData: updatedToPostWiseData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log("Transfer successful");
        } else {
          console.log("response.data", data);
          console.error("Error transferring employees:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error transferring employees:", error);
      });
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Transfer from Depot</Card.Header>
            <Card.Body>
              <Form>
                <InputGroup className="mb-3">
                  <Form.Select
                    aria-label="Select From Depot"
                    value={selectedFromDepot}
                    onChange={handleFromDepotChange}
                  >
                    <option value="">Select Depot</option>
                    {depots?.map((depot) => (
                      <option key={depot.depo_id} value={depot.depo_id}>
                        {depot.depot_name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
                <h6>Employees</h6>
                <Form>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Sr.No</th>
                        <th>Name</th>
                        <th>Post</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fromDepotEmployees.map((employee) => (
                        <tr key={employee.emp_id}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              onChange={(e) =>
                                handleEmployeeSelection(e, employee)
                              }
                            />
                          </td>
                          <td>{employee.serial_no}</td>
                          <td>{employee.emp_name}</td>
                          <td>{employee.post}</td>
                          <td>{employee.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Form>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Before Transfer</Card.Header>
            <Card.Body>
              {fromDepotData && (
                <div>
                  <p>
                    <strong>Depot Size:</strong> {fromDepotData.depot_size} tkm
                  </p>
                  <p>
                    <strong>SS:</strong> {fromDepotData.staff_capacity}
                  </p>
                  <p>
                    <strong>MOR:</strong> {fromDepotData.staff_avail}
                  </p>
                  <p>
                    <strong>Vacancy:</strong>{" "}
                    {fromDepotData.staff_capacity - fromDepotData.staff_avail}
                  </p>
                  <p>
                    <strong>Depot. Rating:</strong>{" "}
                    {fromDepotData.average_rating}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>After Transfer</Card.Header>
            <Card.Body>
              <h6 className="mt-4">Depot Rating: {averageRating}</h6>
              <h6 className="mt-4">
                {" "}
                Depot. staff:{" "}
                {Number(fromDepotData.staff_avail) -
                  Number(fromselectedCurrentStaff)}
              </h6>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Body>
              <h6 className="text-secondary mb-3">
                <strong>Pin pointing position Table</strong>
              </h6>
              <Container>
                <ul className="skill-list">
                  <Row className="mb-2">
                    {/* Column headers */}
                    <Col md={3}>
                      <strong>Designation</strong>
                    </Col>
                    <Col md={3}>
                      <strong>SS</strong>
                    </Col>
                    <Col md={3}>
                      <strong>MOR</strong>
                    </Col>
                    <Col md={3}>
                      <strong>Vacancy</strong>
                    </Col>
                  </Row>
                  {fromPostWiseData.map((post, index) => (
                    <li key={index}>
                      <Row>
                        <Col name="Desg Name">
                          <strong>{post.desg_name}:</strong>
                        </Col>
                        :<Col> {post.ss} </Col>:<Col>{post.mor}</Col>:
                        <Col>{post.ss - post.mor}</Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              </Container>
            </Card.Body>
          </Card>
        </Col>

        <Col
          md={4}
          className="d-flex align-items-center justify-content-center"
        >
          <div className="d-grid gap-2">
            <Button
              onClick={handleTransfer}
              disabled={!selectedEmployees.length}
              variant="primary"
              className="w-100"
            >
              Transfer →
            </Button>{" "}
          </div>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Transfer to Depot</Card.Header>
            <Card.Body>
              <Form>
                <InputGroup className="mb-3">
                  <Form.Select
                    aria-label="Select To Depot"
                    value={selectedToDepot}
                    onChange={handleToDepotChange}
                  >
                    <option value="">Select Depot</option>
                    {depots?.map((depot) => (
                      <option key={depot.depo_id} value={depot.depo_id}>
                        {depot.depot_name}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
                <h6>Employees</h6>
                <Form>
                  <Form>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Select</th>
                          <th>Name</th>
                          <th>Post</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toDepotEmployees.map((employee) => (
                          <tr key={employee.emp_id}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                onChange={(e) =>
                                  handleEmployeeSelection(e, employee)
                                }
                                disabled
                              />
                            </td>
                            <td>{employee.emp_name}</td>
                            <td>{employee.post}</td>
                            <td>{employee.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Form>
                </Form>
                <h6 className="mt-4">Transferred Employees</h6>
                <ListGroup>
                  {transferredEmployees.map((employee) => (
                    <ListGroup.Item key={employee.emp_id}>
                      {employee.emp_name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Before Transfer</Card.Header>
            <Card.Body>
              {toDepotData && (
                <div>
                  <p>
                    <strong>Depot Size:</strong> {toDepotData.depot_size} tkm
                  </p>
                  <p>
                    <strong>SS:</strong> {toDepotData.staff_capacity}
                  </p>
                  <p>
                    <strong>MOR:</strong> {Number(toDepotData.staff_avail)}
                  </p>
                  <p>
                    <strong>Vacancy:</strong>{" "}
                    {toDepotData.staff_capacity - toDepotData.staff_avail}
                  </p>
                  <p>
                    <strong>Depot. Rating:</strong> {toDepotData.average_rating}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>After Transfer</Card.Header>
            <Card.Body>
              <h6 className="mt-4">Depot Rating: {ToaverageRating}</h6>
              <h6 className="mt-4">
                {" "}
                Depot Staff:{" "}
                {Number(toDepotData.staff_avail) + fromselectedCurrentStaff}
              </h6>
            </Card.Body>
          </Card>
          <Card className="mt-4"></Card>
          <Card className="mt-4">
            <Card.Body>
              <h6 className="text-secondary mb-3">
                <strong>Pin pointing position Table</strong>
              </h6>
              <Container>
                <ul className="skill-list">
                  <Row className="mb-2">
                    {/* Column headers */}
                    <Col md={3}>
                      <strong>Designation</strong>
                    </Col>
                    <Col md={3}>
                      <strong>SS</strong>
                    </Col>
                    <Col md={3}>
                      <strong>MOR</strong>
                    </Col>
                    <Col md={3}>
                      <strong>Vacancy</strong>
                    </Col>
                  </Row>
                  {toPostWiseData.map((post, index) => (
                    <li key={index}>
                      <Row>
                        <Col name="Desg Name">
                          <strong>{post.desg_name}:</strong>
                        </Col>
                        :<Col> {post.ss} </Col>:<Col>{post.mor}</Col>:
                        <Col>{post.ss - post.mor}</Col>
                      </Row>
                    </li>
                  ))}
                </ul>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Transfer;
