import React, { useState } from "react";
import Scatter from "./Charts/Scatter";
import Bar from "./Charts/Bar";
import Pie from "./Charts/pie";

import Card from "react-bootstrap/Card";
import { useGlobalContext } from "../context/GlobalContext";

function Analytics() {
  const [chartType, setChartType] = useState("Scatter");
  const [reportType, setReportType] = useState("Employee with skill");
  const { depots } = useGlobalContext();
  const [selectedDepot, setSelectedDepot] = useState("");

  const chartOptions = ["Scatter", "Bar", "Pie"];

  const reportOptions = ["Employee with skill", "Pin pointing chart", "Other"];

  const handleDepotChange = (e) => {
    setSelectedDepot(e.target.value);
  };

  const renderChart = () => {
    switch (chartType) {
      case "Scatter":
        return <Scatter reportType={reportType} depot_id={selectedDepot} />;
      case "Bar":
        return <Bar reportType={reportType} depot_id={selectedDepot} />;
      case "Pie":
        return <Pie reportType={reportType} depot_id={selectedDepot} />;
      default:
        return <Scatter reportType={reportType} depot_id={selectedDepot} />;
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

export default Analytics;
