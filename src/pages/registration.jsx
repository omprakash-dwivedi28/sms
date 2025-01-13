import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function Registration(props) {
  const [formData, setFormData] = useState({
    zone: "",
    division: "",
    deptt: "",
    name: "",
    userName: "",
    password: "",
    repassword: "",
    partener_flag: "0",
    ch_id: "",
  });
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isPartener, setIsPartener] = useState(false);

  const navigate = useNavigate();
  const { deptt, zone_division } = useGlobalContext();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value === "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Please select a ${name}`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }

    if (name === "userName") {
      if (/^[a-zA-Z]{6}$/.test(value)) {
        setIsCheckingUsername(true);
        try {
          const response = await fetch(
            `https://railwaymcq.com/student/checkUsernameAvailability.php?username=${value}`
          );
          const data = await response.json();
          setIsUsernameAvailable(data.isAvailable);
          setErrors((prevState) => ({
            ...prevState,
            userName: data.isAvailable ? "" : "Username is already taken",
          }));
        } catch (error) {
          console.error("Error checking username availability:", error);
        }
        setIsCheckingUsername(false);
      } else {
        setErrors((prevState) => ({
          ...prevState,
          userName: "Username must be HRMS ID",
        }));
        setIsUsernameAvailable(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "zone",
      "division",
      "deptt",
      "name",
      "userName",
      "password",
      "repassword",
    ];

    if (isPartener) {
      requiredFields.push("ch_id");
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrors((prevState) => ({
          ...prevState,
          [field]: `Please fill in the ${field} field`,
        }));
        return;
      }
    }

    if (formData.password !== formData.repassword) {
      setErrors((prevState) => ({
        ...prevState,
        repassword: "Passwords do not match",
      }));
      return;
    }

    try {
      if (
        Object.values(errors).some((error) => error !== "") ||
        !isUsernameAvailable
      ) {
        alert("Please fix the errors before submitting the form");
        return;
      }

      console.log("Form Data:", JSON.stringify(formData, null, 2));

      alert("User added successfully");
      navigate("/Log&Reg");
      setFormData({
        zone: "",
        division: "",
        deptt: "",
        name: "",
        userName: "",
        password: "",
        repassword: "",
        partener_flag: "0",
        ch_id: "",
      });
      setIsPartener(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleIsNewPartener = (e) => {
    const { checked } = e.target;
    setIsPartener(checked);
    setFormData((prevState) => ({
      ...prevState,
      partener_flag: checked ? "1" : "0",
    }));
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="bg-light p-4 shadow rounded">
        <h3 className="text-center mb-4">Sign Up</h3>

        {isPartener && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="ch_id"
              value={formData.ch_id}
              onChange={handleChange}
              placeholder="Enter Your Channel ID"
            />
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-4">
            <select
              className="form-select"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
            >
              <option value="">Select Zone</option>
              {zone_division?.map((zoneObject) =>
                Object.entries(zoneObject)?.map(([zone]) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))
              )}
            </select>
            {errors.zone && <p className="text-danger mt-1">{errors.zone}</p>}
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="division"
              value={formData.division}
              onChange={handleChange}
            >
              <option value="">Select Division</option>
              {zone_division?.map((zones) =>
                Object.entries(zones)?.map(([zone, divisions]) =>
                  zone === formData.zone
                    ? divisions?.map((division) => (
                        <option key={division} value={division}>
                          {division}
                        </option>
                      ))
                    : null
                )
              )}
            </select>
            {errors.division && (
              <p className="text-danger mt-1">{errors.division}</p>
            )}
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              name="deptt"
              value={formData.deptt}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {deptt?.map((depttObject) => (
                <option key={depttObject.deptt} value={depttObject.dept_name}>
                  {depttObject.dept_name}
                </option>
              ))}
            </select>
            {errors.deptt && <p className="text-danger mt-1">{errors.deptt}</p>}
          </div>
        </div>

        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-danger mt-1">{errors.name}</p>}
          </div>

          <div className="col-md-6">
            <input
              type="text"
              name="userName"
              className="form-control"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {isCheckingUsername && (
              <p className="text-info mt-1">
                Checking username availability...
              </p>
            )}
            {errors.userName && (
              <p className="text-danger mt-1">{errors.userName}</p>
            )}
          </div>
        </div>

        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-danger mt-1">{errors.password}</p>
            )}
          </div>

          <div className="col-md-6">
            <input
              type="password"
              name="repassword"
              className="form-control"
              value={formData.repassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.repassword && (
              <p className="text-danger mt-1">{errors.repassword}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" className="btn btn-success w-100">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
