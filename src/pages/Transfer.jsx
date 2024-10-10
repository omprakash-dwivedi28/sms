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
import "../components/css/Transfer.css"; // Import custom CSS

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
          <Card bg="light" className="custom-card">
            <Card.Header className="custom-card-header">
              Transfer from Depot
            </Card.Header>
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
                          {console.log("employee", employee)}
                          <td>{employee.sr_no}</td>
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
          <Card className="mt-4 custom-card">
            <Card.Header className="custom-card-header">
              Before Transfer
            </Card.Header>
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
            <Card.Header className="custom-card-header">
              After Transfer
            </Card.Header>
            <Card.Body>
              <h6 className="mt-4 custom-card">
                Depot Rating: {averageRating}
              </h6>
              <h6 className="mt-4 custom-card">
                {" "}
                Depot. staff:{" "}
                {Number(fromDepotData.staff_avail) -
                  Number(fromselectedCurrentStaff)}
              </h6>
            </Card.Body>
          </Card>
          <Card bg="light" className="custom-card">
            <Card.Body>
              <h6 className="text-secondary mb-3">
                <strong>Pin Pointing Position Table</strong>
              </h6>
              <Container>
                <Table responsive bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th>Designation</th>
                      <th>SS</th>
                      <th>MOR</th>
                      <th>Vacancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromPostWiseData.map((post, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{post.desg_name}</strong>
                        </td>
                        <td>{post.ss}</td>
                        <td>{post.mor}</td>
                        <td>{Number(post.ss) - Number(post.mor)}</td>
                      </tr>
                    ))}
                    {/* Total Calculation Row */}
                    <tr className="font-weight-bold">
                      <td className="text-secondary mb-3">
                        <strong>Total</strong>
                      </td>
                      <td>
                        {fromPostWiseData.reduce(
                          (total, post) => total + Number(post.ss),
                          0
                        )}
                      </td>
                      <td>
                        {fromPostWiseData.reduce(
                          (total, post) => total + Number(post.mor),
                          0
                        )}
                      </td>
                      <td>
                        {fromPostWiseData.reduce(
                          (total, post) =>
                            total + (Number(post.ss) - Number(post.mor)),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
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
          <Card bg="light" className="custom-card">
            <Card.Header className="custom-card-header">
              Transfer to Depot
            </Card.Header>
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
                          <th>Sr.No</th>
                          <th>Name</th>
                          <th>Post</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toDepotEmployees.map((employee) => (
                          <tr key={employee.emp_id}>
                            <td>
                              {employee.sr_no}
                              {/* <Form.Check
                                type="checkbox"
                                onChange={(e) =>
                                  handleEmployeeSelection(e, employee)
                                }
                                disabled
                              /> */}
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
                  <Table striped bordered hover className="custom-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Post</th>
                        <th>PF NO</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferredEmployees.map((employee) => (
                        <tr key={employee.emp_id}>
                          <td>{employee.emp_name}</td>
                          <td>{employee.post}</td>
                          <td>{employee.pf_no}</td>
                          <td>{employee.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* {transferredEmployees.map((employee) => (
                    <ListGroup.Item key={employee.emp_id}>
                      <strong>Name:-</strong>
                      {employee.emp_name}
                      <strong>PF No.</strong>:{employee.pf_no}
                    </ListGroup.Item>
                  ))} */}
                </ListGroup>
              </Form>
            </Card.Body>
          </Card>
          <Card bg="light" className="custom-card">
            <Card.Header className="custom-card-header">
              Before Transfer
            </Card.Header>
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
          <Card bg="light" className="custom-card">
            <Card.Header className="custom-card-header">
              After Transfer
            </Card.Header>
            <Card.Body>
              <h6 className="mt-4 custom-card">
                Depot Rating: {ToaverageRating}
              </h6>
              <h6 className="mt-4 custom-card">
                {" "}
                Depot Staff:{" "}
                {Number(toDepotData.staff_avail) + fromselectedCurrentStaff}
              </h6>
            </Card.Body>
          </Card>
          <Card className="mt-4"></Card>
          <Card bg="light" className="custom-card">
            <Card.Body>
              <h6 className="text-secondary mb-3">
                <strong>Pin Pointing Position Table</strong>
              </h6>
              <Container>
                <Table responsive bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th>Designation</th>
                      <th>SS</th>
                      <th>MOR</th>
                      <th>Vacancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toPostWiseData.map((post, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{post.desg_name}</strong>
                        </td>
                        <td>{post.ss}</td>
                        <td>{post.mor}</td>
                        <td>{Number(post.ss) - Number(post.mor)}</td>
                      </tr>
                    ))}
                    {/* Total Calculation Row */}
                    <tr className="font-weight-bold">
                      <td className="text-secondary mb-3">
                        <strong>Total</strong>
                      </td>
                      <td>
                        {toPostWiseData.reduce(
                          (total, post) => total + Number(post.ss),
                          0
                        )}
                      </td>
                      <td>
                        {toPostWiseData.reduce(
                          (total, post) => total + Number(post.mor),
                          0
                        )}
                      </td>
                      <td>
                        {toPostWiseData.reduce(
                          (total, post) =>
                            total + (Number(post.ss) - Number(post.mor)),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Transfer;
