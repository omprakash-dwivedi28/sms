import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Table,
} from "react-bootstrap";
import { useGlobalContext } from "../context/GlobalContext";

const SkillMaster = () => {
  const [skill, setSkill] = useState("");
  const [subSkill, setSubSkill] = useState("");
  const [isUpdatingSubSkill, setIsUpdatingSubSkill] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filteredSubskills, setFilteredSubskills] = useState([]);

  const { skills, subskills } = useGlobalContext();

  const isDuplicateEntry = () => {
    if (!isUpdatingSubSkill) {
      const duplicateSkill = skills?.some(
        (skl) =>
          skl.skill_name.trim().toLowerCase() === skill.trim().toLowerCase()
      );
      if (duplicateSkill) {
        setError("Skill already exists.");
        return true;
      }
    }

    const duplicateSubSkill = subskills?.some(
      (subskl) =>
        subskl.subskill.trim().toLowerCase() === subSkill.trim().toLowerCase()
    );

    if (duplicateSubSkill) {
      setError("SubSkill already exists for this skill.");
      return true;
    }
  };

  const handleSkillSubmit = async () => {
    setError("");
    setSuccess("");

    if ((!isUpdatingSubSkill && !skill) || !subSkill) {
      setError("Please fill in the required fields.");
      return;
    }
    if (isDuplicateEntry()) {
      return;
    }
    const data = {
      skill,
      subSkill,
      isUpdatingSubSkill,
    };

    try {
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

  useEffect(() => {
    if (skill) {
      const filtered = subskills?.filter(
        (subskl) =>
          subskl.skill_name.trim().toLowerCase() === skill.trim().toLowerCase()
      );
      setFilteredSubskills(filtered);
    }
  }, [skill, subskills]);

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

        {/* Display filtered subskills */}
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Previous Entered SubSkills for selected Skill
              </Card.Title>

              {filteredSubskills && filteredSubskills.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>SubSkill</th>
                      {/* <th>Verify</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubskills.map((subskl, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{subskl.subskill}</td>
                        {/* <td>
                          <Form.Check type="checkbox" label="Verified" />
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="warning">
                  No subskills found for this skill.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SkillMaster;
