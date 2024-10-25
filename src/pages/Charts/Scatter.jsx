import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

function Scatter({ depot_id, reportType }) {
  const [chartData, setChartData] = useState([
    ["Employee Name", "Skill Rating"],
  ]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`
        );
        const data = await response.json();

        // Format data based on reportType
        let formattedData;
        let chartOptions;

        if (reportType === "Employee with skill") {
          formattedData = [
            ["Employee Name", "Skill Rating"],
            ...data.map((item) => [
              `${item.employee_name} (${item.sub_skill})`,
              parseInt(item.rating, 10),
            ]),
          ];
          chartOptions = {
            title: "Employee Skills vs Ratings",
            legend: { position: "bottom" },
            vAxis: { title: "Rating", viewWindow: { max: 10, min: 0 } },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          };
        } else if (reportType === "experience") {
          formattedData = [
            ["Employee Name", "Experience (Years)"],
            ...data.map((item) => [
              item.employee_name,
              parseInt(item.experience, 10),
            ]),
          ];
          chartOptions = {
            title: "Employee Experience",
            legend: { position: "bottom" },
            vAxis: {
              title: "Experience (Years)",
              viewWindow: { max: 40, min: 0 },
            },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          };
        } else if (reportType === "qualifications") {
          formattedData = [
            ["Employee Name", "Qualification Level"],
            ...data.map((item) => [
              item.employee_name,
              parseInt(item.qualification_level, 10),
            ]),
          ];
          chartOptions = {
            title: "Employee Qualification Levels",
            legend: { position: "bottom" },
            vAxis: {
              title: "Qualification Level",
              viewWindow: { max: 5, min: 0 },
            },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          };
        }

        setChartData(formattedData);
        setOptions(chartOptions);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (depot_id && reportType) {
      fetchData();
    }
  }, [depot_id, reportType]);

  return (
    <div>
      {depot_id && reportType ? (
        <Chart
          chartType="ScatterChart"
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

export default Scatter;
