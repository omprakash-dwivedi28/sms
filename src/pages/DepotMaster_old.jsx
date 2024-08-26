import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

function DepotMaster() {
  const [formData, setFormData] = useState({
    depot_name: "",
    depot_fullname: "",
    depot_size: "",
    staff_capacity: "",
    staff_avail: "",
    staff_required: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isDepotNameAvailable, setIsDepotNameAvailable] = useState(true);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "depot_name") {
      // Check availability of depot_name
      await checkDepotNameAvailability(value);
    }
  };

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

  useEffect(() => {
    const { staff_capacity, staff_avail } = formData;
    const capacity = parseInt(staff_capacity) || 0;
    const available = parseInt(staff_avail) || 0;
    setFormData((prevData) => ({
      ...prevData,
      staff_required: capacity - available,
    }));
  }, [formData.staff_capacity, formData.staff_avail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDepotNameAvailable) {
      setResponseMessage(
        "Depot code is already exist. Please choose another depot code."
      );
      return;
    }

    try {
      const response = await fetch("https://railwaymcq.com/sms/addDepot.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage("Depot added successfully!");
        setFormData({
          ...formData,
          depot_name: "",
          depot_fullname: "",
          depot_size: "",
          staff_capacity: "",
          staff_avail: "",
          staff_required: "",
        });
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "38rem", padding: "20px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Depot Information
          </Card.Title>
          <Form onSubmit={handleSubmit}>
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
                Depot code is already taken. Please choose another depot. code.
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
                isInvalid={!isDepotNameAvailable}
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
              <InputGroup.Text>Staff Capacity</InputGroup.Text>
              <Form.Control
                name="staff_capacity"
                value={formData.staff_capacity}
                onChange={handleChange}
                aria-label="staff_capacity"
                required
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Staff Available</InputGroup.Text>
              <Form.Control
                name="staff_avail"
                value={formData.staff_avail}
                onChange={handleChange}
                aria-label="staff_avail"
                required
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Staff Required</InputGroup.Text>
              <Form.Control
                name="staff_required"
                value={formData.staff_required}
                readOnly
                aria-label="staff_required"
              />
            </InputGroup>
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
