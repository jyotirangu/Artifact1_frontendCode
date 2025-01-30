import React, { useState, useEffect } from "react";
import axios from "axios";
import CoursePerformanceChart from "./CoursePerformanceChart";
import  "./ProfilePages.css"
import Navbar from './Navbar';

const ProfilePages = () => {
  const [profile, setProfile] = useState(null);
  const data = JSON.parse(localStorage.getItem("user"));
  const userId = data.user.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/profile/${userId}`
        );
        console.log(response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <div className="loadingPP">Loading...</div>;
  }

  return (
    <div className="profileContainerPP">
      <Navbar />
      <div className="headerSectionPP">
        <h1 className="welcomeMessagePP">
          Welcome Back <br></br> {profile.user_details.name}!
        </h1>
        <p className="userRolePP">Role: {profile.user_details.role}</p>
      </div>

      <div className="profileDetailsPP">
        <div className="cardPP">
          <h2 className="cardTitlePP">Profile Details</h2>
          <p>
            <strong>Name:</strong> {profile.user_details.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.user_details.email}
          </p>
          {/* <p>
            <strong>Verified:</strong>{" "}
            {profile.user_details.isVerified === "True" ? "Yes" : "No"}
          </p> */}
        </div>

        <div className="cardPP">
          <h2 className="cardTitlePP">Course Performance</h2>
          {profile.course_performance.length > 0 ? (
            <>
              <table className="courseTablePP">
                <thead>
                  <tr>
                    <th className="courseHeaderPP">Course Title</th>
                    <th className="courseHeaderPP">Instructor</th>
                    <th className="courseHeaderPP">Status</th>
                    <th className="courseHeaderPP">Completion</th>
                    <th className="courseHeaderPP">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.course_performance.map((course, index) => (
                    <tr key={index} className="courseRowPP">
                      <td>{course.title}</td>
                      <td>{course.instructor}</td>
                      <td>{course.status}</td>
                      
                      <td>
                        {course.progress_status === "Completed"
                          ? "Completed"
                          : "Active"}
                      </td>
                      <td>{course.completion_percentage
                      }%</td>
                    </tr>

                  ))}
                </tbody>
              </table>
              <CoursePerformanceChart courses={profile.course_performance} />
            </>
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </div>

      {/* <footer className="footerPP">
        <p>&copy; 2025 Your Company | All Rights Reserved</p>
      </footer> */}
    </div>
  );
};

export default ProfilePages;


