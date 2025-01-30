import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './IndividualPerformance.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const IndividualPerformance = () => {
    const location = useLocation();
    const user = location.state?.user || {};
    const userId = user.user_id;

    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            if (!userId) {
                setError("Invalid User ID");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/individual-performance/${userId}`);
                console.log(response.data);
                setPerformanceData(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching performance data");
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, [userId]);

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    // Pie Chart Data for Course Progress
    const courseChartData = {
        labels: ['Active Courses', 'Completed Courses'],
        datasets: [
            {
                data: [performanceData?.active_courses || 0, performanceData?.completed_courses || 0],
                backgroundColor: ['#36A2EB', '#4CAF50'],
                hoverBackgroundColor: ['#1E88E5', '#2E7D32'],
            },
        ],
    };

    // Pie Chart Data for Quiz Performance
    const quizLabels = performanceData?.quiz_scores?.map(quiz => `Module ${quiz.module_id}`) || [];
    const quizScores = performanceData?.quiz_scores?.map(quiz => quiz.score) || [];

    const quizChartData = {
        labels: quizLabels,
        datasets: [
            {
                data: quizScores,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800', '#9C27B0', '#03A9F4'],
                hoverBackgroundColor: ['#FF4365', '#2B82D4', '#E5B800', '#6FAF32', '#D57C00', '#7B1FA2', '#0288D1'],
            },
        ],
    };

    return (
        <div className="performance-container">
            <h1 className="performance-title">Individual Performance Metrics</h1>

            <div className='per_contai'>
            <div className="chart-container">
                <h2>📌 Course Progress</h2>
                <Pie data={courseChartData} />
            </div>

            <div className="chart-container">
                <h2>📊 Quiz Performance per Module</h2>
                <Pie data={quizChartData} />
            </div>

            </div>
            
        </div>
    );
};

export default IndividualPerformance;
