import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";

function DepotWiseEmpSkillData() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const { depots } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDepot === "") {
      alert("Please select a Depot.");
      return;
    }

    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/depotwiseempandskill.php?depot_id=${selectedDepot}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setEmployeeDetails(data.data);
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to fetch employee data");
        setEmployeeDetails(null);
      }
    } catch (error) {
      setErrorMessage("Error fetching data");
      setEmployeeDetails(null);
    }
  };

  const handleDepotChange = (e) => {
    setSelectedDepot(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Container className="shadow-sm p-4 mb-5 bg-white rounded" fluid>
        <h2 className="text-center mb-4 display-6 text-primary">
          Depot-wise Employee and Skill Analysis
        </h2>

        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <Form.Select
              aria-label="Select Depot"
              name="depot"
              value={selectedDepot}
              onChange={handleDepotChange}
              className="custom-select"
            >
              <option value="">Select Depot</option>
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
          <div
            className="mt-4 table-wrapper"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Table bordered hover striped className="mb-0">
              <thead>
                <tr className="table-primary">
                  <th>Employee Name</th>
                  <th>Post</th>
                  <th>Rating</th>
                  <th>Skills and Ratings</th>
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee, empIndex) => (
                  <tr key={empIndex}>
                    <td>{employee.emp_name}</td>
                    <td>{employee.post}</td>
                    <td>{employee.rating}</td>
                    <td>
                      <Table borderless size="sm">
                        <tbody>
                          {employee.skills.map((skill, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{skill.skill}</strong>: Rating{" "}
                                {skill.average_rating}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default DepotWiseEmpSkillData;
