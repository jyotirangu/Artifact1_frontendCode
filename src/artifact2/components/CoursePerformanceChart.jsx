import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CoursePerformanceChart = ({ courses }) => {
  const completedCourses = courses.filter(
    (course) => course.progress_status === "Completed"
  ).length;
  const inProgressCourses = courses.filter(
    (course) => (course.progress_status === "In Progress" ||course.progress_status === "Not Started" )
  ).length;

  const data = {
    labels: ["Completed", "Active"],
    datasets: [
      {
        label: "Course Status",
        data: [completedCourses, inProgressCourses],
        backgroundColor: ["#4caf50", "#fbc02d"],
        borderColor: ["#388e3c", "#f9a825"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CoursePerformanceChart;
