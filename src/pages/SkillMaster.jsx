import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useGlobalContext } from "../context/GlobalContext";

const SkillMaster = () => {
  const [skill, setSkill] = useState("");
  const [subSkill, setSubSkill] = useState("");
  const [isUpdatingSubSkill, setIsUpdatingSubSkill] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { skills } = useGlobalContext(); // Getting the list of skills from global context

  const handleSkillSubmit = async () => {
    setError("");
    setSuccess("");

    if ((!isUpdatingSubSkill && !skill) || !subSkill) {
      setError("Please fill in the required fields.");
      return;
    }

    const data = {
      skill,
      subSkill,
      isUpdatingSubSkill,
    };

    try {
      console.log("data", data);
      const response = await fetch(
        "https://railwaymcq.com/sms/add-skill-master.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Handle text response if JSON fails
      const resultText = await response.text();
      try {
        const result = JSON.parse(resultText);
        if (result.success) {
          setSuccess("Skill and SubSkill saved successfully!");
          setSkill("");
          setSubSkill("");
          setIsUpdatingSubSkill(false);
        } else {
          setError(result.error || "Error saving skill data.");
        }
      } catch (err) {
        setError("Error parsing server response: " + resultText);
      }
    } catch (error) {
      setError("Error communicating with the server.");
      console.log(error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Skill Master Entry
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form>
                {/* If updating subskill, show dropdown to select skill from global context */}
                {isUpdatingSubSkill ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Select Skill to Update</Form.Label>
                    <Form.Select
                      aria-label="Select Skill"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                    >
                      <option value="">Select Existing Skill</option>
                      {skills?.map((skl) => (
                        <option key={skl.skill_id} value={skl.skill_name}>
                          {skl.skill_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>Enter New Skill</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Skill"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>SubSkill</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter SubSkill"
                    value={subSkill}
                    onChange={(e) => setSubSkill(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="updateSubSkill">
                  <Form.Check
                    type="checkbox"
                    label="Enter SubSkill for Existing Skill"
                    checked={isUpdatingSubSkill}
                    onChange={(e) => setIsUpdatingSubSkill(e.target.checked)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleSkillSubmit}
                  className="w-100"
                >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SkillMaster;
