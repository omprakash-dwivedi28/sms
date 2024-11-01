import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const MutualSearchRegistration = () => {
  // Form state
  const [formData, setFormData] = useState({
    zone: "",
    division: "",
    station: "",
    officeName: "",
    department: "",
    subDepartment: "",
    hrmsId: "",
    name: "",
    dob: "",
    educationQualification: "",
    community: "",
    medicalClassification: "",
    pfNo: "",
    billUnit: "",
    designation: "",
    payLevel: "",
  });

  // State for form submission status
  const [submitted, setSubmitted] = useState(false);

  // Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for empty required fields
    const emptyFields = Object.keys(formData).filter((key) => !formData[key]);
    if (emptyFields.length) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Form Data Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="registration-form">
      <Container className="mt-4">
        <Card className="p-4 shadow-sm">
          <h2 className="text-center mb-4">Mutual Search Registration</h2>
          {submitted ? (
            <p className="text-success text-center">
              Thank you for registering. Your information has been submitted.
            </p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                {[
                  { label: "Zone", name: "zone" },
                  { label: "Division", name: "division" },
                  { label: "Station", name: "station" },
                  { label: "Office Name", name: "officeName" },
                  { label: "Department", name: "department" },
                  { label: "Sub-Department", name: "subDepartment" },
                  { label: "HRMS ID", name: "hrmsId" },
                  { label: "Name", name: "name" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  {
                    label: "Educational Qualification",
                    name: "educationQualification",
                  },
                  { label: "Community", name: "community" },
                  {
                    label: "Existing Medical Classification",
                    name: "medicalClassification",
                  },
                  { label: "PF Number", name: "pfNo" },
                  { label: "Bill Unit", name: "billUnit" },
                  { label: "Designation", name: "designation" },
                  { label: "Pay Level", name: "payLevel" },
                ].map(({ label, name, type = "text" }, index) => (
                  <Col key={index} xs={12} sm={6} md={4} className="mb-3">
                    <Form.Group controlId={name}>
                      <Form.Label>{label}</Form.Label>
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

export default MutualSearchRegistration;
