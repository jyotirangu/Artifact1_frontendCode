import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseModulesPage.css";
import Navbar from "./Navbar";

const CourseModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress,setcourseProgress] = useState(0);

  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  const data = JSON.parse(localStorage.getItem("user"));
  const userId = data ? data.user.id : null;


  const handleBackButtonClick = () => {
    navigate(`/ViewCourse?id=${courseId}`);
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
        console.log(data.Course_progress)
        setcourseProgress(data.Course_progress);
        setModules(data.modules || []); // Default to an empty array if no modules
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchModules();
  }, [userId, courseId]);

  const renderProgressBar = (completion_percentage) => {
    const progressWidth = `${(completion_percentage=="Passed")?100:0 || 0}%`;
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: progressWidth }}></div>
      </div>
    );
  };

  const handleModuleClick = (
    moduleId,
    corrected,
    incorrected,
    score,
    completion_status,
    skipped
  ) => {
    navigate(`/DetailedModulePage?moduleId=${moduleId}`, {
      state: { userId, courseId, corrected, incorrected, score, completion_status, skipped },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const overallProgress = modules.length
    ? (modules.reduce(
        (acc, module) => acc + (module.progress?.completion_percentage || 0),
        0
      ) /
        modules.length).toFixed(2)
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
            style={{ width: `${courseProgress.completion_percentage}%` }}
          ></div>
        </div>
        <b>
        <p>{courseProgress.completion_percentage}% Completed  </p>
        </b>
        <b>
        <p>Quiz Percentage: {courseProgress.quiz_percentage} %</p>
        </b>
        <b>
        <p>Total Marks Obtaint: {courseProgress.total_score}</p>
        </b>
        <b>
        <p>Total Marks:{courseProgress.total_marks}</p>
        </b>
       
      </div>

      {/* <div>
          {courseProgress.quiz_percentage}
          {courseProgress.total_marks}
          {courseProgress.total_score}
      </div> */}

      <div className="modules-container">
        {modules.length === 0 ? (
          <div>No modules available for this course</div>
        ) : (
          modules.map((module) => (
            <div
              key={module.module_id}
              className="module-card"
              onClick={() =>
                handleModuleClick(
                  module.module_id,
                  module.progress?.corrected || 0,
                  module.progress?.incorrected || 0,
                  module.progress?.score || 0,
                  module.status || "Not Started",
                  module.progress?.skipped
                )
              }
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
                    <span>
                      Progress: {module.status || "Not Started"}
                    </span>
                    {renderProgressBar(module.status|| 0)}
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


