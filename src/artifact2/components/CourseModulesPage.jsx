import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseModulesPage.css";
import Navbar from "./Navbar";

const CourseModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// const[correctedans,setCorrected]=useState();
// const[incorrected,setInCorrected]=useState();
// const[score,setScore]=useState();

  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  const data = JSON.parse(localStorage.getItem("user"));
  const userId = data ? data.user.id : null;

  const handleBackButtonClick = () => {
    navigate(`/ViewCourse?id=${courseId}`); // Pass courseId back as query param
  };

  useEffect(() => {
    const fetchModules = async () => {
      if (!userId || !courseId) {
        setError("User ID or Course ID missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/course-progress?user_id=${userId}&course_id=${courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course progress");
        }
        const data = await response.json();
        console.log(data.modules)
        
        // setCorrected(data.modules)
        // console.log(data.modules[0].progress.completion_status
        // )
        setModules(data.modules); // Modules with progress data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchModules();
  }, [userId, courseId]);

  const renderProgressBar = (completion_status,score) => {
    let progressWidth = "0%";
    // console.log(score)
    if (completion_status === "In Progress") progressWidth = "50%";
    else if (completion_status === "Passed") progressWidth = "100%";
    // else progressWidth = `${score*4}%`;
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: progressWidth }}></div>
      </div>
    );
  };

  const handleModuleClick = (moduleId,corrected,incorrected,score,completion_status,skipped) => {
    navigate(`/DetailedModulePage?moduleId=${moduleId}`, {
      state: { userId, courseId,corrected ,incorrected,score,completion_status,skipped}
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const overallProgress = modules.length
    ? (modules.filter((module) => module.progress?.completion_status === "Passed").length / 
        modules.length) * 
      100
    : 0;

  return (
    <div className="course-modules-container">
      <Navbar />
      <button className="back-buttonCMP" onClick={handleBackButtonClick}>
        <i className="fa fa-arrow-left"></i> Back
      </button>
      <h1 className="course-title">Course Modules</h1>

      <div className="overall-progress-container">
        <h2>Overall Learning Path</h2>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p>{overallProgress.toFixed(0)}% Completed</p>
      </div>

      <div className="modules-container">
        {modules.length === 0 ? (
          <div>No modules available for this course</div>
        ) : (
          modules.map((module) => (
            <div
              key={module.module_id}
              className="module-card"
              onClick={() => handleModuleClick(module.module_id,module.progress?.corrected||0,module.progress?.incorrected||0,module.progress?.score||0,module.progress?.completion_status||"Failed",module.progress?.skipped)}
            >
              <div className="module-card-content">
                <img
                  src={`./src/assets/CM.png`}
                  alt={module.title}
                  className="module-image"
                />
                <div className="module-info">
                  <h3 className="module-title">{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                  <div className="module-progress">
                    <span>Progress: {module.progress?.completion_status || 'Not Started'}</span>
                    
                    {/* {renderProgressBar( module.progress?.completion_status || 'Not Started')} */}
                    {renderProgressBar( module.progress?.completion_status || 'Not Started', module.progress?.score)}

                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseModulesPage;




