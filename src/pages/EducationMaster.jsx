import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import { FaPlus, FaEdit, FaSave } from "react-icons/fa"; // Added icons
import { BsDatabaseFillAdd } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { FcList } from "react-icons/fc";

const EducationMaster = () => {
  const [newQualification, setNewQualification] = useState("");
  const [editQualification, setEditQualification] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const { qualifications } = useGlobalContext();
  const [localQualifications, setLocalQualifications] = useState([]);

  useEffect(() => {
    setLocalQualifications(qualifications);
  }, [qualifications]);

  const handleAddQualification = () => {
    if (
      localQualifications.some(
        (q) => q.quali_name.toLowerCase() === newQualification.toLowerCase()
      )
    ) {
      setError("This qualification already exists.");
      return;
    }

    const newQuali = { quali_name: newQualification };

    fetch("https://railwaymcq.com/sms/EduMaster.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuali),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLocalQualifications([...localQualifications, data]);
        setNewQualification("");
        setError("");
      })
      .catch((error) => {
        console.error("Error adding qualification:", error);
        setError("Failed to add qualification.");
      });
  };

  const handleEditQualification = (id) => {
    if (
      localQualifications.some(
        (q) =>
          q.quali_name.toLowerCase() === editQualification.toLowerCase() &&
          q.q_id !== id
      )
    ) {
      setError("This qualification already exists.");
      return;
    }

    fetch("https://railwaymcq.com/sms/EduMaster.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q_id: id, quali_name: editQualification }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedQualifications = localQualifications.map((q) =>
          q.q_id === id ? data : q
        );
        setLocalQualifications(updatedQualifications);
        setEditId(null);
        setEditQualification("");
        setError("");
      })
      .catch((error) => console.error("Error updating qualification:", error));
  };

  const handleSelectQualification = (e) => {
    const selectedId = e.target.value;
    const selectedQualification = localQualifications.find(
      (q) => q.q_id === parseInt(selectedId)
    );
    setEditId(selectedId);
    setEditQualification(selectedQualification?.quali_name || "");
  };

  return (
    <div className="container mt-5">
      <Card
        className="shadow-lg"
        style={{
          backgroundColor: "#BED7DC",
          color: "white",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <Card.Body className="fs-3 fw-bold">Education Master</Card.Body>
      </Card>

      <Card className="shadow mb-4">
        <Card.Header className="fs-5 fw-semibold bg-dark text-white">
          <BsDatabaseFillAdd />
          {"  "}
          Add New Qualification
        </Card.Header>
        <Card.Body>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2 shadow-sm"
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              placeholder="Enter qualification name"
              style={{ borderRadius: "8px" }}
            />
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleAddQualification}
              style={{ borderRadius: "8px", padding: "10px 20px" }}
            >
              <FaPlus className="me-2" /> Add
            </button>
          </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Card.Body>
      </Card>

      <Card className="shadow mb-4">
        <Card.Header className="fs-5 fw-semibold bg-success text-white">
          <RiEditBoxFill /> Edit Existing Qualification
        </Card.Header>
        <Card.Body>
          <select
            className="form-select shadow-sm mb-3"
            onChange={handleSelectQualification}
            value={editId || ""}
            style={{ borderRadius: "8px" }}
          >
            <option value="">Select a qualification to edit</option>
            {localQualifications?.map((qualification) => (
              <option key={qualification.q_id} value={qualification.q_id}>
                {qualification.quali_name}
              </option>
            ))}
          </select>

          {editId && (
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2 shadow-sm"
                value={editQualification}
                onChange={(e) => setEditQualification(e.target.value)}
                placeholder="Edit qualification name"
                style={{ borderRadius: "8px" }}
              />
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handleEditQualification(editId)}
                style={{ borderRadius: "8px", padding: "10px 20px" }}
              >
                <FaSave className="me-2" /> Save
              </button>
            </div>
          )}

          {error && <p className="text-danger mt-2">{error}</p>}
        </Card.Body>
      </Card>

      {/* List of Qualifications */}
      <Card className="shadow">
        <Card.Header className="fs-5 fw-semibold bg-info text-white">
          <FcList /> List of Qualifications
        </Card.Header>
        <Card.Body>
          <ul className="list-group">
            {localQualifications?.map((qualification) => (
              <li
                key={qualification.q_id}
                className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2"
                style={{
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                {qualification.quali_name}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EducationMaster;
