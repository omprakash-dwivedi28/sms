import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

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
        console.log("API Response:", data);
        setLocalQualifications([...localQualifications, data]);
        setNewQualification("");
        setError("");
      })
      .catch((error) => console.error("Error adding qualification:", error));
  };

  const handleEditQualification = (id) => {
    if (
      localQualifications.some(
        (q) => q.quali_name.toLowerCase() === editQualification.toLowerCase()
      )
    ) {
      setError("This qualification already exists.");
      return;
    }
    console.log("editQualification", editQualification);
    fetch(`https://railwaymcq.com/sms/EduMaster.php`, {
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

  return (
    <div className="container mt-5">
      <Card
        style={{
          width: "100%",
          backgroundColor: "gray",

          borderRadius: "0.5rem",
          textAlign: "center",
          padding: "20px",
          fontSize: "2rem",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <Card.Body>Education Master</Card.Body>
      </Card>
      <h1 className="mb-4"></h1>

      <div className="mb-4">
        <h3>Add New Qualification</h3>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={newQualification}
            onChange={(e) => setNewQualification(e.target.value)}
            placeholder="Enter qualification name"
          />
          <button className="btn btn-primary" onClick={handleAddQualification}>
            Add
          </button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      <div>
        <h3>Existing Qualifications</h3>
        <ul className="list-group">
          {localQualifications?.map((qualification, index) => {
            return (
              <li
                key={qualification.q_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editId === qualification.q_id ? (
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={editQualification}
                      onChange={(e) => setEditQualification(e.target.value)}
                      placeholder="Edit qualification name"
                    />
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleEditQualification(qualification.q_id)
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between w-100">
                    <span>{qualification.quali_name}</span>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setEditId(qualification.q_id);
                        setEditQualification(qualification.quali_name);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EducationMaster;
