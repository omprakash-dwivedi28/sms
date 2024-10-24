import React, { useEffect, useState } from "react";
import {
  Form,
  Col,
  Table,
  Alert,
  Row,
  Button,
  Card,
  InputGroup,
  Container,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";

function EmpMaster() {
  const [formData, setFormData] = useState({
    depo_id: "",
    depot_name: "",
    emp_name: "",
    mobile_no: "",
    email_id: "",
    pf_no: "",
    hrms_id: "",
    gp: "",
    dob: "",
    doa: "",
    dor: "",
    post: "",
    rating: 0,
    level: "",
    skills: [],
    exp: "",
    education: "",
    achivment: "",
    otherEducation: "",
  });

  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedgp, setSelectedGP] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDesg, setSelectedDesg] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isPFNoAvailable, setIsPFNoAvailable] = useState(true);
  const [isHRMSNoAvailable, setIsHRMSNoAvailable] = useState(true);
  const [selectededu, setSelectedEdu] = useState("");
  const [filteredSubskills, setFilteredSubskills] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { depots, skills, subskills, gps, desgs, qualifications } =
    useGlobalContext();

  const handleChange = async (e) => {
    const { name, value, checked } = e.target;
    if (name === "pf_no") {
      setFormData({
        ...formData,
        [name]: value,
      });
      await checkPFNoAvailability(value);
    } else if (name === "hrms_id") {
      setFormData({
        ...formData,
        [name]: value.toUpperCase(),
      });
      await checkHRMSNoAvailability(value);
    }
    if (name === "skills") {
      const selectedSkill = skills.find((skill) => skill.skill_name === value);

      const skillExists = formData.skills.some(
        (skillObj) => Object.keys(skillObj)[0] === selectedSkill.skill_name
      );

      if (checked && !skillExists) {
        setFormData((prevData) => ({
          ...prevData,
          skills: [
            ...prevData.skills,
            {
              [selectedSkill.skill_name]: {
                subskills: {},
                avgRating: 0,
              },
            },
          ],
        }));
      } else if (!checked && skillExists) {
        setFormData((prevData) => ({
          ...prevData,
          skills: prevData.skills.filter(
            (skillObj) => Object.keys(skillObj)[0] !== selectedSkill.skill_name
          ),
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation
    return emailRegex.test(inputEmail);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setFormData({
      ...formData,
      email_id: e.target.value,
    });
    // Check if the email is valid
    if (!validateEmail(inputEmail)) {
      setResponseMessage("Invalid email address");
    } else {
      setResponseMessage("");
    }
  };
  const handleSubskillRatingChange = (subskill, rating, skillName) => {
    setFormData((prevData) => {
      const updatedSkills = prevData.skills.map((skillObj) => {
        const skillKey = Object.keys(skillObj)[0];
        if (skillKey === skillName) {
          const updatedSubskills = {
            ...skillObj[skillKey].subskills,
            [subskill]: parseInt(rating, 10),
          };
          const subskillRatings = Object.values(updatedSubskills);
          const avgRating =
            subskillRatings.length > 0
              ? subskillRatings.reduce((a, b) => a + b, 0) /
                subskillRatings.length
              : 0;

          return {
            [skillKey]: {
              ...skillObj[skillKey],
              subskills: updatedSubskills,
              avgRating: avgRating.toFixed(2),
            },
          };
        }
        return skillObj;
      });

      return {
        ...prevData,
        skills: updatedSkills,
      };
    });
  };

  const checkPFNoAvailability = async (pfNo) => {
    try {
      const pfno_flag = true;
      const response = await fetch(
        `https://railwaymcq.com/sms/emp_validation.php?pf_no=${encodeURIComponent(
          pfNo
        )}&pfno_flag=${pfno_flag}`
      );
      const result = await response.json();
      setIsPFNoAvailable(result.isAvailable);
    } catch (error) {
      console.error("Error checking PF NO availability:", error);
      setIsPFNoAvailable(false);
    }
  };
  const checkHRMSNoAvailability = async (hrms_id) => {
    try {
      const hrms_flag = true;
      const response = await fetch(
        `https://railwaymcq.com/sms/emp_validation.php?hrms_id=${encodeURIComponent(
          hrms_id
        )}&hrms_flag=${hrms_flag}`
      );
      const result = await response.json();
      setIsHRMSNoAvailable(result.isAvailable);
    } catch (error) {
      console.error("Error checking HRMS NO availability:", error);
      setIsHRMSNoAvailable(false);
    }
  };
  useEffect(() => {
    if (formData.skills.length > 0) {
      const lastSelectedSkill = Object.keys(
        formData.skills[formData.skills.length - 1]
      )[0];
      const filtered = subskills?.filter(
        (subskl) =>
          subskl.skill_name.trim().toLowerCase() ===
          lastSelectedSkill.trim().toLowerCase()
      );
      setFilteredSubskills(filtered);
    } else {
      setFilteredSubskills([]);
    }
  }, [formData.skills, subskills]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setResponseMessage("Please enter a valid email");
      return;
    }
    if (!isPFNoAvailable) {
      setResponseMessage("PF NO already exists. Please choose another.");
      return;
    }

    try {
      console.log("formData", formData);
      const response = await fetch(
        "https://railwaymcq.com/sms/Insert_emp_data_and_skil.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Employee added successfully!");
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  const handleDepotChange = (e) => {
    const selectedDepot = e.target.value;
    const [depot_name, depo_id] = selectedDepot.split("+");
    setSelectedDepot(selectedDepot);
    setFormData({
      ...formData,
      depot_name,
      depo_id,
    });
  };

  const handleGPChange = (e) => {
    setSelectedGP(e.target.value);
    setFormData({
      ...formData,
      gp: e.target.value,
    });
  };

  const handleEduChange = (e) => {
    setSelectedEdu(e.target.value);
    setFormData({
      ...formData,
      education: e.target.value,
    });
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setFormData({
      ...formData,
      level: e.target.value,
    });
  };

  const handleDesgChange = (e) => {
    setSelectedDesg(e.target.value);
    setFormData({
      ...formData,
      post: e.target.value,
    });
  };

  const calculateRetirementDate = (dob, doa) => {
    const dobDate = new Date(dob);
    const doaDate = new Date(doa);

    const retirementAgeDate = new Date(dobDate);
    retirementAgeDate.setFullYear(dobDate.getFullYear() + 60);

    const retirementServiceDate = new Date(doaDate);
    retirementServiceDate.setFullYear(doaDate.getFullYear() + 35);

    let dor =
      retirementAgeDate < retirementServiceDate
        ? retirementAgeDate
        : retirementServiceDate;

    const birthMonth = dobDate.getMonth();
    const birthDay = dobDate.getDate();

    if (birthDay > 1) {
      dor = new Date(dor.getFullYear(), birthMonth + 1, 0);
    } else {
      dor = new Date(dor.getFullYear(), birthMonth, 0);
    }

    const formattedDor = `${dor.getFullYear()}-${(dor.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dor.getDate().toString().padStart(2, "0")}`;
    return formattedDor;
  };

  useEffect(() => {
    const { dob, doa } = formData;
    if (dob && doa) {
      const dor = calculateRetirementDate(dob, doa);
      setFormData((prevData) => ({
        ...prevData,
        dor,
      }));
    }
  }, [formData.dob, formData.doa]);

  const calculateYearsOfExperience = (doa) => {
    const doaDate = new Date(doa);
    const currentDate = new Date();

    let yearsOfExperience = currentDate.getFullYear() - doaDate.getFullYear();

    const monthDiff = currentDate.getMonth() - doaDate.getMonth();
    const dayDiff = currentDate.getDate() - doaDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      yearsOfExperience--;
    }

    return yearsOfExperience;
  };

  useEffect(() => {
    const { doa } = formData;
    if (doa) {
      const exp = calculateYearsOfExperience(doa);
      setFormData((prevData) => ({
        ...prevData,
        exp,
      }));
    }
  }, [formData.doa]);

  const calculateOverallRating = (skills) => {
    const totalSkills = skills.length;

    const totalAvgRatings = skills.reduce((total, skillObj) => {
      const skillName = Object.keys(skillObj)[0];
      const avgRating = parseFloat(skillObj[skillName].avgRating) || 0;
      return total + avgRating;
    }, 0);

    const overallRating =
      totalSkills > 0 ? (totalAvgRatings / totalSkills).toFixed(2) : 0;

    return overallRating;
  };

  useEffect(() => {
    const overallRating = calculateOverallRating(formData.skills);
    setFormData((prevData) => ({
      ...prevData,
      rating: overallRating,
    }));
  }, [formData.skills]);

  return (
    <div className="d-flex justify-content-center  bg-light">
      <div className="">
        <div className="row">
          <div className=" col-md-6">
            <Card
              className="shadow-sm p-4 mb-5 bg-white rounded"
              style={{ overflow: "auto", width: "35rem" }}
            >
              {/* <FaEdit style={{ colour: "red" }} /> */}

              <Card.Body style={{ height: "550px" }}>
                <Card.Title className="text-center mb-4">
                  Employee Information
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Depot"
                      name="depot_name"
                      value={selectedDepot}
                      onChange={handleDepotChange}
                      className="custom-select"
                    >
                      <option value="">Select Depot</option>
                      {depots?.map((depot) => (
                        <option
                          key={depot.depo_id}
                          value={`${depot.depot_name}+${depot.depo_id}`}
                        >
                          {depot.depot_name}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Employee Name</InputGroup.Text>
                    <Form.Control
                      name="emp_name"
                      value={formData.emp_name}
                      onChange={handleChange}
                      aria-label="Employee Name"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Mobile No</InputGroup.Text>
                    <Form.Control
                      name="mobile_no"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      aria-label="Mobile No"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Email Id</InputGroup.Text>
                    <Form.Control
                      name="email_id"
                      value={formData.email_id}
                      onChange={handleEmailChange}
                      aria-label="Email Id"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>PF NO</InputGroup.Text>
                    <Form.Control
                      name="pf_no"
                      value={formData.pf_no}
                      onChange={handleChange}
                      aria-label="PF NO"
                      required
                      isInvalid={!isPFNoAvailable}
                    />
                    <Form.Control.Feedback type="invalid">
                      PF NO already exists. Please choose another.
                    </Form.Control.Feedback>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>HRMS ID</InputGroup.Text>
                    <Form.Control
                      name="hrms_id"
                      value={formData.hrms_id}
                      onChange={handleChange}
                      aria-label="HRMS ID"
                      required
                      isInvalid={!isHRMSNoAvailable}
                    />
                    <Form.Control.Feedback type="invalid">
                      HRMS ID already exists. Please choose another.
                    </Form.Control.Feedback>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Grade Pay"
                      name="gp"
                      value={selectedgp}
                      onChange={handleGPChange}
                      className="custom-select"
                    >
                      <option value="">Select Grade Pay</option>
                      {gps?.map((gp) => (
                        <option key={gp.gp_id} value={gp.gp}>
                          {gp.gp}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Pay Level"
                      name="level"
                      value={selectedLevel}
                      onChange={handleLevelChange}
                      className="custom-select"
                    >
                      <option value="">Select Pay Level</option>
                      {gps?.map((gp) => (
                        <option key={gp.gp_id} value={gp.level}>
                          {gp.level}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>DOB</InputGroup.Text>
                    <Form.Control
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      aria-label="Date of Birth"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>DOA</InputGroup.Text>
                    <Form.Control
                      name="doa"
                      type="date"
                      value={formData.doa}
                      onChange={handleChange}
                      aria-label="Date of Appointment"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>DOR</InputGroup.Text>
                    <Form.Control
                      name="dor"
                      type="date"
                      value={formData.dor}
                      onChange={handleChange}
                      aria-label="Date of Retirement"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Designation"
                      name="post"
                      value={selectedDesg}
                      onChange={handleDesgChange}
                      className="custom-select"
                      required
                    >
                      <option value="">Select Designation.</option>
                      {desgs?.map((desg) => (
                        <option key={desg.desg_id} value={desg.desg_name}>
                          {desg.desg_name}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Rating of Employee</InputGroup.Text>
                    <Form.Control
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      aria-label="Rating"
                      required
                      disabled
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Skills</InputGroup.Text>
                    <div className="d-flex flex-wrap">
                      {skills?.map((skill) => (
                        <div key={skill.skill_id} className="me-3 mb-3">
                          <Form.Check
                            inline
                            label={skill.skill_name}
                            name="skills"
                            type="checkbox"
                            value={skill.skill_name}
                            onChange={handleChange}
                          />
                          {formData.skills.some(
                            (skillObj) =>
                              Object.keys(skillObj)[0] === skill.skill_name
                          ) && (
                            <div className="mt-2">
                              <span>
                                {
                                  formData.skills.find(
                                    (skillObj) =>
                                      Object.keys(skillObj)[0] ===
                                      skill.skill_name
                                  )?.[skill.skill_name]?.avgRating
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Experience in years</InputGroup.Text>
                    <Form.Control
                      name="exp"
                      value={formData.exp}
                      onChange={handleChange}
                      aria-label="Experience"
                      required
                      disabled
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Select
                      aria-label="Select Education Qualification"
                      name="education"
                      value={selectededu}
                      onChange={handleEduChange}
                      className="custom-select"
                    >
                      <option value="">Select Education Qualification</option>
                      {qualifications?.map((quali) => (
                        <option key={quali.q_id} value={quali.quali_name}>
                          {quali.quali_name}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>

                  {selectededu === "Other" && (
                    <InputGroup className="mb-3">
                      <InputGroup.Text>Specify Other Education</InputGroup.Text>
                      <Form.Control
                        name="otherEducation"
                        value={formData.otherEducation}
                        onChange={handleChange}
                        placeholder="Specify other education"
                        required
                      />
                    </InputGroup>
                  )}

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Achivement</InputGroup.Text>
                    <Form.Control
                      name="achivment"
                      value={formData.achivment}
                      onChange={handleChange}
                      aria-label="achivment"
                      required
                    />
                  </InputGroup>

                  <div className="d-flex justify-content-center mt-4">
                    <Button variant="outline-primary" type="submit">
                      Submit
                    </Button>
                  </div>

                  {responseMessage && (
                    <div className="text-center mt-3 text-danger">
                      {responseMessage}
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </div>

          {/* Display filtered subskills */}
          <div className="col-md-6">
            <Card
              className="shadow-sm p-4 mb-5 bg-white rounded"
              style={{ overflow: "auto", width: "35rem" }}
            >
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  Please Enter rating for following sub skill
                </Card.Title>
                {filteredSubskills && filteredSubskills.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>SubSkill</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubskills?.map((subskill, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{subskill.subskill}</td>
                          <td>
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              value={
                                formData.skills.find((skill) =>
                                  Object.keys(skill).includes(
                                    subskill.skill_name
                                  )
                                )?.[subskill.skill_name]?.subskills?.[
                                  subskill.subskill
                                ] || ""
                              }
                              onChange={(e) =>
                                handleSubskillRatingChange(
                                  subskill.subskill,
                                  e.target.value,
                                  subskill.skill_name
                                )
                              }
                              placeholder="Rate 1-10"
                            />
                          </td>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpMaster;
