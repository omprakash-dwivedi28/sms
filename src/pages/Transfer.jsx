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
import { Chart } from "react-google-charts"; // Import the Chart component
import Dropdown from "react-bootstrap/Dropdown";

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
  const [combinedChartData, setCombinedChartData] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("Vacancy"); // Default selection
  const [fromDepotName, setFromDepotName] = useState({});
  const [toDepotshowName, setToDepotshowName] = useState({});

  const { depots } = useGlobalContext();
  const [averageRating, setAverageRating] = useState(0);
  const [ToaverageRating, setToAverageRating] = useState(0);
  const [fromselectedCurrentStaff, setselectedfromCurrentStaff] = useState(0);

  const handleToDepotChange = (e) => {
    // setSelectedToDepot(e.target.value);

    //Third code ----------
    const depo_id = e.target.value;

    setSelectedToDepot(depo_id);

    // Find depot_name based on selected depo_id
    const selectedDepot = depots.find((depot) => depot.depo_id === depo_id);
    setToDepotshowName(selectedDepot ? selectedDepot.depot_name : "");
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
    // setSelectedFromDepot(e.target.value);

    const depo_id = e.target.value;

    setSelectedFromDepot(depo_id);

    const selectedDepot = depots.find((depot) => depot.depo_id === depo_id);
    setFromDepotName(selectedDepot ? selectedDepot.depot_name : "");
  };
  const handleMetricChange = (metric) => {
    setSelectedMetric(metric); // Update selected metric on dropdown change
  };
  // useEffect(() => {}, []);
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
        // console.log(data);
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

  useEffect(() => {
    const fromDataMap = new Map();
    const toDataMap = new Map();

    // Prepare data based on selected metric
    fromPostWiseData.forEach((post) => {
      const designation = post.desg_name;
      let count;
      if (selectedMetric === "Vacancy") {
        count = Number(post.ss) - Number(post.mor);
      } else if (selectedMetric === "MOR") {
        count = Number(post.mor);
      } else if (selectedMetric === "SS") {
        count = Number(post.ss);
      }
      fromDataMap.set(designation, count);
    });

    toPostWiseData.forEach((post) => {
      const designation = post.desg_name;
      let count;
      if (selectedMetric === "Vacancy") {
        count = Number(post.ss) - Number(post.mor);
      } else if (selectedMetric === "MOR") {
        count = Number(post.mor);
      } else if (selectedMetric === "SS") {
        count = Number(post.ss);
      }
      toDataMap.set(designation, count);
    });

    // Combine both datasets with annotations
    const combinedData = [
      [
        "Designation",
        fromDepotName,
        // { role: "annotation" },
        toDepotshowName,
        // { role: "annotation" },
      ],
    ];

    const allDesignations = new Set([
      ...fromDataMap.keys(),
      ...toDataMap.keys(),
    ]);

    allDesignations.forEach((desg) => {
      const fromCount = fromDataMap.get(desg) || 0;
      const toCount = toDataMap.get(desg) || 0;
      combinedData.push([
        desg,
        fromCount, // Actual count for From Depot
        // fromCount.toString(), // Ensure the annotation is a string
        toCount, // Actual count for To Depot
        // toCount.toString(), // Ensure the annotation is a string
      ]);
    });

    setChartData(combinedData);
  }, [fromPostWiseData, toPostWiseData, selectedMetric]);
  useEffect(() => {
    const combinedData = [
      [
        "Designation",
        `${fromDepotEmployees[0]?.depot_name}-SS`,
        `${fromDepotEmployees[0]?.depot_name}-MOR`,
        `${fromDepotEmployees[0]?.depot_name}-Vacancy`,
        `${toDepotEmployees[0]?.depot_name}-SS`,
        `${toDepotEmployees[0]?.depot_name}-MOR`,
        `${fromDepotEmployees[0]?.depot_name}-Vacancy`,
      ],
    ];

    const fromDataMap = new Map();
    const toDataMap = new Map();

    // Prepare data for SS, MOR, and Vacancy from fromPostWiseData
    fromPostWiseData.forEach((post) => {
      const designation = post.desg_name;
      const ssCount = Number(post.ss);
      const morCount = Number(post.mor);
      const vacancyCount = ssCount - morCount;

      fromDataMap.set(designation, {
        ss: ssCount,
        mor: morCount,
        vacancy: vacancyCount,
      });
    });

    // Prepare data for SS, MOR, and Vacancy from toPostWiseData
    toPostWiseData.forEach((post) => {
      const designation = post.desg_name;
      const ssCount = Number(post.ss);
      const morCount = Number(post.mor);
      const vacancyCount = ssCount - morCount;

      toDataMap.set(designation, {
        ss: ssCount,
        mor: morCount,
        vacancy: vacancyCount,
      });
    });

    const allDesignations = new Set([
      ...fromDataMap.keys(),
      ...toDataMap.keys(),
    ]);

    allDesignations.forEach((desg) => {
      const fromCounts = fromDataMap.get(desg) || { ss: 0, mor: 0, vacancy: 0 };
      const toCounts = toDataMap.get(desg) || { ss: 0, mor: 0, vacancy: 0 };

      combinedData.push([
        desg,
        fromCounts.ss,
        fromCounts.mor,
        fromCounts.vacancy,
        toCounts.ss,
        toCounts.mor,
        toCounts.vacancy,
      ]);
    });

    setCombinedChartData(combinedData);
  }, [fromPostWiseData, toPostWiseData, selectedMetric]);

  return (
    <div>
      <div className="containerr">
        <div className="row">
          <div className=" col-md-4 col-12">
            <Card bg="light" className="custom-card">
              <Card.Header className="custom-card-header">
                Transfer from Depot
              </Card.Header>
              <Card.Body>
                <Form>
                  <InputGroup className="mb-3">
                    <Form.Select
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
                  <div className="scrollable">
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
                              <td>{employee.sr_no}</td>
                              <td>{employee.emp_name}</td>
                              <td>{employee.post}</td>
                              <td>{employee.rating}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Form>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
          <div className=" col-md-4 col-12">
            <h5>Select diffrent type data option</h5>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedMetric}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleMetricChange("Vacancy")}>
                  Vacancy
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleMetricChange("MOR")}>
                  MOR
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleMetricChange("SS")}>
                  SS
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>{" "}
            <Card className="mt-4">
              <Card.Header className="custom-card-header">
                Designation Wise Staff {selectedMetric} graph
              </Card.Header>
              {console.log(chartData)}
              <Card.Body>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="400px"
                  data={chartData} // Use your dynamic chartData here
                  options={{
                    title: "Designation Wise Staff Count Comparison",
                    chartArea: { width: "70%" }, // Adjusted to give more space for annotations
                    hAxis: {
                      title: "Count",
                      minValue: 0,
                      role: "style",
                    },
                    vAxis: {
                      title: "Designation",
                    },
                    legend: { position: "bottom" },
                    bars: "horizontal", // Horizontal bars
                    annotations: {
                      textStyle: {
                        fontSize: 12,
                        color: "#000000", // Change color for better visibility
                        auraColor: "none",
                      },
                    },
                    bar: { groupWidth: "75%" }, // Adjust the width of the bars
                  }}
                />
              </Card.Body>
            </Card>
            <Card className="mt-4">
              <Card.Header className="custom-card-header">
                Designation Wise Staff Combined Metric Graph
              </Card.Header>
              <Card.Body>
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="400px"
                  data={combinedChartData} // Use the combinedChartData here
                  options={{
                    title: "Designation Wise Staff Combined Metric Comparison",
                    chartArea: { width: "70%" },
                    hAxis: {
                      title: "Count",
                      minValue: 0,
                      role: "style",
                    },
                    vAxis: {
                      title: "Designation",
                    },
                    legend: { position: "bottom" },
                    bars: "horizontal",
                    annotations: {
                      textStyle: {
                        fontSize: 12,
                        color: "#000000",
                        auraColor: "none",
                      },
                    },
                    bar: { groupWidth: "75%" },
                  }}
                />
              </Card.Body>
            </Card>
            <Card>
              <Button
                onClick={handleTransfer}
                disabled={!selectedEmployees.length}
                variant="primary"
                className="w-100"
              >
                Transfer →
              </Button>{" "}
            </Card>
          </div>
          <div className=" col-md-4 col-12">
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
                  <div className="scrollable">
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
                  </div>
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
                  </ListGroup>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      {/* <div className="containerr" > */}
      {/* <div className="row" >
          <div
            className=" col-md-4 col-12"
            
          >
            1 of 3
          </div>
          <div
            className=" col-md-4 col-12"
            
          >
            Variable width content
          </div>
          <div
            className=" col-md-4 col-12"
            
          >
            3 of 3
          </div>
        </div>
      </div> */}

      <Row className="mb-4">
        <Col md={4}>
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
        <Col md={4}></Col>

        <Col md={4}>
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
    </div>
  );
}

export default Transfer;
