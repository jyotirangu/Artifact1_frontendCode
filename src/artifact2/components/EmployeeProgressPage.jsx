import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import Navbar from "./Navbar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const EmployeeProgressPage = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract `userId` and `courseId` from query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId");
  const courseId = queryParams.get("courseId");

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/employee-course-progress/${userId}/${courseId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch progress data");
        }
        const data = await response.json();
        console.log(data)
        setProgressData(data.progress || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [userId, courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalModules = progressData.length;
  const completedModules = progressData.filter(p => p.completion_status === "Passed").length;
  const overallCompletionPercentage = Math.round((completedModules / totalModules) * 100) || 0;

  const pieChartData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          progressData.filter(p => p.completion_status === "Passed").length,
          progressData.filter(p => p.completion_status === "In Progress").length,
          progressData.filter(p => p.completion_status === "Not Started").length,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        hoverOffset: 4,
      },
    ],
  };

  const lineChartData = {
    labels: progressData.map(p => p.module_title),
    datasets: [
      {
        label: "Scores Over Modules",
        data: progressData.map(p => p.score || 0),
        fill: false,
        borderColor: "#3e95cd",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="progress-page-contentEPP">
      <Navbar />
      <button className="back-buttonEPP" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <div className="progress-boxEPP">
        <div className="overall-progressEPP">
          <h3>Overall Completion: {overallCompletionPercentage}%</h3>
        </div>
        <div className="chart-rowEPP">
          <div className="chart-section pie-chartEPP">
            <h2>Progress Overview</h2>
            <Pie data={pieChartData} />
          </div>
          <div className="chart-section line-chartEPP">
            <h2>Progress Over Modules</h2>
            <Line data={lineChartData} />
          </div>
        </div>
        <div className="employee-progress-tableEPP">
          <h2>Employee Detail Progress</h2>
          <table>
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Completion Status</th>
                <th>Score (%)</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((module, index) => (
                <tr key={index}>
                  <td>{module.module_title}</td>
                  <td>{module.completion_status}</td>
                  <td>{module.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProgressPage;
