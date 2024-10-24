import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

function Scatter({ depot_id, reportType }) {
  const [chartData, setChartData] = useState([
    ["Employee Name", "Skill Rating"],
  ]);

  // Fetch data from PHP API based on depot_id and reportType
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`
        );
        const data = await response.json();

        // Map the data into a format suitable for Google Scatter chart
        const formattedData = [
          ["Employee Name", "Skill Rating"],
          ...data.map((item) => [
            `${item.employee_name} (${item.sub_skill})`,
            parseInt(item.rating, 10), // Parse rating as an integer
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
    legend: { position: "bottom" },
    animation: {
      duration: 1000,
      easing: "out",
    },
    vAxis: {
      viewWindow: {
        max: 10,
        min: 0,
      },
      title: "Rating",
    },
    hAxis: {
      title: "Employee",
    },
  };

  return (
    <div>
      {console.log(depot_id)}
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
