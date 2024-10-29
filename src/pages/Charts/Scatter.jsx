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
        let response, data;

        if (reportType === "Employee with skill") {
          response = await fetch(
            `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`
          );
          data = await response.json();

          // Format data for "Employee with skill"
          setChartData([
            ["Employee Name", "Skill Rating"],
            ...data.map((item) => [
              `${item.employee_name} (${item.sub_skill})`,
              parseInt(item.rating, 10),
            ]),
          ]);

          setOptions({
            title: "Employee Skills vs Ratings",
            legend: { position: "right" },
            vAxis: { title: "Rating", viewWindow: { max: 10, min: 0 } },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          });
        } else if (reportType === "Depot. with SS") {
          const response = await fetch(
            `https://railwaymcq.com/sms/chartData1.php?depot_id=${depot_id}`
          );
          const data = await response.json();

          // Format data for MOR and Vacancy in Scatter chart
          // setChartData([
          //   ["Designation", "Count", { role: "style" }],
          //   ...data.flatMap((item) => [
          //     // SS point
          //     [
          //       "",
          //       parseInt(item.ss, 10),
          //       "point { size: 7; shape-type: square; fill-color: #0F9D58; }",
          //     ],
          //     // MOR point
          //     [
          //       item.desg_name,
          //       parseInt(item.mor, 10),
          //       "point { size: 7; shape-type: circle; fill-color: #4285F4; }",
          //     ],
          //     // Vacancy point
          //     [
          //       "",
          //       parseInt(item.ss, 10) - parseInt(item.mor, 10),
          //       "point { size: 7; shape-type: triangle; fill-color: #DB4437; }",
          //     ],
          //   ]),
          // ]);

          // Prepare the data for the chart
          const chartData = [["Designation", "SS", "MOR", "Vacancy"]];
          data.forEach((item) => {
            const ss = parseInt(item.ss, 10);
            const mor = parseInt(item.mor, 10);
            const vacancy = ss - mor;

            chartData.push([
              item.desg_name,
              ss, // Sanctioned Strength
              mor, // Man on Roll
              vacancy, // Vacancy
            ]);
          });

          setChartData(chartData);
          // setOptions({
          //   title: "Designation-wise SS, MOR, and Vacancy",
          //   legend: { position: "right", alignment: "center" },
          //   hAxis: { title: "Designation" },
          //   vAxis: { title: "Count", viewWindow: { min: 0 } },
          //   animation: { duration: 1000, easing: "out" },
          //   series: [
          //     {
          //       labelInLegend: "Sanctioned Strength (SS)",
          //       color: "#0F9D58",
          //       pointShape: { type: "square" },
          //       // Additional properties can be added here
          //     },
          //     {
          //       labelInLegend: "Man on Roll (MOR)",
          //       color: "#4285F4",
          //       pointShape: { type: "circle" },
          //       // Additional properties can be added here
          //     },
          //     {
          //       labelInLegend: "Vacancy",
          //       color: "#DB4437",
          //       pointShape: { type: "triangle" },
          //       // Additional properties can be added here
          //     },
          //   ],
          //   tooltip: { isHtml: true },
          // });
        } else if (reportType === "qualifications") {
          response = await fetch(
            `https://railwaymcq.com/sms/chartData2.php?depot_id=${depot_id}`
          );
          data = await response.json();

          // Format data for "Qualifications"
          setChartData([
            ["Employee Name", "Qualification Level"],
            ...data.map((item) => [
              item.employee_name,
              parseInt(item.qualification_level, 10),
            ]),
          ]);

          setOptions({
            title: "Employee Qualification Levels",
            legend: { position: "bottom" },
            vAxis: {
              title: "Qualification Level",
              viewWindow: { max: 5, min: 0 },
            },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          });
        }
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
