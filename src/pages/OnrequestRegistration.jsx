import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useGlobalContext } from "../context/GlobalContext";
import { UserContext } from "../context/UserContext";

const OnrequestRegistration = () => {
  // Form state

  // State for form submission status
  const [submitted, setSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isPFNoAvailable, setIsPFNoAvailable] = useState(true);
  const [isHRMSNoAvailable, setIsHRMSNoAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    zone_division,
    deptt,
    qualifications,
    desgs,
    gps,
    appmode,
    community,
    quata,
  } = useGlobalContext();

  const { logoutUser, user, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    zone: user.zone,
    division: user.division,
    station: "",
    officeName: "",
    department: user.department,
    subDepartment: "",
    hrmsId: user.hrms_id,
    name: user.name,
    pfNo: user.pf_no,
    designation: user.post,
    payLevel: user.level,
    postofiniappoiment: "",
    muzone: "",
    mudivision: "",
    user: user.username,
    mobno: user.mobile_no,
  });
  // console.log("User::::", user.username);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "pfNo") {
      setFormData({ ...formData, [name]: value });
      await checkPFNoAvailability(value);
    } else if (name === "hrmsId") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
      await checkHRMSNoAvailability(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const checkPFNoAvailability = async (pfNo) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/emp_formutual_validation.php?pf_no=${encodeURIComponent(
          pfNo
        )}&pfno_flag=true`
      );
      const result = await response.json();
      setIsPFNoAvailable(result.isAvailable);
      console.log("result", result);
    } catch (error) {
      console.error("Error checking PF NO availability:", error);
      setIsPFNoAvailable(false);
    }
  };

  const checkHRMSNoAvailability = async (hrmsId) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/emp_formutual_validation.php?hrms_id=${encodeURIComponent(
          hrmsId
        )}&hrms_flag=true`
      );
      const result = await response.json();
      setIsHRMSNoAvailable(result.isAvailable);
      console.log("result", result);
    } catch (error) {
      console.error("Error checking HRMS NO availability:", error);
      setIsHRMSNoAvailable(false);
    }
  };

  const insertData = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/sms/MutualSearchRegistration_api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Failed to insert data: " + result.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^[a-zA-Z0-9]{6}$/.test(formData.hrmsId)) {
      alert("HRMS ID must be exactly 6 alphanumeric characters.");
      setLoading(false);
      return;
    }
    if (!/^\d{11}$/.test(formData.pfNo)) {
      alert("PF Number must be exactly 11 digits.");
      setLoading(false);
      return;
    }
    // console.log("formData", formData);
    await checkPFNoAvailability(formData.pfNo);
    await checkHRMSNoAvailability(formData.hrmsId);

    setLoading(false);
    if (!isPFNoAvailable || !isHRMSNoAvailable) {
      setResponseMessage(
        "PF No or HRMS ID is already exists. Please choose another."
      );
      return;
    }
    if (Object.values(formData).some((field) => !field)) {
      alert("Please fill in all fields.");
      return;
    }
    setResponseMessage("");
    await insertData();
  };

  return (
    <div className="registration-form">
      <Container className="mt-4">
        <Card className="p-4 shadow-sm">
          <h2 className="text-center mb-4">Add Your On Request</h2>
          {!submitted && responseMessage && (
            <p className="text-danger text-center">{responseMessage}</p>
          )}
          {submitted ? (
            <p className="text-success text-center">
              Thank you for registering. Your information has been submitted.
            </p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="zone">
                    <Form.Label>
                      <strong>Zone</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      required
                    >
                      <option value={user.zone}>{user.zone}</option>

                      {zone_division?.map((zone, index) => (
                        <option key={index} value={Object.keys(zone)[0]}>
                          {Object.keys(zone)[0]}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="division">
                    <Form.Label>
                      <strong>Division</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="division"
                      value={formData.division}
                      onChange={handleChange}
                      required
                    >
                      <option value={user.division}>{user.division}</option>
                      {/* {console.log(formData)} */}

                      {zone_division?.map((zone, ind) => {
                        if (formData.zone === Object.keys(zone)[0]) {
                          return zone[formData.zone]?.map((division, index) => {
                            return (
                              <option key={index} value={division}>
                                {division}
                              </option>
                            );
                          });
                        }
                        return null; // Return null for elements that don't match the condition
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="department">
                    <Form.Label>
                      <strong>Department</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value={user.deptt}>{user.deptt}</option>
                      {/* {console.log(deptt)} */}
                      {deptt?.map((dept, index) => (
                        <option key={index} value={dept.dept_name}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="designation">
                    <Form.Label>Select Designation</Form.Label>
                    <Form.Control
                      as="select"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Designation</option>
                      {/* {console.log(deptt)} */}
                      {desgs?.map((desg, index) => (
                        <option key={index} value={desg.desg_name}>
                          {desg.desg_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="payLevel">
                    <Form.Label>
                      <strong>Pay Level</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="payLevel"
                      value={formData.payLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Pay Level</option>
                      {/* {console.log(deptt)} */}
                      {gps?.map((gp, index) => (
                        <option key={index} value={gp.level}>
                          {gp.level}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                {[
                  { label: "HRMS On Request No.", name: "on_request_no." },
                  { label: "Office Name", name: "officeName" },
                  { label: "Sub-Department", name: "subDepartment" },
                  { label: "HRMS ID", name: "hrmsId" },
                  { label: "PF Number", name: "pfNo" },
                  { label: "Name", name: "name" },
                  { label: "Mobile No", name: "mobno" },
                ].map(({ label, name, type = "text" }, index) => (
                  <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                    <Form.Group controlId={name}>
                      <Form.Label>
                        <strong>{label}</strong>
                      </Form.Label>
                      <Form.Control
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                ))}

                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="zone">
                    <Form.Label>
                      <strong>On Request Zone</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="muzone"
                      value={formData.muzone}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Mutual Zone</option>

                      {zone_division?.map((muzone, index) => (
                        <option key={index} value={Object.keys(muzone)[0]}>
                          {Object.keys(muzone)[0]}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-3">
                  <Form.Group controlId="division">
                    <Form.Label>
                      <strong>Select On Request Division</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="mudivision"
                      value={formData.mudivision}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select On Request Division</option>
                      {/* {console.log(formData)} */}

                      {zone_division?.map((muzone, ind) => {
                        if (formData.muzone === Object.keys(muzone)[0]) {
                          return muzone[formData.muzone]?.map(
                            (mudivision, index) => {
                              return (
                                <option key={index} value={mudivision}>
                                  {mudivision}
                                </option>
                              );
                            }
                          );
                        }
                        return null; // Return null for elements that don't match the condition
                      })}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default OnrequestRegistration;
