import Chart from "react-google-charts";
import React, { useEffect, useState } from "react";

function Bar({ depot_id, reportType }) {
  console.log("Depot ID:", depot_id); // Check if depot_id is received
  console.log("Report Type:", reportType); // Check if reportType is received
  const [chartData, setChartData] = useState([
    ["Employee Name", "Skill Rating", { role: "tooltip", type: "string" }],
  ]);

  // Fetch data from PHP API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`
        );
        const data = await response.json();

        // Map the data into a format suitable for Google Bar chart with tooltips
        const formattedData = [
          [
            "Employee Name",
            "Skill Rating",
            { role: "tooltip", type: "string" },
          ],
          ...data.map((item) => [
            item.employee_name, // Employee name
            parseFloat(item.rating), // Skill rating (ensure it's a float)
            `${item.employee_name}: ${item.rating}`, // Tooltip with employee name and rating
          ]),
        ];

        setChartData(formattedData); // Update chart data with the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (depot_id && reportType) {
      fetchData(); // Fetch data only when depot_id and reportType are available
    }
  }, [depot_id, reportType]);

  const options = {
    title: "Employee Skills vs Ratings",
    legend: { position: "none" }, // Hide legend
    tooltip: { isHtml: true },
    animation: {
      duration: 1000,
      easing: "out",
    },
    hAxis: {
      title: "Skill Rating",
      minValue: 0,
      maxValue: 10,
    },
    vAxis: {
      title: "Employee Name",
    },
    bars: "horizontal", // Horizontal bars
    height: 400,
  };

  return (
    <div>
      {console.log(depot_id)}
      {depot_id && reportType ? (
        <Chart
          chartType="BarChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      ) : (
        <p>Please select a depot and report type to see the data.</p>
      )}
    </div>
  );
}

export default Bar;
