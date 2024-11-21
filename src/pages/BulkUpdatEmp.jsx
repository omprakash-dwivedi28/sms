import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const BulkUpdatEmp = () => {
  const [depot, setDepots] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const { depots } = useGlobalContext();

  const fetchEmployees = async (depotName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/sms/fetch_employees_for_bulk_updation.php?depot_name=${depotName}`
      );

      const text = await response.text();

      if (response.ok) {
        const data = JSON.parse(text);
        setEmployees(data);
      } else {
        console.error("Error fetching employees:", text);
        alert("Failed to fetch employees: " + text);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert(
        "Error fetching employees. Please check the console for more details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDepotChange = (event) => {
    const depotId = event.target.value;
    setSelectedDepot(depotId);
    if (depotId) {
      fetchEmployees(depotId);
    } else {
      setEmployees([]);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/sms/bulk_update_employees.php",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employees }),
        }
      );

      const responseText = await response.text();
      if (response.ok) {
        const data = JSON.parse(responseText);
        alert("Employees updated successfully!");
      } else {
        console.error("Failed to update employees:", response.statusText);
        alert("Failed to update employees.");
      }
    } catch (error) {
      console.error("Error updating employees:", error);
      alert("Error updating employees.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Bulk Update Employees</h1>

      {/* Depot Selection */}
      <div className="mb-3 row">
        <label htmlFor="depotSelect" className="col-sm-2 col-form-label">
          Select Depot:
        </label>
        <div className="col-sm-6">
          <select
            id="depotSelect"
            className="form-select"
            value={selectedDepot}
            onChange={handleDepotChange}
          >
            <option value="">--Select Depot--</option>
            {depots.map((depot) => (
              <option key={depot.depot_id} value={depot.depot_id}>
                {depot.depot_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : employees.length > 0 ? (
        <div className="table-responsive table-responsive-sm">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark text-nowrap">
              <tr>
                <th>Sr. No.</th>
                <th>emp_id</th>
                <th>depot_id</th>
                <th>depot_name</th>
                <th>emp_name</th>
                <th>mobile_no</th>
                <th>email_id</th>
                <th>pf_no</th>
                <th>hrms_id</th>
                <th>gp</th>
                <th>dob</th>
                <th>doa</th>
                <th>dor</th>
                <th>post</th>
                <th>rating</th>
                <th>level</th>
                <th>exp</th>
                <th>education</th>
                <th>otherEducation</th>
                <th>achivment</th>
                <th>depot_joining_date</th>
                <th>tr_flag</th>
                <th>tr_date</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.emp_id}>
                  <td>{index + 1}</td>
                  {Object.keys(employee).map((key) => (
                    <td key={key} className="text-nowrap">
                      {key === "emp_id" ||
                      key === "depot_id" ||
                      key === "depot_name" ? (
                        employee[key]
                      ) : (
                        <input
                          type="text"
                          className="form-control form-control-sm w-auto"
                          value={employee[key] || ""}
                          onChange={(e) =>
                            handleInputChange(index, key, e.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">
          No employees found for the selected depot.
        </p>
      )}

      {/* Save Button */}
      {employees.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUpdatEmp;
