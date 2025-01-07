import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useGlobalContext } from "../context/GlobalContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";

function SearchStaffPosition() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedDepots, setSelectedDepots] = useState([]);
  const [selectedDesg, setSelectedDesg] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedDepot, setSuggestedDepot] = useState("");
  const [sectionso, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  const { depots, sections } = useGlobalContext();
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // console.log("sections", sections);

  useEffect(() => {
    if (employeeDetails && selectedDesg) {
      calculateBestDepot();
    }
  }, [selectedDesg, employeeDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDepots.length === 0 && selectedSections.length === 0) {
      setErrorMessage("Please select at least one Depot or Section.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // Determine API endpoint based on the selections
    let apiUrl = "";
    // console.log("selectedSections", selectedSections);
    if (selectedDepots.length > 0 && selectedSections.length > 0) {
      apiUrl = `https://railwaymcq.com/sms/SearchStaffPosition.php?depot_ids=${selectedDepots.join(
        ","
      )}&section_names=${selectedSections.join(",")}`;
    } else if (selectedDepots.length > 0) {
      apiUrl = `https://railwaymcq.com/sms/SearchStaffPosition.php?depot_ids=${selectedDepots.join(
        ","
      )}`;
    } else if (selectedSections.length > 0) {
      apiUrl = `https://railwaymcq.com/sms/SearchStaffPosition_sectionWise.php?section_names=${selectedSections.join(
        ","
      )}`;
    }

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch data.");

      const data = await response.json();
      if (data.status === "success") {
        setEmployeeDetails(data.data);
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to fetch employee data.");
        setEmployeeDetails(null);
      }
    } catch (error) {
      setErrorMessage("Error fetching data.");
      setEmployeeDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDepotChange = (depotId) => {
    if (depotId === "all") {
      if (selectedDepots.length === depots.length) {
        setSelectedDepots([]);
      } else {
        setSelectedDepots(depots.map((depot) => depot.depo_id));
      }
    } else {
      if (selectedDepots.includes(depotId)) {
        setSelectedDepots(selectedDepots.filter((id) => id !== depotId));
      } else {
        setSelectedDepots([...selectedDepots, depotId]);
      }
    }
  };

  const handleSectionChange = (sectionName) => {
    if (sectionName === "all") {
      // If "Select All" is clicked, toggle all sections
      if (selectedSections.length === sections.length) {
        setSelectedSections([]); // Deselect all if all are already selected
      } else {
        setSelectedSections(sections.map((section) => section.section_name)); // Select all sections
      }
    } else {
      // If a specific section is selected/deselected
      setSelectedSections((prevSelectedSections) =>
        prevSelectedSections.includes(sectionName)
          ? prevSelectedSections.filter((name) => name !== sectionName)
          : [...prevSelectedSections, sectionName]
      );
    }
  };

  const handleDesgChange = (e) => {
    setSelectedDesg(e.target.value);
  };

  const calculateBestDepot = () => {
    if (!employeeDetails || !selectedDesg) return;

    // Map designation to SS and MOR fields
    const desgFieldMap = {
      Supervisor: { ss: "ss_supervisor", mor: "mor_supervisor" },
      Technician: { ss: "ss_technician", mor: "mor_technician" },
      Assistant: { ss: "ss_asst", mor: "mor_asst" },
    };

    const { ss, mor } = desgFieldMap[selectedDesg] || {};
    if (!ss || !mor) return;

    // Find the depot with the highest shortfall
    const bestDepot = [...employeeDetails]
      .map((depot) => ({
        name: depot.depot_name,
        gap: depot[ss] - depot[mor],
      }))
      .sort((a, b) => b.gap - a.gap) // Sort by highest gap (SS - MOR)
      .find((depot) => depot.gap > 0); // Find the depot with a shortage

    setSuggestedDepot(bestDepot ? bestDepot.name : "No Suggestion");
  };
  const calculateTotals = () => {
    if (!employeeDetails) {
      return {
        ssSupervisor: 0,
        morSupervisor: 0,
        vacencySupervisor: 0,
        ssTechnician: 0,
        morTechnician: 0,
        vacencyTechnician: 0,
        ssAssistant: 0,
        morAssistant: 0,
        vacencyAssistant: 0,
        totalworkman_ss: 0,
        totalworkman_mor: 0,
      };
    }

    const totals = employeeDetails.reduce(
      (acc, depot) => ({
        ssSupervisor: Number(acc.ssSupervisor) + Number(depot.ss_supervisor),
        morSupervisor: Number(acc.morSupervisor) + Number(depot.mor_supervisor),
        vacencySupervisor:
          acc.vacencySupervisor + (depot.ss_supervisor - depot.mor_supervisor),

        ssTechnician: Number(acc.ssTechnician) + Number(depot.ss_technician),
        morTechnician: Number(acc.morTechnician) + Number(depot.mor_technician),
        vacencyTechnician:
          acc.vacencyTechnician + (depot.ss_technician - depot.mor_technician),

        ssAssistant: Number(acc.ssAssistant) + Number(depot.ss_asst),
        morAssistant: Number(acc.morAssistant) + Number(depot.mor_asst),
        vacencyAssistant:
          acc.vacencyAssistant + (depot.ss_asst - depot.mor_asst),
        totalworkman_ss: Number(acc.totalworkman_ss) + Number(depot.workman_ss),
        totalworkman_mor:
          Number(acc.totalworkman_mor) + Number(depot.workman_mor),
      }),
      {
        ssSupervisor: 0,
        morSupervisor: 0,
        vacencySupervisor: 0,
        ssTechnician: 0,
        morTechnician: 0,
        vacencyTechnician: 0,
        ssAssistant: 0,
        morAssistant: 0,
        vacencyAssistant: 0,
        totalworkman_ss: 0,
        totalworkman_mor: 0,
      }
    );

    return totals;
  };

  const totals = calculateTotals();
  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedData = [...employeeDetails].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setEmployeeDetails(sortedData);
  };
  return (
    <div>
      {/* <div className="d-flex justify-content-centre align-items-center min-vh-100 bg-light">
      <Container className="shadow-lg p-4 bg-white rounded" fluid="md"> */}

      <Container>
        <h2 className="text-center mb-4 display-6 text-primary">
          Search Staff Position
        </h2>

        <Form onSubmit={handleSubmit}>
          {/* Depot Multi-Select Dropdown with Checkboxes */}
          <div className="btn-group">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Select Depots
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  checked={selectedDepots.length === depots.length}
                  onChange={() => handleDepotChange("all")}
                />
                {depots.map((depot) => (
                  <Form.Check
                    key={depot.depo_id}
                    type="checkbox"
                    label={depot.depot_name}
                    value={depot.depo_id}
                    checked={selectedDepots.includes(depot.depo_id)}
                    onChange={() => handleDepotChange(depot.depo_id)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown style={{ marginLeft: "10px" }}>
              {" "}
              {/* Add margin-left here */}
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Select Sections
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  checked={selectedSections.length === sections.length}
                  onChange={() => handleSectionChange("all")}
                />
                {sections.map((section) => (
                  <Form.Check
                    key={section.id}
                    type="checkbox"
                    label={section.section_name}
                    value={section.section_name}
                    checked={selectedSections.includes(section.section_name)}
                    onChange={() => handleSectionChange(section.section_name)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
        {errorMessage && (
          <div className="text-center mt-3 text-danger">
            <strong>{errorMessage}</strong>
          </div>
        )}

        {employeeDetails && (
          <>
            <h4 className="text-center mt-4">
              {/* Suggested Depot for <strong>{selectedDesg}</strong>:{" "} */}
              <span className="text-success">{suggestedDepot}</span>
            </h4>

            <div
              className="mt-4 table-responsive"
              style={{ maxHeight: "100vh", overflowY: "auto" }}
            >
              <table className="table text-center table-striped table-hover">
                <thead
                  className="table-primary align-middle"
                  style={{
                    verticalAlign: "middle",
                    position: "sticky",
                    zIndex: 1,
                    top: 0,
                  }}
                >
                  <tr>
                    <th rowSpan="3" onClick={() => sortTable("depot_name")}>
                      Depot Name{" "}
                      {sortConfig.key === "depot_name"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>

                    <th rowSpan="3" onClick={() => sortTable("section")}>
                      Section{" "}
                      {sortConfig.key === "section"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th rowSpan="3" onClick={() => sortTable("depot_size")}>
                      TKM{" "}
                      {sortConfig.key === "depot_size"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>

                    <th rowSpan="3" onClick={() => sortTable("depot_size")}>
                      .22{" "}
                      {sortConfig.key === "depot_size"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th colSpan="3">Supervisor</th>
                    <th colSpan="3">Technician</th>
                    <th colSpan="3">Assistant</th>
                    <th colSpan="3">Total WorkMan</th>
                  </tr>
                  <tr>
                    <th onClick={() => sortTable("ss_supervisor")}>
                      SS{" "}
                      {sortConfig.key === "ss_supervisor"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("mor_supervisor")}>
                      MOR{" "}
                      {sortConfig.key === "mor_supervisor"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("vacency_supervisor")}>
                      Vacancy{" "}
                      {sortConfig.key === "vacency_supervisor"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("ss_technician")}>
                      SS{" "}
                      {sortConfig.key === "ss_technician"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("mor_technician")}>
                      MOR{" "}
                      {sortConfig.key === "mor_technician"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("vacency_technician")}>
                      Vacancy{" "}
                      {sortConfig.key === "vacency_technician"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("ss_asst")}>
                      SS{" "}
                      {sortConfig.key === "ss_asst"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("mor_asst")}>
                      MOR{" "}
                      {sortConfig.key === "mor_asst"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("vacency_asst")}>
                      Vacancy{" "}
                      {sortConfig.key === "vacency_asst"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("workman_ss")}>
                      SS{" "}
                      {sortConfig.key === "workman_ss"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                    <th onClick={() => sortTable("workman_mor")}>
                      MOR{" "}
                      {sortConfig.key === "workman_mor"
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {console.log("employeeDetails", employeeDetails)} */}
                  {employeeDetails.map((employee, empIndex) => (
                    <tr key={empIndex}>
                      <td>{employee.depot_name}</td>
                      <td>{employee.section}</td>
                      <td>{employee.depot_size}</td>
                      <td>{(employee.depot_size * 0.22).toFixed(2)}</td>
                      <td
                      // className={

                      //   Number(employee.ss_supervisor) >
                      //   Number(employee.mor_supervisor)
                      //     ? "text-danger fw-bold"
                      //     : ""
                      // }
                      >
                        {employee.ss_supervisor}
                      </td>
                      <td>{employee.mor_supervisor}</td>
                      <td>{employee.vacency_supervisor}</td>
                      <td
                      // className={
                      //   Number(employee.ss_technician) >
                      //   Number(employee.mor_technician)
                      //     ? "text-danger fw-bold"
                      //     : ""
                      // }
                      >
                        {employee.ss_technician}
                      </td>
                      <td>{employee.mor_technician}</td>
                      <td>{employee.vacency_technician}</td>
                      <td
                      // className={
                      //   Number(employee.ss_asst) > Number(employee.mor_asst)
                      //     ? "text-danger fw-bold"
                      //     : ""
                      // }
                      >
                        {employee.ss_asst}
                      </td>
                      <td>{employee.mor_asst}</td>
                      <td>{employee.vacency_asst}</td>
                      <td>{employee.workman_ss}</td>
                      <td>{employee.workman_mor}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-secondary fw-bold">
                  <tr>
                    <td>Total</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{totals.ssSupervisor}</td>
                    <td>{totals.morSupervisor}</td>
                    <td>{totals.vacencySupervisor}</td>
                    <td>{totals.ssTechnician}</td>
                    <td>{totals.morTechnician}</td>
                    <td>{totals.vacencyTechnician}</td>
                    <td>{totals.ssAssistant}</td>
                    <td>{totals.morAssistant}</td>
                    <td>{totals.vacencyAssistant}</td>
                    <td>{totals.totalworkman_ss}</td>
                    <td>{totals.totalworkman_mor}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default SearchStaffPosition;
