import React, { useState, useEffect } from "react";
import EmpScatter from "./Charts/EmpScatter";
import EmpBar from "./Charts/EmpBar";
import Pie from "./Charts/pie";

import Card from "react-bootstrap/Card";
import { useGlobalContext } from "../context/GlobalContext";

function EmpAnalytics() {
  const [chartType, setChartType] = useState("Scatter");
  const [reportType, setReportType] = useState("Employee with skill");
  const { depots } = useGlobalContext();
  const [selectedDepot, setSelectedDepot] = useState("");
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const chartOptions = ["Scatter", "Bar", "Pie"];

  const reportOptions = ["Employee with skill", "Other"];

  const handleDepotChange = (e) => {
    setSelectedDepot(e.target.value);
  };
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  // Fetch employees when a depot is selected
  useEffect(() => {
    if (selectedDepot) {
      // Fetch employees for the selected depot
      fetch(
        `https://railwaymcq.com/sms/employeeTransferOperaton.php?depot_id=${selectedDepot}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setEmployees(data.employee_data);
          //   console.log("employees", employees);
          setSelectedEmployee(""); // Reset employee selection on depot change
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          setEmployees([]); // Reset employees if there's an error
        });
    } else {
      setEmployees([]); // Clear employees if no depot is selected
    }
  }, [selectedDepot]);

  const renderChart = () => {
    switch (chartType) {
      case "Scatter":
        // console.log("selectedEmployee", selectedEmployee);
        return <EmpScatter reportType={reportType} emp_id={selectedEmployee} />;
      case "Bar":
        return <EmpBar reportType={reportType} emp_id={selectedEmployee} />;
      case "Pie":
        return <Pie reportType={reportType} emp_id={selectedEmployee} />;
      default:
        return <EmpScatter reportType={reportType} emp_id={selectedEmployee} />;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Card>
        <Card.Header className="custom-card-header">
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="chartType" style={{ marginRight: "10px" }}>
              Select Chart Type:
            </label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{ padding: "5px", fontSize: "16px" }}
            >
              {chartOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <label htmlFor="chartType" style={{ marginRight: "10px" }}>
              Select Depot:
            </label>
            <select value={selectedDepot} onChange={handleDepotChange}>
              <option value="">Select Depot</option>
              {depots?.map((depot) => (
                <option key={depot.depo_id} value={depot.depo_id}>
                  {depot.depot_name}
                </option>
              ))}
            </select>
            {/* {console.log("selectedDepot", selectedDepot)}
            {console.log("employees.length", employees.length)} */}
            {selectedDepot && employees.length > 0 && (
              <>
                <label htmlFor="employeeSelect" style={{ marginRight: "10px" }}>
                  Select Employee:
                </label>
                <select
                  id="employeeSelect"
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  style={{ padding: "5px", fontSize: "16px" }}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.emp_id} value={employee.emp_id}>
                      {employee.emp_name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {selectedDepot && employees.length === 0 && (
              <p style={{ color: "red", marginTop: "10px" }}>
                No employees found for this depot.
              </p>
            )}
            <label htmlFor="reportType" style={{ marginRight: "10px" }}>
              Select Report Type:
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ padding: "5px", fontSize: "16px" }}
            >
              {reportOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </Card.Header>
        <div style={{ marginTop: "30px" }}>{renderChart()}</div>
      </Card>
    </div>
  );
}

export default EmpAnalytics;
