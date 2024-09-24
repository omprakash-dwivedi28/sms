import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  Table,
  Tabs,
  Tab,
} from "react-bootstrap";

const EditEmployeeByPfNo = () => {
  const [pfNo, setPfNo] = useState("");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To manage errors
  const [editableSkills, setEditableSkills] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const fetchEmployeeData = () => {
    setLoading(true);
    setError(null);

    fetch(`https://railwaymcq.com/sms/EditableEmp.php?pf_no=${pfNo}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (data && data.emp_id) {
          setEmployee(data);
          if (Array.isArray(data.skills) && data.skills.length > 0) {
            setEmployee((prev) => ({
              ...prev,
              skills: data.skills,
            }));
            setEditableSkills(new Array(data.skills.length).fill(false));
            setActiveTab(0);
          } else {
            setEmployee((prev) => ({
              ...prev,
              skills: [],
            }));
          }
        } else {
          throw new Error("Invalid Employee Data");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Employee not found or error fetching data");
        setLoading(false);
      });
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    setEmployee((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[activeTab].subskills[index] = {
        ...updatedSkills[activeTab].subskills[index],
        [name]: value,
      };
      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  };

  const handleCheckboxToggle = (index) => {
    const updatedEditableSkills = [...editableSkills];
    updatedEditableSkills[index] = !updatedEditableSkills[index];
    setEditableSkills(updatedEditableSkills);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form...", employee);
    console.log("Employee Data", employee.emp_id);

    fetch(
      `https://railwaymcq.com/sms/modify_employee_skill.php?emp_id=${employee.emp_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      }
    )
      .then((response) => response.text())
      .then((text) => {
        console.log("Raw response:", text);
        try {
          const data = JSON.parse(text);
          console.log("Employee updated:", data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((error) => console.error("Error updating employee:", error));
  };

  return (
    <Card className="p-4">
      <Card.Body>
        <Card.Title>Editable Employee Pages</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              PF Number
            </Form.Label>
            <Col sm={9}>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={pfNo}
                  onChange={(e) => setPfNo(e.target.value)}
                  placeholder="Enter PF Number"
                />
                <Button
                  onClick={fetchEmployeeData}
                  disabled={loading}
                  variant="primary"
                >
                  {loading ? "Loading..." : "Search"}
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          {employee && employee.skills && (
            <>
              <Card className="mt-4">
                <Card.Body>
                  <Card.Title>Edit Employee Details</Card.Title>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Employee Name
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="emp_name"
                        value={employee.emp_name}
                        onChange={handleEmployeeChange}
                        placeholder="Employee Name"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Mobile No
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="mobile_no"
                        value={employee.mobile_no}
                        onChange={handleEmployeeChange}
                        placeholder="Mobile No"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Email ID
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="email_id"
                        value={employee.email_id}
                        onChange={handleEmployeeChange}
                        placeholder="Email ID"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Education
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="education"
                        value={employee.education}
                        onChange={handleEmployeeChange}
                        placeholder="Education"
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Post
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="post"
                        value={employee.post}
                        onChange={handleEmployeeChange}
                        placeholder="Post"
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>
              {/* {console.log("employee", employee)} */}

              {employee.skills.length > 0 ? (
                <Card className="mt-3">
                  <Card.Body>
                    <h2>Employee Skills</h2>
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                    >
                      {/* {console.log("skills", employee.skills)} */}
                      {employee.skills.map((skill, index) => (
                        <Tab eventKey={index} title={skill.skill} key={index}>
                          <Table striped bordered hover className="mt-4">
                            <thead>
                              <tr>
                                <th>Sub Skill</th>
                                <th>Sub Skill Rating</th>
                                <th>Edit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {skill.subskills && skill.subskills.length > 0 ? (
                                skill.subskills.map((object, subskillIndex) => (
                                  <tr key={subskillIndex}>
                                    <td>
                                      <Form.Control
                                        name="sub_Skill"
                                        value={object.sub_Skill || ""}
                                        onChange={(e) =>
                                          handleSkillChange(subskillIndex, e)
                                        }
                                        disabled={
                                          !editableSkills[subskillIndex]
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Form.Control
                                        name="sub_skill_rating"
                                        value={object.sub_skill_rating || ""}
                                        onChange={(e) =>
                                          handleSkillChange(subskillIndex, e)
                                        }
                                        disabled={
                                          !editableSkills[subskillIndex]
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        checked={editableSkills[subskillIndex]}
                                        onChange={() =>
                                          handleCheckboxToggle(subskillIndex)
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No Subskills Available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </Tab>
                      ))}
                    </Tabs>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="info">
                  No skills available for this employee.
                </Alert>
              )}
              <Button variant="success" type="submit">
                Save Employee
              </Button>
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditEmployeeByPfNo;