import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCoursePage.css";

const AddCoursePage = () => {
  const [modules, setModules] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const data = JSON.parse(localStorage.getItem("user"));
  const userId = data.user.id;
  const userRole = data.user.role;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/${userId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "An error occurred");
      });

    if (userRole === "HR") {
      axios
        .get("http://localhost:5000/instructor")
        .then((response) => {
          setInstructors(response.data.instructors);
        })
        .catch((error) => {
          setError(error.response?.data?.error || "An error occurred while fetching instructors");
        });
    }
  }, [userRole, userId]);

  const addModule = () => {
    const newModule = {
      id: modules.length + 1,
      title: "",
      description: "",
      objectives: "Learning",
      learningPoints: "",
      quizzes: [],
    };
    setModules([...modules, newModule]);
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const addQuiz = (moduleIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].quizzes.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: "",
    });
    setModules(updatedModules);
  };

  const handleQuizChange = (moduleIndex, quizIndex, field, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].quizzes[quizIndex][field] = value;
    setModules(updatedModules);
  };

  const handleOptionChange = (moduleIndex, quizIndex, optionIndex, value) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].quizzes[quizIndex].options[optionIndex] = value;
    setModules(updatedModules);
  };

  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(`${diffDays} days`);
    }
  };

  const handleSubmit = () => {
    const courseData = {
      course_id: courseId,
      title,
      description,
      instructor,
      start_date: startDate,
      end_date: endDate,
      duration,
      detailed_description: detailedDescription,
      created_by: userId,
      modules,
    };

    console.log("Course Data Sent:", courseData);

    axios
      .post("http://127.0.0.1:5000/addCourse", courseData)
      .then((response) => {
        alert("Course has been successfully created!");
        console.log(response.data);
      })
      .catch((error) => {

        if (error.response) {
          console.error("Error Response Data:", error.response.data);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <div className="container-acp">
      <h2 className="header-acp">Add Course</h2>

      <div className="field-group-acp">
        <div className="input-acp">
          <label>Course ID</label>
          <input
            type="text"
            placeholder="Enter Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>
        <div className="input-acp">
          <label>Course Title</label>
          <input
            type="text"
            placeholder="Enter Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="input-acp">
          <label>Course Description</label>
          <textarea
            placeholder="Enter Course Description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-acp">
          <label>Instructor</label>
          <select value={instructor} onChange={(e) => setInstructor(e.target.value)}>
            <option value="">Select Instructor</option>
            {instructors.length > 0 ? (
              instructors.map((instructor, index) => (
                <option key={index} value={instructor.name}>
                  {instructor.name}
                </option>
              ))
            ) : (
              <option>Loading instructors...</option>
            )}
          </select>
        </div>
        <div className="input-acp">
          <label>Detailed Description</label>
          <textarea
            placeholder="Enter Detailed Description"
            rows="3"
            value={detailedDescription}
            onChange={(e) => setDetailedDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="input-acp">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              calculateDuration();
            }}
          />
        </div>
        <div className="input-acp">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              calculateDuration();
            }}
          />
        </div>
        <div className="input-acp">
          <label>Duration</label>
          <input type="text" value={duration} readOnly placeholder="Duration" />
        </div>
      </div>

      <button className="add-module-button" onClick={addModule}>
        + Add Module
      </button>

      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module-container-acp">
          <h3 className="module-header-acp">Module {moduleIndex + 1}</h3>
          <div className="module-fields-acp">
            <div className="input-acp">
              <label>Module Title</label>
              <input
                type="text"
                placeholder="Enter Module Title"
                value={module.title}
                onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
              />
            </div>
            <div className="input-acp">
              <label>Module Description</label>
              <textarea
                placeholder="Enter Module Description"
                rows="3"
                value={module.description}
                onChange={(e) => handleModuleChange(moduleIndex, "description", e.target.value)}
              ></textarea>
            </div>
            <div className="input-acp">
              <label>Learning Points</label>
              <textarea
                placeholder="Enter Learning Points"
                rows="3"
                value={module.learningPoints}
                onChange={(e) => handleModuleChange(moduleIndex, "learningPoints", e.target.value)}
              ></textarea>
            </div>
          </div>

          {module.quizzes.map((quiz, quizIndex) => (
            <div key={quizIndex} className="quiz-container-acp">
              <h4 className="quiz-header-acp">Quiz {quizIndex + 1}</h4>
              <div className="quiz-fields-acp">
                <div className="input-acp">
                  <label>Question</label>
                  <textarea
                    placeholder="Enter Question"
                    rows="2"
                    value={quiz.question}
                    onChange={(e) =>
                      handleQuizChange(moduleIndex, quizIndex, "question", e.target.value)
                    }
                  ></textarea>
                </div>
                {quiz.options.map((option, optionIndex) => (
                  <div className="input-acp" key={optionIndex}>
                    <label>Option {optionIndex + 1}</label>
                    <input
                      type="text"
                      placeholder={`Enter Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(moduleIndex, quizIndex, optionIndex, e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="input-acp">
                  <label>Correct Answer</label>
                  <input
                    type="text"
                    placeholder="Enter Correct Answer"
                    value={quiz.correctAnswer}
                    onChange={(e) =>
                      handleQuizChange(moduleIndex, quizIndex, "correctAnswer", e.target.value)
                    }
                  />
                </div>
                <div className="input-acp">
                  <label>Marks</label>
                  <input
                    type="number"
                    placeholder="Enter Marks"
                    value={quiz.marks}
                    onChange={(e) =>
                      handleQuizChange(moduleIndex, quizIndex, "marks", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <button className="add-quiz-button" onClick={() => addQuiz(moduleIndex)}>
            + Add Question
          </button>
        </div>
      ))}

<button className="submit-buttonACP" onClick={handleSubmit}>
        Submit Course
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddCoursePage;
