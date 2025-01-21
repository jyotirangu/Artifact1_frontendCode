import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './Navbar';
import './ViewCourse.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ViewCourseData = () => {
  const [courseDetails, setCourseDetails] = useState(null);
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
    navigate(`/courses?id=${courseId}`); // Pass courseId back as query param
  };

  const { employeeId } = useParams();  // Ensure employeeId is being correctly extracted

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/viewCourse/${userId}/${courseId}`);
        setCourseDetails(response.data.course_details);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      }
    };

    fetchCourseDetails();
  }, [courseId, userId]);

  const markAsCompleted = async () => {
    try {
      // If the user is HR, Instructor, or Manager, allow access to modules without enrollment
      if (userRole === "HR" || userRole === "Instructor" || userRole === "Manager") {
        navigate(`/CourseModulesPage?id=${courseId}`);
      } else if (courseDetails.enrollment_status.status === "Enrolled") {
        navigate(`/CourseModulesPage?id=${courseId}`);
      } else {
        setCompletionMessage("Failed to access modules! First enroll in the course.");
      }
    } catch (err) {
      setCompletionMessage("An error occurred while navigating to the course modules page.");
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
    employee_enrollments,
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

      {/* Navigate to Modules Button */}
      <div className="completion-section">
        <button
          onClick={markAsCompleted}
          disabled={!(courseDetails.enrollment_status.status === "Enrolled" || userRole === "HR" || userRole === "Instructor" || userRole === "Manager")}
        >
          {(enrollment_status.is_completed) ? "View Modules" : "Go to Course Modules"}
        </button>
        {completionMessage && <p className="completion-messageVC">{completionMessage}</p>}
      </div>

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
                {/* <th>Completed</th> */}
                {(userRole === 'HR' || userRole === 'Instructor') && <th>Performance</th>}
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
                  {/* <td>{employee.is_completed ? "Yes" : "No"}</td> */}
                  {(userRole === 'HR' || userRole === 'Instructor') && (
                    <td>
                      <button onClick={() => navigate(`/employee-progress?userId=${employee.user_id}&courseId=${courseId}`)}>
                        Progress
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

