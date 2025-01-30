import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './course.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

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
    detailed_description: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('AllCourses'); // Default filter is AllCourses

  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = location.search;

  const urlParams = new URLSearchParams(currentUrl);
  const parameterValue = urlParams.get('token');

  const data = JSON.parse(localStorage.getItem('user'));
  const userId = data.user.id;
  const userRole = data.user.role;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/${userId}`)
      .then((response) => {
        console.log(response.data.courses)
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
  }, [userRole, userId]);

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

    axios[method](url, isEditMode ? { courseData, userId } : courseData)
      .then((response) => {
        alert(`${isEditMode ? 'Course updated' : 'Course added'} successfully!`);
        setShowPopup(false);
        setCourseData({
          id: '',
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
        window.location.reload();

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

  const handleEnroll = (courseId) => {
    axios
      .post('http://localhost:5000/enroll', {
        user_id: userId,
        course_id: courseId,
      })
      .then((response) => {
        if (response.status === 201) {
          alert('You have successfully enrolled in the course!');
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Enrollment failed:', error);
        alert(error.response?.data?.error || 'There was an error enrolling in the course.');
      });
  };

  const filteredCourses = courses.filter((course) => {
    // console.log(course)
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'AllCourses' ||
      (filter === 'EnrolledCourses' && course.is_enrolled) ||
      (filter === 'CompletedCourses' && course.status === "Completed");
    

    return matchesSearch && matchesFilter;

  });


  return (
    <div className="dashboard">
      <Navbar />
      <div>
        <div className="main-content">
          <div className="dashboard-headerC">
            <h1 className="dashboard-titleC">Course Management Dashboard</h1>
            <div className="upskill-line">
              <span>Upskill your knowledge!</span>
            </div>
          </div>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by Course Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {userRole === "Employee" && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="AllCourses">All Courses</option>
                <option value="EnrolledCourses">Enrolled Courses</option>
                <option value="CompletedCourses">Completed Courses</option>
              </select>
            )}
          </div>

          <div className="right_content_div">
            <div className="courses-container">
              <h2 className="courses-title">Courses List
                {(userRole === 'HR' || userRole === 'Instructor') && (
                  <Link to="/AddCoursePage">
                    <button className="add-course-btn">Add Course</button>
                  </Link>
                )}
              </h2>

              <div className="courses-list">
                {filteredCourses.length === 0 ? (
                  <p>No courses available</p>
                ) : (
                  filteredCourses.map((course) => (
                    <div key={course.course_id} className="course-card">
                      {(data.user.role === 'HR' || data.user.role === 'Instructor') && (
                        <div className="icon">
                          <i
                            className="fa-regular fa-pen-to-square"
                            onClick={() => handleEdit(course)}
                          ></i>
                        </div>
                      )}
                      <h3>{course.title}</h3>
                      <p><strong>Course ID:</strong> {course.course_id}</p>
                      {/* <p><strong>Instructor:</strong> {course.instructor}</p> */}
                      <p><strong>Duration:</strong> {course.duration} days</p>
                      <p><strong>Created Date:</strong> {new Date(course.created_at).toLocaleDateString()}</p>
                      <p><strong> Enrollment Status :</strong>  {(course.is_enrolled==true?"Enrolled":"Not Enrolled") }</p>
                      {/* {(data.user.role === 'Employee') && (<p><strong>Enrollment status :</strong> {course.enrollment_status}</p>)} */}
                      <div>
                        <button className="view-course-btn" onClick={() => {
                          navigate(`/ViewCourse?id=${course.id}`)
                        }}>View Course</button>
                      </div>

                      {userRole === 'Employee' && (
                        <button
                          className="enroll-btn"
                          onClick={() => handleEnroll(course.id)}
                          disabled={course.is_enrolled}
                        >
                          {(course.is_enrolled ? 'Enrolled' : 'Enroll')}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addcourses;
