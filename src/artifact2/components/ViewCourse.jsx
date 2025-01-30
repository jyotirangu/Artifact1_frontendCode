import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './Navbar';
import './ViewCourse.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ViewCourseData = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [error, setError] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.search;

  const urlParams = new URLSearchParams(currentUrl);
  const courseId = urlParams.get('id');

  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  const handleBackButtonClick = () => {
    navigate(`/courses?id=${courseId}`); 
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/viewCourse/${userId}/${courseId}`);
        setCourseDetails(response.data.course_details);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      }
    };

    const fetchEnrollmentData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/course/${courseId}/enrollments`);
        setEnrollmentData(response.data.enrolled_users);
      } catch (err) {
        console.error("Error fetching enrollment data:", err);
      }
    };

    fetchCourseDetails();
    fetchEnrollmentData();
  }, [courseId, userId]);

  const markAsCompleted = async () => {
    navigate(`/CourseModulesPage?id=${courseId}`);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!courseDetails) {
    return <div>Loading...</div>;
  }

  const {
    title,
    description,
    instructor,
    start_date,
    end_date,
    duration,
    created_by,
    status,
    is_completed
  } = courseDetails;

  return (
    <>
      <Navbar />
      <button className="back-buttonVC" onClick={handleBackButtonClick}>
        <i className="fa fa-arrow-left"></i> Back
      </button>
      <div className='ViewCourseTitle'>
        <h1>{title}</h1>
      </div>

      <div className="course-detailsD">
        <div>
          <h2>Course Details</h2>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Instructor:</strong> {instructor}</p>
          <p><strong>Start Date:</strong> {new Date(start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(end_date).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> {duration} days</p>
        </div>
        <div>
          <h2>Created By</h2>
          <p><strong>Name:</strong> {created_by.name}</p>
          <p><strong>Email:</strong> {created_by.email}</p>
        </div>
        <div>
          <h2>Enrollment Status</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Completed:</strong> {is_completed ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="completion-section">
        <button
          onClick={markAsCompleted}
          disabled={!(status === "Enrolled" || userRole === "HR" || userRole === "Instructor" || userRole === "Manager")}
        >
          {is_completed ? "View Modules" : "Go to Course Modules"}
        </button>
        {completionMessage && <p className="completion-messageVC">{completionMessage}</p>}
      </div>

      <div className="employee-enrollment-section">
        <h2>Employee Enrollment Details</h2>
        {enrollmentData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                {(userRole === 'HR' || userRole === 'Manager') && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {enrollmentData.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  {(userRole === 'HR' || userRole === 'Manager') && (
                    <td>
                      <button onClick={() => navigate(`/employee-progress?userId=${user.id}&courseId=${courseId}`)}>
                        View Progress
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No employees are enrolled in this course.</p>
        )}
      </div>
    </>
  );
};

export default ViewCourseData;
