import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./DetailedModulePage.css";

const DetailedModulePage = () => {
  const [moduleDetails, setModuleDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const location = useLocation();
  const { userId, courseId,completion_status } = location.state || {};
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId");

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(`/CourseModulesPage?id=${courseId}`);
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
      const response = await axios.post(
        `http://localhost:5000/module/${moduleId}/submit-quiz`,
        {
          user_id: userId,
          answers,
        }
      );
      console.log("data :-)")
      console.log(response.data.result);
      setSubmissionStatus(response.data.result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmissionStatus({
        success: false,
        message: "Submission failed. Please try again.",
      });
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleGoToCourseModule = () => {
    navigate(`/CourseModulesPage?id=${courseId}`);
  };

  return (
    <div className="module-page-containerDMP">
      <Navbar />

      <button className="back-buttonDMP" onClick={handleBackButtonClick}>
        <i className="fa fa-arrow-left"></i> Back
      </button>

      {moduleDetails ? (
        <>
          <header className="module-headerDMP">
            <h1>{moduleDetails.title}</h1>
            <p>{moduleDetails.description}</p>
            <p>
              <strong>Learning Points:</strong> {moduleDetails.learning_points}
            </p>
            <p>
              <strong>Objectives:</strong> {moduleDetails.objectives}
            </p>
          </header>

          {!showQuiz && (
            <button
              className="start-quiz-btn"
              onClick={handleStartQuiz}
              disabled={completion_status === "Passed"}
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
            <div className="result-box">
              <h2>Quiz Result</h2>
              <p>
                <strong>Status:</strong>{" "}
                {submissionStatus.status === "Passed"
                  ? "Pass ✔️"
                  : "Fail ❌"}
              </p>
              <p>
                <strong>Score:</strong> {submissionStatus.score}
              </p>
              <p>
                <strong>Total Marks:</strong> {submissionStatus.total_marks}
              </p>
              <p>
                <strong>Skipped Questions:</strong>{" "}
                {submissionStatus.skipped_count}
              </p>
              <button
                className="go-to-course-btn"
                onClick={handleGoToCourseModule}
              >
                Go to Course Module
              </button>
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


//==================================================================================================================

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";
// import "./DetailedModulePage.css";

// const DetailedModulePage = () => {
//   const [moduleDetails, setModuleDetails] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [showQuiz, setShowQuiz] = useState(false);

//   const location = useLocation();
//   const { courseId } = location.state || {};
//   const [searchParams] = useSearchParams();
//   const moduleId = searchParams.get("moduleId");
//   const data = JSON.parse(localStorage.getItem('user'));
//   const userId = data.user.id;

//   const navigate = useNavigate();

//   const handleBackButtonClick = () => {
//     navigate(`/CourseModulesPage?id=${courseId}`);
//   };

//   useEffect(() => {
//     const fetchModuleDetails = async () => {
//       if (!moduleId || !userId || !courseId) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/module/${moduleId}/user/${userId}/quiz-details`,
//           {
//             params: { user_id: userId },
//           }
//         );
//         console.log(response.data.course_details)
//         setModuleDetails(response.data.course_details);
//       } catch (error) {
//         console.error("Error fetching module details:", error);
//       }
//     };

//     fetchModuleDetails();
//   }, [moduleId, userId, courseId]);

//   const handleAnswerChange = (quizId, value) => {
//     setAnswers({ ...answers, [quizId]: value });
//   };

//   const handleSubmitQuiz = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/module/${moduleId}/submit-quiz`,
//         {
//           user_id: userId,
//           answers,
//         }
//       );
//       setSubmissionStatus(response.data.result);
//     } catch (error) {
//       console.error("Error submitting quiz:", error);
//       setSubmissionStatus({
//         success: false,
//         message: "Submission failed. Please try again.",
//       });
//     }
//   };

//   const handleStartQuiz = () => {
//     setShowQuiz(true);
//   };

//   const handleGoToCourseModule = () => {
//     navigate(`/CourseModulesPage?id=${courseId}`);
//   };

//   return (
//     <div className="module-page-containerDMP">
//       <Navbar />

//       <button className="back-buttonDMP" onClick={handleBackButtonClick}>
//         <i className="fa fa-arrow-left"></i> Back
//       </button>

//       {moduleDetails ? (
//         <>
//           <header className="module-headerDMP">
//             <h1>{moduleDetails.title}</h1>
//             <p>{moduleDetails.description}</p>
//             <p>
//               <strong>Learning Points:</strong> {moduleDetails.learning_points}
//             </p>
//             <p>
//               <strong>Objectives:</strong> {moduleDetails.objectives}
//             </p>
//           </header>

//           {!showQuiz && (
//             <button
//               className="start-quiz-btn"
//               onClick={handleStartQuiz}
//               disabled={
//                 moduleDetails.quizzes.every(
//                   (quiz) => quiz.result && quiz.result.status === "Passed"
//                 )
//               }
//             >
//               {moduleDetails.quizzes.every(
//                 (quiz) => quiz.result && quiz.result.status === "Passed"
//               )
//                 ? "Quiz Already Passed"
//                 : "Start Quiz"}
//             </button>
//           )}

//           {showQuiz && (
//             <section className="quizzes-sectionDMP">
//               <h2>Quizzes</h2>
//               {moduleDetails.quizzes.map((quiz) => (
//                 <div key={quiz.id} className="quiz-cardDMP">
//                   <h3>{quiz.question}</h3>
//                   <div className="quiz-optionsDMP">
//                     {quiz.options.map((option, index) => (
//                       <label key={index} className="option-labelDMP">
//                         <input
//                           type="radio"
//                           name={`quiz-${quiz.id}`}
//                           value={option}
//                           onChange={(e) =>
//                             handleAnswerChange(quiz.id, e.target.value)
//                           }
//                         />
//                         {option}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </section>
//           )}

//           {showQuiz && (
//             <button className="submit-btnDMP" onClick={handleSubmitQuiz}>
//               Submit Quiz
//             </button>
//           )}

//           {submissionStatus && (
//             <div className="result-box">
//               <h2>Quiz Result</h2>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 {submissionStatus.status === "Passed"
//                   ? "Pass ✔️"
//                   : "Fail ❌"}
//               </p>
//               <p>
//                 <strong>Score:</strong> {submissionStatus.score}
//               </p>
//               <p>
//                 <strong>Total Marks:</strong> {submissionStatus.total_marks}
//               </p>
//               <p>
//                 <strong>Skipped Questions:</strong>{" "}
//                 {submissionStatus.skipped_count}
//               </p>
//               <button
//                 className="go-to-course-btn"
//                 onClick={handleGoToCourseModule}
//               >
//                 Go to Course Module
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <p>Loading module details...</p>
//       )}
//     </div>
//   );
// };

// export default DetailedModulePage;

