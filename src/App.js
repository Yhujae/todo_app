import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const [completedTask, setCompletedTask] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const inputTask = useRef(null);

  useEffect(() => {
    // Update the current date every day at midnight
    const interval = setInterval(
      () => {
        setCurrentDate(getFormattedDate());
      },
      1000 * 60 * 60 * 24
    );

    return () => clearInterval(interval);
  }, []);

  // Define the getFormattedDate function before using it
  function getFormattedDate() {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString(undefined, options);
  }

  const addTask = () => {
    if (currentTask.trim() !== "") {
      // If the condition is true, update the todo list by adding a new task
      setTodoList([...todoList, { task: currentTask, completed: false }]);
      // Clear the input field by accessing the 'value' property of the inputTask ref
      inputTask.current.value = "";
      // Reset the currentTask state to an empty string
      setCurrentTask("");
      // Set showMessage to null when task is added
      setShowMessage(null);
      // Show "Clear All" button when tasks are above 5
      setShowClearAll(todoList.length + 1 > 5);
    } else {
      setShowMessage({
        type: "error",
        text: "Please enter a task before adding",
      });
    }
  };

  const deleteTask = (taskToDelete) => {
    // Update the todo list by filtering out the task to delete
    setTodoList(
      todoList.filter((task) => {
        return task.task !== taskToDelete;
      })
    );
    // Hide "Clear All" button when tasks are less than or equal to 5
    setShowClearAll(todoList.length > 5);
  };

  const completeTask = (taskToComplete) => {
    // Update the todo list by mapping over tasks
    setTodoList(
      todoList.map((task) => {
        return task.task === taskToComplete
          ? { task: taskToComplete, completed: !task.completed }
          : task;
      })
    );
    // Set the completed task state
    setCompletedTask(taskToComplete);
    // Set the showModal state to true
    setShowModal(true);
    // Show "Clear All" button when tasks are above 6
    setShowClearAll(todoList.length + 1 > 6);
  };

  const closeModal = () => {
    setShowModal(false);
    setCompletedTask(null);
  };

  const clearAll = () => {
    setTodoList([]);
    setShowMessage(null);
    setShowClearAll(false);
  };

  return (
    <div className="App">
      <h1>MY TODO LIST</h1>
      <div className="date">{currentDate}</div>
      <div>
        <input
          ref={inputTask}
          type="text"
          placeholder="Task..."
          // Event handler for adding a task on pressing Enter
          onKeyDown={(event) => {
            if (event.keyCode === 13) addTask();
          }}
          // Event handler for updating the current task
          onChange={(event) => {
            setCurrentTask(event.target.value);
          }}
        ></input>
        <button onClick={addTask}>Add Task</button>
      </div>

      {showMessage && (
        <div id="message" className={showMessage.type}>
          <p>* {showMessage.text} *</p>
        </div>
      )}
      <hr />

      <ul>
        {todoList.map((value, index) => (
          <div id="task" key={index}>
            <li>{value.task}</li>
            <button onClick={() => completeTask(value.task)}>
              {value.completed ? "Undo" : "Completed"}
            </button>
            <button id="delete" onClick={() => deleteTask(value.task)}>
              Delete
            </button>
            {/* Displaying whether the task is completed or not */}
            {value.completed ? (
              <h3 id="complete">Task Completed</h3>
            ) : (
              <h3>Task not Completed</h3>
            )}
            {value.completed && (
              <span className="icon">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
          </div>
        ))}
      </ul>

      {showClearAll && (
        <button id="clear" onClick={clearAll}>
          Clear All
        </button>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              Task "{completedTask}"{" "}
              {todoList.find((task) => task.task === completedTask)?.completed
                ? "Completed"
                : "Not Completed"}
            </h2>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
