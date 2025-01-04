import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './Navbar';
import './ViewCourse.css';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewCourseData = () => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [error, setError] = useState("");
  const [completionMessage, setCompletionMessage] = useState(""); // For marking completion

  const location = useLocation();
  const currentUrl = location.search;

  const urlParams = new URLSearchParams(currentUrl);
  const courseId = urlParams.get('id');

  // const data = JSON.parse(localStorage.getItem('user'));
  // const userId = data.user.id;

  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  useEffect(() => {
    // Fetch course details from the API
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/viewCourse/${userId}/${courseId}`);
        // console.log(response.data.course_details);
        
        // console.log(response.data.course_details.enrollment_status.is_completed);
        setCourseDetails(response.data.course_details);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const markAsCompleted = async () => {
    try {
      await axios.put(`http://localhost:5000/markCompleted/${userId}/${courseId}`);
      setCompletionMessage("Course marked as completed successfully!");

      window.location.reload();
    } catch (err) {
      setCompletionMessage("Failed to mark the course as completed! First Enrol the Course");
    }
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
    enrollment_status,
    user_details,
    employee_enrollments, // Added employee details
  } = courseDetails;

  console.log(courseDetails.enrollment_status.is_completed);

  return (
    <>
      <Navbar />
      <h1>{title}</h1>
    
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
              <p><strong>Status:</strong> {enrollment_status.status}</p>
              <p><strong>Enrolled Date:</strong> {enrollment_status.enrolled_date
                ? new Date(enrollment_status.enrolled_date).toLocaleDateString()
                : "N/A"}</p>
              <p><strong>Completed:</strong> {enrollment_status.is_completed ? "Yes" : "No"}</p>
            </div>
            <div>
              <h2>User Details</h2>
              <p><strong>Name:</strong> {user_details.name}</p>
              <p><strong>Email:</strong> {user_details.email}</p>
              <p><strong>Role:</strong> {user_details.role}</p>
            </div>
            </div>
            {/* Mark as Completed Button */}
          {(userRole === 'Employee')?(<div className="completion-section">
            <button onClick={markAsCompleted}>
              {(courseDetails.enrollment_status.is_completed)?"Completed":"Mark as Completed"}
              </button>
            {completionMessage && <p className="completion-messageVC">{completionMessage}</p>}
          </div>):<div></div>}



      

      {/* Employee Enrollment Table */}
      <div className="employee-enrollment-section">
        <h2>Employee Enrollment Details</h2>
        {employee_enrollments && employee_enrollments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Enrolled Date</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {employee_enrollments.map((employee) => (
                <tr key={employee.user_id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.status}</td>
                  <td>
                    {employee.enrolled_date
                      ? new Date(employee.enrolled_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{employee.is_completed ? "Yes" : "No"}</td>
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

