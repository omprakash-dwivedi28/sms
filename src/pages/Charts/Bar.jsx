import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function Bar({ depot_id, reportType }) {
  const [chartData, setChartData] = useState([["Category", "Value"]]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "";

        if (reportType === "Employee with skill") {
          url = `https://railwaymcq.com/sms/chartData.php?depot_id=${depot_id}`;
        } else if (reportType === "Pin pointing chart") {
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
        } else if (reportType === "Pin pointing chart") {
          formattedData = [
            [
              "Desg Name",
              "Sanctioned Strength",
              "Man on Roll",
              "Vacancy",
              { role: "tooltip", type: "string" },
            ],
            ...data.map((item) => {
              const ss = parseFloat(item.ss);
              const mor = parseFloat(item.mor);
              const vacancy = ss - mor;
              return [
                item.desg_name,
                ss,
                mor,
                vacancy,
                `${item.desg_name}: SS - ${ss}, MOR - ${mor}, Vacancy - ${vacancy}`,
              ];
            }),
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
        : reportType === "Pin pointing chart"
        ? "Depot Sanctioned Strength, Man on Roll, and Vacancy"
        : "Employee Performance Distribution",
    is3D: true,
    bars: "horizontal",
    pieSliceText: "percentage",
    series: {
      0: { label: "Sanctioned Strength" },
      1: { label: "Man on Roll" },
      2: { label: "Vacancy" },
    },
    hAxis: {
      minValue: 0,
    },
  };

  return (
    <div>
      {depot_id && reportType ? (
        <Chart
          chartType="BarChart" // Using BarChart to show multiple series data
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

export default Bar;
