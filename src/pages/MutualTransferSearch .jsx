import React, { useState, useEffect } from "react";

const MutualTransferSearch = () => {
  const [employee, setEmployee] = useState(null);
  const [criteria, setCriteria] = useState({
    depot: "",
    level: "",
    skills: "",
    rating: "",
  });
  const [matches, setMatches] = useState([]);

  // Function to fetch the employee details
  const fetchEmployee = async (identifier) => {
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/EditableEmp.php?pf_no=${identifier}`
      );
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  // Function to search for mutual transfer candidates
  const searchMutualTransfer = async () => {
    try {
      const response = await fetch("/api/searchMutualTransfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...criteria,
          currentDepot: employee.depot_id,
        }),
      });
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error searching for matches:", error);
    }
  };

  // Fetch matching candidates when employee or criteria changes
  useEffect(() => {
    if (employee) {
      searchMutualTransfer();
    }
  }, [employee, criteria]);

  return (
    <div>
      <h2>Mutual Transfer Search</h2>
      {/* Employee Selection */}
      <div>
        <label>Enter Employee ID:</label>
        <input
          type="text"
          onBlur={(e) => fetchEmployee(e.target.value)}
          placeholder="Enter PF No. or HRMS ID"
        />
      </div>

      {/* Display Employee Profile */}
      {employee && (
        <div>
          <h3>Employee Profile</h3>
          <p>
            <strong>Name: </strong> {employee.emp_name}
          </p>
          <p>
            <strong>Depot: </strong> {employee.depot_name}
          </p>
          <p>
            <strong>Level: </strong> {employee.level}
          </p>
          <p>
            <strong>Post: </strong>
            {employee.post}
          </p>
          <p>
            <strong>GP: </strong>
            {employee.gp}
          </p>
        </div>
      )}

      {/* Search Criteria Form */}
      <div>
        <h3>Search Criteria</h3>
        <label>Depot:</label>
        <input
          type="text"
          value={criteria.depot}
          onChange={(e) => setCriteria({ ...criteria, depot: e.target.value })}
        />
        <label>Level:</label>
        <input
          type="text"
          value={criteria.level}
          onChange={(e) => setCriteria({ ...criteria, level: e.target.value })}
        />
        <label>Skills:</label>
        <input
          type="text"
          value={criteria.skills}
          onChange={(e) => setCriteria({ ...criteria, skills: e.target.value })}
        />
        <label>Rating:</label>
        <input
          type="number"
          value={criteria.rating}
          onChange={(e) => setCriteria({ ...criteria, rating: e.target.value })}
        />
        <button onClick={searchMutualTransfer}>Search</button>
      </div>

      {/* Matching Employees */}
      <div>
        <h3>Matching Employees</h3>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.emp_id}>
              <p>Name: {match.emp_name}</p>
              <p>Depot: {match.depot_name}</p>
              <p>Level: {match.level}</p>
              {/* <p>Skills: {match.skills.join(", ")}</p> */}
              <p>Rating: {match.rating}</p>
            </div>
          ))
        ) : (
          <p>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default MutualTransferSearch;
