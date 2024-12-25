import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './course.css';
import { useNavigate, useLocation } from 'react-router-dom';


function Addcourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [courseData, setCourseData] = useState({
    id: '',
    course_id: '',
    title: '',
    description: '',
    instructor: '',
    start_date: '',
    end_date: '',
    duration: '',
    created_by: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = location.search;
  // To access specific parameters from the URL:

  const urlParams = new URLSearchParams(currentUrl); 

  const parameterValue = urlParams.get('token');

  useEffect(() => {
    // Compares the token in the query string (parameterValue) with the token in localStorage every second. If tokens don't match, redirects the user to the home page (/).

    const interval = setInterval(() => {
      console.log("Checking token...");
      const token = localStorage.getItem('token');
      // console.log(token:${token} && parameterValue:${parameterValue});
      if (parameterValue !== token) {
        navigate('/');
      }
    }, 1000); // Check every 1000ms (1 second)
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  },[]);

  // Safely retrieves and parses user data stored in localStorage.
  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  useEffect(() => {
    axios
      .get('http://localhost:5000/courses')
      .then((response) => {
        setCourses(response.data.courses);
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'An error occurred');
      });

    if (userRole === 'HR') {
      axios
        .get('http://localhost:5000/instructor')
        .then((response) => {
          setInstructors(response.data.instructors);
        })
        .catch((error) => {
          setError(error.response?.data?.error || 'An error occurred while fetching instructors');
        });
    }
  }, [userRole]);

  useEffect(() => {
    if (userId) {
      setCourseData((prevData) => ({
        ...prevData,
        created_by: userId,
        instructor: userRole === 'Instructor' ? userId : prevData.instructor,
      }));
    }
  }, [userId, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'start_date' || name === 'end_date') {
      const startDate = new Date(name === 'start_date' ? value : courseData.start_date);
      const endDate = new Date(name === 'end_date' ? value : courseData.end_date);
      if (startDate && endDate && endDate > startDate) {
        const duration = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
        setCourseData((prevData) => ({
          ...prevData,
          duration: duration.toString(),
        }));
      } else {
        setCourseData((prevData) => ({
          ...prevData,
          duration: '',
        }));
      }
    }
  };

  const handleAddOrEditCourse = () => {
    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode
      ? `http://localhost:5000/editCourse/${courseData.id}`
      : 'http://localhost:5000/addCourse';

    axios[method](url, courseData)
      .then((response) => {
        alert(
          `${isEditMode ? 'Course updated' : 'Course added'} successfully!\nEmail has been sent successfully`
        );
        setShowPopup(false);
        setCourseData({
          id : '',
          course_id: '',
          title: '',
          description: '',
          instructor: userRole === 'Instructor' ? userId : '',
          start_date: '',
          end_date: '',
          duration: '',
          created_by: userId,
        });
        setIsEditMode(false);
        window.location.reload()

        if (isEditMode) {
          setCourses((prevCourses) =>
            prevCourses.map((c) =>
              c.course_id === courseData.course_id ? response.data.course : c
            )
          );
        } else {
          setCourses((prevCourses) => [...prevCourses, response.data.course]);
        }
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'An error occurred');
      });
  };

  const handleEdit = (course) => {
    setCourseData({
      id: course.id,
      course_id: course.course_id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      start_date: course.start_date,
      end_date: course.end_date,
      duration: course.duration,
      created_by: course.created_by,
    });
    setIsEditMode(true);
    setShowPopup(true);
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      axios
        .delete(`http://localhost:5000/deleteCourse/${courseId}`)
        .then(() => {
          setCourses((prevCourses) =>
            prevCourses.filter((course) => course.course_id !== courseId)
          );
          alert('Course deleted successfully!');
          window.location.reload();
        })
        .catch((error) => {
          setError(error.response?.data?.error || 'An error occurred while deleting the course');
        });
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Welcome {data.user.name.toUpperCase()} !</h2>
        <ul>
          <li>Home</li>
          <li>Courses</li>
          <li>Profile</li>
          <li>Settings</li>
          <button
            onClick={() => {
              navigate('/');
            }}
          >
            Logout
          </button>
        </ul>
      </div>
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Course Management Dashboard</h1>
          <div className="upskill-line">
            <span>Upskill your knowledge!</span>
          </div>
          {(userRole === 'HR' || userRole === 'Instructor') && (
            <button className="add-course-btn" onClick={() => setShowPopup(true)}>
              Add Course
            </button>
          )}
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <span className="close" onClick={() => setShowPopup(false)}>
                &times;
              </span>
              <h2 className="popup-title">{isEditMode ? 'Edit Course' : 'Add New Course'}</h2>
              <form className="course-form">
                <input
                  type="text"
                  name="course_id"
                  placeholder="Course ID"
                  value={courseData.course_id}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isEditMode}
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="form-input"
                />
                {userRole === 'HR' && (
                  <select
                    name="instructor"
                    value={courseData.instructor}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.email})
                      </option>
                    ))}
                  </select>
                )}
                {userRole === 'Instructor' && (
                  <input
                    type="text"
                    name="instructor"
                    value={courseData.instructor}
                    disabled
                    className="form-input"
                  />
                )}
                <input
                  type="date"
                  name="start_date"
                  value={courseData.start_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="date"
                  name="end_date"
                  value={courseData.end_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="duration"
                  value={courseData.duration}
                  disabled
                  className="form-input"
                  placeholder="Duration (calculated)"
                />
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleAddOrEditCourse}
                >
                  Submit
                </button>
              </form>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        )}

        <div className="courses-container">
          <h2 className="courses-title">Courses List</h2>
          <div className="courses-list">
            {courses.length === 0 ? (
              <p>No courses available</p>
            ) : (
              courses.map((course) => (
                <div key={course.course_id} className="course-card">
                  

                  {(data.user.role == "HR" || data.user.role == "Instructor") ?
                    (<div className="icon">

                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() => handleEdit(course)}
                    ></i>
                    <i
                      className="fa-solid fa-trash"
                      onClick={() => handleDelete(course.id)}
                    ></i>
                  </div>): <div></div>

                  }
                  <h3>{course.title}</h3>

                  <p>
                    <strong>Course ID:</strong> {course.course_id}
                  </p>
                  <p>
                    <strong>Instructor:</strong> {course.instructor}
                  </p>
                  <p>
                    <strong>Description:</strong> {course.description}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {course.start_date}
                  </p>
                  <p>
                    <strong>End Date:</strong> {course.end_date}
                  </p>
                  <p>
                    <strong>Duration:</strong> {course.duration} days
                  </p>
                  <p>
                    <strong>Created By:</strong> {course.created_by.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addcourses;
