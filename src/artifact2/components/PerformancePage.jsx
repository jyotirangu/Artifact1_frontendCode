import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import './PerformancePage.css';

const PerformancePage = () => {
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [trends, setTrends] = useState({ completionRates: [], topPerformers: [] });

  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/hr/performance`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.detailed_performance) {
          const uniqueData = removeDuplicates(data.detailed_performance);
          setPerformanceData(uniqueData);
          console.log(uniqueData)
          setFilteredData(uniqueData);
          calculateTrends(data);
        } else {
          console.error('Unexpected data format:', data);
          setPerformanceData([]);
          setFilteredData([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching performance data:', err);
        setPerformanceData([]);
        setFilteredData([]);
      });
  }, []);

  const removeDuplicates = (data) => {
    const uniqueMap = new Map();

    data.forEach((item) => {
      const key = `${item.user_id}-${JSON.stringify(item.courses)}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values());
  };

  const calculateTrends = (data) => {
    const completionRates = data.detailed_performance.flatMap((item) =>
      item.courses.map((course) => ({
        courseTitle: course.course_title,
        completionPercentage: course.completion_percentage || 0,
      }))
    );

    const topPerformers = data.top_performers || [];

    setTrends({ completionRates, topPerformers });
  };

  const handleSearch = () => {
  const query = searchQuery.toLowerCase(); 
  const filtered = performanceData.filter((item) => {
    console.log(item.courses);
  
    // Ensure the query is in lowercase
    const lowerQuery = query.toLowerCase();
  
    // Check if the user's name matches
    const matchesUser = item.user_name.toLowerCase().includes(lowerQuery);
  
    // Check if any course title matches
    const matchesCourse = item.courses.some((course) => {
      const courseTitle = course.course_title.toLowerCase(); // Normalize course title
      console.log(courseTitle);
      return courseTitle.includes(lowerQuery);  // Return true if match
    });
  
    // Check if the start date matches the query
    const matchesDate = item.courses.some((course) => {
      const courseDate = new Date(course.Start_date);
      const queryDate = new Date(query);
  
      return !isNaN(queryDate) && courseDate.toDateString() === queryDate.toDateString();
    });
  
    console.log(matchesCourse);
  
    return matchesUser || matchesCourse || matchesDate;
  });

  setFilteredData(filtered);
 };



  const handleRowClick = (user) => {
    navigate('/IndividualPerformance', { state: { user } });
  };

  return (
    <div className="performance-pageXY">
      <h1>Performance Dashboard</h1>

      {/* Search Bar */}
      {userRole === 'Manager' ? (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Course Name, Date (YYYY-MM-DD), or Employee Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      ) : (
        <span></span>
      )}

      {userRole === 'HR' ? (
        <div className="trendsXY">
          <h2>Trends and Insights</h2>
          <div className="trend-chartsXY">
            <div className="chart-containerXY">
              <h3>Course Completion Rates</h3>
              <Bar
                data={{
                  labels: [...new Set(trends.completionRates.map((item) => item.courseTitle))],
                  datasets: [
                    {
                      label: 'Avg Completion Percentage',
                      data: trends.completionRates.reduce((acc, curr) => {
                        acc[curr.courseTitle] = acc[curr.courseTitle]
                          ? (acc[curr.courseTitle] + curr.completionPercentage) / 2
                          : curr.completionPercentage;
                        return acc;
                      }, {}),
                      backgroundColor: 'blue',
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="chart-containerXY">
              <h3>Top Performers</h3>
              <Bar
                data={{
                  labels: trends.topPerformers.map((item) => item.user_name),
                  datasets: [
                    {
                      label: 'Total Score',
                      data: trends.topPerformers.map((item) => item.total_score),
                      backgroundColor: 'green',
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {/* Performance Table */}
      <div className="performance-tableXY">
        <h2>Employee Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>User ID</th>
              <th>Course Name</th>
              <th>Completion Status</th>
              <th>Completion Percentage</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            
            {filteredData.map((user) =>
              user.courses.map((course, index) => (
                <tr
                  key={`${user.user_id}-${course.course_id}-${index}`}
                  className="clickable-rowXY"
                  onClick={() => handleRowClick(user)}
                >
                  <td>{user.user_name}</td>
                  <td>{user.user_id}</td>
                  <td>{course.course_title}</td>
                  <td>{course.status}</td>
                  <td>{course.completion_percentage}%</td>
                  <td>{course.Start_date
                  }</td>
                  <td>{course.End_date
                  }</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformancePage;
