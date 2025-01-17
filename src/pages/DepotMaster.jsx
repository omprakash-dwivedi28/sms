import React, { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGlobalContext } from "../context/GlobalContext";
import { UserContext } from "../context/UserContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

function DepotMaster() {
  const [responseMessage, setResponseMessage] = useState("");
  const [isDepotNameAvailable, setIsDepotNameAvailable] = useState(true);
  const { desgs, sections } = useGlobalContext();
  const { user } = useContext(UserContext);
  const [selectedSections, setSelectedSections] = useState([]);

  // console.log("user", user);
  const [formData, setFormData] = useState({
    division_id: user?.division_id,
    depot_name: "",
    depot_fullname: "",
    section: "",
    depot_size: "",
    staff_capacity: 0,
    staff_avail: 0,
    staff_required: 0,
    designationPosts: [], // Array to handle designation-wise posts and availability
  });
  const filteredSections =
    sections?.filter(
      (section) => Number(section.division_id) === user.division_id
    ) || [];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "depot_name") {
      // Check availability of depot_name
      checkDepotNameAvailability(value);
    }
  };

  useEffect(() => {
    if (desgs && desgs.length > 0) {
      // Initialize designation posts data structure with default values only when desgs is available
      setFormData((prevData) => ({
        ...prevData,
        designationPosts: desgs.map((desg) => ({
          desg_id: desg.desg_id,
          desg_name: desg.desg_name,
          category: desg.category,
          section_posts: 0,
          available_posts: 0,
        })),
      }));
    }
  }, [desgs]);

  const handleDesignationChange = (index, field, value) => {
    const updatedDesignationPosts = [...formData.designationPosts];
    updatedDesignationPosts[index][field] = parseInt(value) || 0; // Ensuring value is a number
    setFormData({
      ...formData,
      designationPosts: updatedDesignationPosts,
    });
  };

  const handleSectionChange = (e) => {
    setSelectedSections(e.target.value);
    setFormData({
      ...formData,
      section: e.target.value,
    });
  };
  // Automatically calculate staff capacity and required staff
  useEffect(() => {
    if (formData.designationPosts.length > 0) {
      // Sum of all section_posts for staff capacity
      const totalSectionPosts = formData.designationPosts.reduce(
        (sum, desg) => sum + (parseInt(desg.section_posts) || 0),
        0
      );
      // Sum of all available_posts for staff required
      const totalAvailablePosts = formData.designationPosts.reduce(
        (sum, desg) => sum + (parseInt(desg.available_posts) || 0),
        0
      );

      setFormData((prevData) => ({
        ...prevData,
        staff_avail: totalAvailablePosts,
        staff_capacity: totalSectionPosts,
        staff_required: totalSectionPosts - totalAvailablePosts,
      }));
    }
  }, [formData.designationPosts]);

  const checkDepotNameAvailability = async (depotName) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/checkDepotName.php?depot_name=${encodeURIComponent(
          depotName
        )}`
      );
      const result = await response.json();
      setIsDepotNameAvailable(result.isAvailable);
    } catch (error) {
      console.error("Error checking depot name availability:", error);
      setIsDepotNameAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log("formData", formData);
    e.preventDefault();
    if (!isDepotNameAvailable) {
      setResponseMessage(
        "Depot code is already exist. Please choose another depot code."
      );
      return;
    }
    console.log("before response page ");
    try {
      const response = await fetch("https://railwaymcq.com/sms/addDepot.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const text = await response.text(); // Read response as text first
      let result;
      try {
        result = JSON.parse(text); // Try parsing the text as JSON
      } catch (error) {
        console.error("Response is not valid JSON:", text);
        setResponseMessage("Unexpected response from server.");
        return;
      }
      //   const result = await response.json();
      if (response.ok) {
        setResponseMessage("Depot added successfully!");
        // Reset form
        setFormData({
          division_id: user.division_id,
          depot_name: "",
          depot_fullname: "",
          depot_size: "",
          section: "",
          staff_capacity: 0,
          staff_avail: 0,
          staff_required: 0,
          designationPosts: desgs.map((desg) => ({
            desg_id: desg.desg_id,
            desg_name: desg.desg_name,
            category: desg.category,
            section_posts: 0,
            available_posts: 0,
          })),
        });
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ overflow: "auto", width: "50rem" }}>
        <Card.Body style={{ height: "550px" }}>
          <Card.Title className="text-center mb-4">
            Depot Information
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 text-start">
                {" "}
                Zone
                <Form.Control
                  type="text"
                  value={user.zone}
                  placeholder="Disabled input"
                  aria-label="Disabled input example"
                  className="me-2"
                  disabled
                  readOnly
                />
              </div>
              <div className="col-md-6 text-start">
                {" "}
                Division
                <Form.Control
                  type="text"
                  value={user.division}
                  placeholder={user.division}
                  aria-label="Disabled input example"
                  className="me-2"
                  disabled
                  readOnly
                />
              </div>
            </div>

            <Form.Control
              type="text"
              value={user.zone_id}
              placeholder="Disabled input"
              aria-label="Disabled input example"
              className="me-2"
              hidden
              readOnly
            />

            <Form.Control
              type="text"
              value={user.division_id}
              placeholder="Disabled input"
              aria-label="Disabled input example"
              className="me-2"
              hidden
              readOnly
            />

            <InputGroup className="mb-3">
              <InputGroup.Text>Code of Depot</InputGroup.Text>
              <Form.Control
                name="depot_name"
                value={formData.depot_name}
                onChange={handleChange}
                aria-label="depot_name"
                required
                isInvalid={!isDepotNameAvailable}
              />
              <Form.Control.Feedback type="invalid">
                Depot code is already taken. Please choose another depot code.
              </Form.Control.Feedback>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Name of Depot</InputGroup.Text>
              <Form.Control
                name="depot_fullname"
                value={formData.depot_fullname}
                onChange={handleChange}
                aria-label="depot_fullname"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Depot Size (TKM)</InputGroup.Text>
              <Form.Control
                name="depot_size"
                value={formData.depot_size}
                onChange={handleChange}
                aria-label="depot_size"
                required
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Select
                aria-label="Select Section"
                name="section"
                value={selectedSections}
                onChange={handleSectionChange}
                className="custom-select"
              >
                <option value="">Select Section</option>
                {filteredSections.map((section) => (
                  <option key={section.id} value={section.section_name}>
                    {section.section_name}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Total SS</InputGroup.Text>
              <Form.Control
                name="staff_capacity"
                value={formData.staff_capacity}
                readOnly
                aria-label="staff_capacity"
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Total MOR</InputGroup.Text>
              <Form.Control
                name="staff_avail"
                value={formData.staff_avail}
                onChange={handleChange}
                aria-label="staff_avail"
                required
                readOnly
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>Total vacancy</InputGroup.Text>
              <Form.Control
                name="staff_required"
                value={formData.staff_required}
                readOnly
                aria-label="staff_required"
              />
            </InputGroup>

            <Container>
              <h5 className="text-center mt-4 mb-3">Pin pointing position</h5>
              <Row className="mb-2">
                {/* Column headers */}
                <Col md={3}>
                  <strong>Designation</strong>
                </Col>

                <Col md={3}>
                  <strong>Sanctioned Strength</strong>
                </Col>
                <Col md={3}>
                  <strong>MOR</strong>
                </Col>
                <Col md={3}>
                  <strong>Vacancy</strong>
                </Col>
              </Row>

              {formData.designationPosts.length > 0 &&
                formData.designationPosts.map((desg, index) => (
                  <Row key={desg.desg_id} className="mb-12">
                    <Col md={3}>
                      <InputGroup.Text>{desg.desg_name}</InputGroup.Text>
                    </Col>

                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder="sanctioned strength"
                        value={desg.section_posts}
                        onChange={(e) =>
                          handleDesignationChange(
                            index,
                            "section_posts",
                            e.target.value
                          )
                        }
                        aria-label="section_posts"
                        required
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder="MOR"
                        value={desg.available_posts}
                        onChange={(e) =>
                          handleDesignationChange(
                            index,
                            "available_posts",
                            e.target.value
                          )
                        }
                        aria-label="available_posts"
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder="vacancy"
                        value={desg.section_posts - desg.available_posts} // Correct the subtraction
                        aria-label="vacancy"
                        readOnly
                      />
                    </Col>
                  </Row>
                ))}
            </Container>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="outline-secondary" type="submit">
                Submit
              </Button>
            </div>
            {responseMessage && (
              <div className="text-center mt-3">{responseMessage}</div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DepotMaster;
