import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

function EmpScatter({ emp_id, reportType }) {
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
            `https://railwaymcq.com/sms/empwiseChartData.php?emp_id=${emp_id}`
          );
          data = await response.json();
          console.log("Data", data);

          // Format data for "Employee with skill"
          setChartData([
            ["Skill Name", "Skill Rating"],
            ...data.map((item) => [
              `${item.skill} (${item.skill_rating})`,
              parseInt(item.skill_rating, 10),
            ]),
          ]);

          setOptions({
            title: "Employee Skills vs Ratings",
            legend: { position: "right" },
            vAxis: { title: "Rating", viewWindow: { max: 10, min: 0 } },
            hAxis: { title: "Employee" },
            animation: { duration: 1000, easing: "out" },
          });
        } else if (reportType === "Pin pointing chart") {
          const response = await fetch(
            `https://railwaymcq.com/sms/chartData1.php?emp_id=${emp_id}`
          );
          const data = await response.json();

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
        } else if (reportType === "qualifications") {
          response = await fetch(
            `https://railwaymcq.com/sms/chartData2.php?emp_id=${emp_id}`
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

    if (emp_id && reportType) {
      fetchData();
    }
  }, [emp_id, reportType]);

  return (
    <div>
      {emp_id && reportType ? (
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

export default EmpScatter;
