import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

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

function App() {
  const [todoList, setTodoList] = useState([]);
  const [currentTask, setCurrentTask] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(getFormattedDate());
  const [completedTask, setCompletedTask] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const inputTask = useRef(null);

  // Update the current date every day at midnight
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentDate(getFormattedDate());
      },
      1000 * 60 * 60 * 24
    );

    return () => clearInterval(interval);
  }, []);

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
      // Show "Clear All" button when tasks are 2 and above
      setShowClearAll(todoList.length + 1 >= 2);
    } else {
      setShowMessage({
        type: "error",
        text: "Please enter a task before adding.",
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
    // Hide "Clear All" button when tasks are less than or equal to 4
    setShowClearAll(todoList.length > 4);
  };

  const completeTask = (taskToComplete) => {
    // Find the task that is being completed
    const task = todoList.find((task) => task.task === taskToComplete);

    // Check if the task is being completed
    if (task) {
      // Update the todo list by mapping over tasks
      setTodoList(
        todoList.map((task) =>
          task.task === taskToComplete
            ? { ...task, completed: !task.completed }
            : task
        )
      );
      // Set the completed task state only if the task is completed
      if (!task.completed) {
        setCompletedTask(taskToComplete);
        setShowModal(true);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCompletedTask(null);
  };

  const clearAll = () => {
    setShowModal(true);
  };

  const confirmClearAll = () => {
    setTodoList([]);
    setShowClearAll(false);
    setShowModal(false);
  };

  const cancelClearAll = () => {
    setShowModal(false);
  };

  return (
    <div className='App'>
      <h1>TODO LIST</h1>
      <div className='date'>{currentDate}</div>
      <div>
        <input
          ref={inputTask}
          type='text'
          placeholder='Task...'
          // Event handler for adding a task on pressing Enter
          onKeyDown={(event) => {
            if (event.key === "Enter") addTask();
          }}
          // Event handler for updating the current task
          onChange={(event) => {
            setCurrentTask(event.target.value);
          }}
        ></input>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Display Messages */}
      {showMessage && (
        <div id='message' className={showMessage.type}>
          <p> {showMessage.text} </p>
        </div>
      )}
      <hr />

      {/* Task List */}
      <ul>
        {todoList.map((value, index) => (
          <div id='task' key={index}>
            <li>{value.task}</li>
            <button onClick={() => completeTask(value.task)}>
              {/* Button text based on completion status */}
              {value.completed ? "Undo" : "Complete"}
            </button>
            <button id='delete' onClick={() => deleteTask(value.task)}>
              Delete
            </button>
            {/* Displaying whether the task is completed or not */}
            {value.completed ? (
              <h3 id='complete'>Task Completed</h3>
            ) : (
              <h3>Task not Completed</h3>
            )}
            {value.completed && (
              <span className='icon'>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            )}
          </div>
        ))}
      </ul>

      {/* Clear All Button */}
      {showClearAll && (
        <button id='clear' onClick={clearAll}>
          Clear All Tasks
        </button>
      )}

      {/* Modal for Confirmations */}
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            {/* Conditional rendering based on the presence of completedTask */}
            {completedTask ? (
              <h2>
                Task '{completedTask}'{" "}
                {todoList.find((task) => task.task === completedTask)?.completed
                  ? "Completed"
                  : "Not Completed"}
              </h2>
            ) : (
              <h2>Are you sure you want to clear all tasks?</h2>
            )}
            {/* Conditional rendering of buttons based on the presence of completedTask */}
            {completedTask ? (
              <button onClick={closeModal}>Ok</button>
            ) : (
              <>
                <button onClick={confirmClearAll}>Yes</button>
                <button onClick={cancelClearAll}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
