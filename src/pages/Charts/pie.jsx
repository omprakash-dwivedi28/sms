import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function Pie({ depot_id, reportType }) {
  const [chartData, setChartData] = useState([
    ["Employee Name", "Skill Rating"],
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`
        );
        const data = await response.json();

        // Map the data into a format suitable for Google Pie Chart with tooltips
        const formattedData = [
          [
            "Employee Name",
            "Skill Rating",
            { role: "tooltip", type: "string" },
          ],
          ...data.map((item) => [
            item.employee_name, // Employee name
            parseFloat(item.rating), // Skill rating
            `${item.employee_name}: ${item.rating}`, // Tooltip
          ]),
        ];

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (depot_id && reportType) {
      fetchData(); // Fetch data only when depot_id and reportType are available
    }
  }, [depot_id, reportType]);

  const options = {
    title: "Employee Skill Rating Distribution",
    is3D: true,
    pieSliceText: "percentage",
  };

  return (
    <div>
      <div>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width="100%" // Adjust width
          height="400px" // Adjust height
        />
      </div>
    </div>
  );
}

export default Pie;
