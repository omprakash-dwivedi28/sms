import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
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
    skillRatings: {},
    exp: "",
    education: "",
    achivment: "",
  });

  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedgp, setSelectedGP] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDesg, setSelectedDesg] = useState("");

  const { depots, skills, gps, desgs, qualifications } = useGlobalContext();
  const [responseMessage, setResponseMessage] = useState("");
  const [isPFNoAvailable, setIsPFNoAvailable] = useState(true);
  const [isHRMSNoAvailable, setIsHRMSNoAvailable] = useState(true);
  const [selectededu, setSelectedEdu] = useState("");

  // console.log("desgs", desgs);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
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
    } else if (name === "skills") {
      const updatedSkills = checked
        ? [...formData.skills, value]
        : formData.skills.filter((skill) => skill !== value);
      setFormData({
        ...formData,
        skills: updatedSkills,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSkillRatingChange = (skill, rating) => {
    setFormData((prevData) => {
      const newSkillRatings = {
        ...prevData.skillRatings,
        [skill]: rating,
      };
      return {
        ...prevData,
        skillRatings: newSkillRatings,
        // rating: newSkillRatings // Update the rating field
      };
    });
  };
  // useEffect(() => calculateAverageRating()[handleSkillRatingChange]);
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

  const validateDates = () => {
    const { dob, doa, dor, pf_no, hrms_id } = formData;
    const currentDate = new Date();
    const isValidPFNo = /^\d{11}$/.test(pf_no);
    const isValidHRMSID = /^[A-Z,a-z]{6}$/.test(hrms_id);
    if (!isValidPFNo) {
      setResponseMessage("PF NO must be exactly 11 digits.");
      return false;
    }
    if (!isValidHRMSID) {
      setResponseMessage("HRMS ID must be exactly 6 letters");
      return false;
    }
    if (new Date(dob) > currentDate) {
      setResponseMessage("Date of Birth (DOB) cannot be a future date.");
      return false;
    }
    if (new Date(dob) >= new Date(doa)) {
      setResponseMessage(
        "Date of Birth (DOB) should be earlier than Date of Appointment (DOA)."
      );
      return false;
    }
    if (new Date(doa) >= new Date(dor)) {
      setResponseMessage(
        "Date of Appointment (DOA) should be earlier than Date of Retirement (DOR)."
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    const calculateAverageRating = () => {
      const ratings = Object.values(formData.skillRatings);
      if (ratings.length === 0) return 0;
      const sum = ratings.reduce((acc, rating) => acc + Number(rating), 0);
      return (sum / ratings.length).toFixed(2);
    };
    setFormData((prevData) => ({
      ...prevData,
      rating: calculateAverageRating(),
    }));
  }, [formData.skillRatings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!validateDates()) {
      return;
    }

    if (!isPFNoAvailable) {
      setResponseMessage(
        "PF NO already exists. Please choose another PF NUMBER."
      );
      return;
    }

    try {
      const response = await fetch("https://railwaymcq.com/sms/addEmp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setResponseMessage("Employee added successfully!");
        setFormData({
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
          rating: "",
          level: "",
          skills: [],
          skillRatings: {},
          exp: "",
          education: "",
          achivment: "",
        });
        setSelectedDepot("");
        setSelectedGP("");
        setSelectedLevel("");
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

    if (birthDay > 7) {
      dor = new Date(dor.getFullYear(), birthMonth + 1, 0);
    } else {
      dor = new Date(dor.getFullYear(), birthMonth, 0);
    }

    // Format the output to YYYY-MM-DD
    const formattedDor = `${dor.getFullYear()}-${(dor.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dor.getDate().toString().padStart(2, "0")}`;
    return formattedDor;
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  //   const year = date.getFullYear();

  //   return `${day}/${month}/${year}`;
  // };
  useEffect(() => {
    const { dob, doa } = formData;

    if (dob && doa) {
      const dor = calculateRetirementDate(dob, doa);
      // console.log("dor>>>>>>>", dor);
      setFormData((prevData) => ({
        ...prevData,
        dor,
      }));
    }
  }, [formData.dob, formData.doa]);

  const calculateYearsOfExperience = (doa) => {
    const doaDate = new Date(doa); // Date of Appointment or start date
    const currentDate = new Date(); // Current date
    console.log("");
    // Calculate the difference in years
    let yearsOfExperience = currentDate.getFullYear() - doaDate.getFullYear();

    // Adjust if the current date is before the anniversary of the start date this year
    const monthDiff = currentDate.getMonth() - doaDate.getMonth();
    const dayDiff = currentDate.getDate() - doaDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      yearsOfExperience--;
    }
    console.log(yearsOfExperience);
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
  return (
    <div className="d-flex justify-content-center vh-100 bg-light">
      <Card
        className="shadow-sm p-4 mb-5 bg-white rounded"
        style={{ overflow: "auto", width: "38rem" }}
      >
        <Card.Body style={{ height: "450px" }}>
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
                onChange={handleChange}
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
              {console.log("dor:::::::::::::::", formData.dor)}
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
                placeholder="Rate your employee 1-5, 5 is outstanding"
                required
                disabled
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Employee Skills</InputGroup.Text>
              <div className="d-flex flex-wrap">
                {skills?.map((skill, index) => (
                  <div key={`skill-checkbox-${index}`} className="me-3 mb-3">
                    <Form.Check
                      inline
                      label={skill.skill_name}
                      name="skills"
                      type="checkbox"
                      value={skill.skill_name}
                      onChange={handleChange}
                      id={`inline-checkbox-${index}`}
                      checked={formData.skills.includes(skill.skill_name)}
                    />
                    {formData.skills.includes(skill.skill_name) && (
                      <Form.Control
                        type="number"
                        placeholder="Rate 1-10"
                        value={formData.skillRatings[skill.skill_name] || ""}
                        onChange={(e) =>
                          handleSkillRatingChange(
                            skill.skill_name,
                            e.target.value
                          )
                        }
                        min="1"
                        max="5"
                        className="mt-2"
                      />
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
  );
}

export default EmpMaster;
