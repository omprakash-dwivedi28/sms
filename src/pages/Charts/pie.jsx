import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function Pie({ depot_id, reportType }) {
  const [chartData, setChartData] = useState([["Category", "Value"]]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";

        if (reportType === "Employee with skill") {
          url = `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`;
        } else if (reportType === "Depot. with SS") {
          url = `https://railwaymcq.com/sms/chartData1.php?depot_id=${depot_id}`;
        } else if (reportType === "performance") {
          url = `https://railwaymcq.com/sms/performanceData.php?depot_id=${depot_id}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        let formattedData;

        if (reportType === "Employee with skill") {
          formattedData = [
            [
              "Employee Name",
              "Skill Rating",
              { role: "tooltip", type: "string" },
            ],
            ...data.map((item) => [
              item.employee_name,
              parseFloat(item.rating),
              `${item.employee_name}: ${item.rating}`,
            ]),
          ];
        } else if (reportType === "Depot. with SS") {
          formattedData = [
            [
              "Desg Name",
              "Sanctioned Strength (%)",
              "Sanctioned Strength (%)",
              { role: "tooltip", type: "string" },
            ],
            ...data.map((item) => [
              item.desg_name,
              parseFloat(item.ss),
              parseFloat(item.ss),
              `${item.desg_name}: ${item.ss} nos`,
            ]),
          ];
        } else if (reportType === "performance") {
          formattedData = [
            [
              "Employee Name",
              "Performance Score",
              { role: "tooltip", type: "string" },
            ],
            ...data.map((item) => [
              item.employee_name,
              parseFloat(item.performance_score),
              `${item.employee_name}: ${item.performance_score}`,
            ]),
          ];
        }

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (depot_id && reportType) {
      fetchData();
    }
  }, [depot_id, reportType]);

  const options = {
    title:
      reportType === "Employee with skill"
        ? "Employee Skill Rating Distribution"
        : reportType === "Depot. with SS"
        ? "Employee Desg. with SS"
        : "Employee Performance Distribution",
    is3D: true,
    pieSliceText: "percentage",
  };

  return (
    <div>
      {depot_id && reportType ? (
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width="100%"
          height="400px"
        />
      ) : (
        <p>Please select a depot and report type to see the data.</p>
      )}
    </div>
  );
}

export default Pie;
