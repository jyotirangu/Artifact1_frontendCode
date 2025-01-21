import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from './Navbar';
import "./DetailedModulePage.css";

const DetailedModulePage = () => {
  const [moduleDetails, setModuleDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const location = useLocation(); // To access the passed state
  const { userId, courseId, corrected, incorrected, score,completion_status,skipped } = location.state || {}; // Destructure the state

  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId"); // Extract moduleId from query string

  const data = JSON.parse(localStorage.getItem('user'));
  const userRole = data?.user?.role;

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleBackButtonClick = () => {
    navigate(`/CourseModulesPage?id=${courseId}`); // Pass courseId back as query param
  };

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleId || !userId || !courseId) return;

      try {
        console.log(`Fetching details for module: ${moduleId}`);
        const response = await axios.get(
          `http://localhost:5000/module/${moduleId}/details`
        );
        console.log(response.data.module);
        setModuleDetails(response.data.module);
      } catch (error) {
        console.error("Error fetching module details:", error);
      }
    };

    fetchModuleDetails();
  }, [moduleId, userId, courseId]);

  const handleAnswerChange = (quizId, value) => {
    setAnswers({ ...answers, [quizId]: value });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/module/${moduleId}/submit-quiz`, {
        user_id: userId, 
        answers,
      });

      console.log(response.data.result);
    
      setSubmissionStatus( response.data.result );

      // console.log(submissionStatus);

      // setTimeout(() => {
      //   setSubmissionStatus("");
      // }, 3000);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmissionStatus({
        success: false,
        message: "Submission failed. Please try again.",
      });

      setTimeout(() => {
        setSubmissionStatus("");
      }, 3000);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true); 
  };

  return (
    <div className="module-page-containerDMP">
      <Navbar />
      
      {/* Back Button */}
      {/* <button className="back-buttonDMP" onClick={handleBackButtonClick}>
        Back to Course Modules
      </button> */}
      <button className="back-buttonDMP" onClick={handleBackButtonClick}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      {moduleDetails ? (
        <>
          <header className="module-headerDMP">
            <h1>{moduleDetails.title}</h1>
            <p>{moduleDetails.description}</p>
            <p><strong>Learning Points:</strong> {moduleDetails.learning_points}</p>
            <p><strong>Objectives:</strong> {moduleDetails.objectives}</p>

            {/* <p>Corrected Answer = {corrected||0}</p>
            <p>Incorrected Answer = {incorrected||0}</p>
            <p>Score = {score||0} Marks</p>
            <p>Status = {completion_status}</p>
            <p>Skipped Question = {skipped}</p> */}

          </header>

        {!showQuiz && (
            <button className="start-quiz-btn" onClick={handleStartQuiz}
            disabled={(score!=0 && completion_status!="Failed")?true:false}
            >
             Start Quiz
            </button>
          )}

          {showQuiz && (
            <section className="quizzes-sectionDMP">
              <h2>Quizzes</h2>
              {moduleDetails.quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-cardDMP">
                  <h3>{quiz.question}</h3>
                  <div className="quiz-optionsDMP">
                    {quiz.options.map((option, index) => (
                      <label key={index} className="option-labelDMP">
                        <input
                          type="radio"
                          name={`quiz-${quiz.id}`}
                          value={option}
                          onChange={(e) =>
                            handleAnswerChange(quiz.id, e.target.value)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {showQuiz && (
            <button className="submit-btnDMP" onClick={handleSubmitQuiz}>
              Submit Quiz
            </button>
          )}

          {submissionStatus && (
            <div className="submission-status-container">
              <div
                className={`submission-status ${(submissionStatus.status=="Passed") ? "success" : "failure"}`}
              >
                <p className={`icon ${(submissionStatus.status=="Passed") ? "checkmark" : "cross"}`}>
                  Status : {(submissionStatus.status=="Passed") ? "Pass ✔️" : "Fail ❌"}
                </p> 
                <p>Score :{submissionStatus.score}</p> 
                <p>Total Marks :{submissionStatus.total_marks}</p>
                <p>Skipped Question :{submissionStatus.skipped_count}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading module details...</p>
      )}
    </div>
  );
};

export default DetailedModulePage;
