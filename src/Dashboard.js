import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import {
  fetchUserTasks,
  createNewTask,
  deleteTask,
} from "./api/azureFunctions";
import {
  PresentationBarChart02Icon,
  CheckListIcon,
  Delete01Icon,
  Menu01Icon,
} from "hugeicons-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Low",
    source: "",
  });
  const [focusMinutes, setFocusMinutes] = useState(120);
  const [breakMinutes, setBreakMinutes] = useState(20);
  const [filter, setFilter] = useState("All");
  const [selectedSection, setSelectedSection] = useState("todo");
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [autoBreak, setAutoBreak] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTasks(user.uid).then(setTasks);
    }
  }, [user]);

  useEffect(() => {
    let timer = null;
    if (isFocusRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isFocusRunning && timeLeft === 0) {
      setIsFocusRunning(false);
      if (autoBreak) {
        setTimeout(() => {
          setTimeLeft(breakMinutes * 60);
          setIsFocusRunning(true);
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isFocusRunning, timeLeft, autoBreak, breakMinutes]);

  const startFocus = () => {
    setTimeLeft(focusMinutes * 60);
    setIsFocusRunning(true);
  };

  const pauseFocus = () => setIsFocusRunning(false);

  const resetFocus = () => {
    setIsFocusRunning(false);
    setTimeLeft(focusMinutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    const updatedTasks = await createNewTask(user.uid, newTask);
    setTasks(updatedTasks);
    setNewTask({ title: "", priority: "Low", source: "" });
    setShowTaskForm(false);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    const updatedTasks = await fetchUserTasks(user.uid);
    setTasks(updatedTasks);
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "All" || task.priority === filter
  );

  const renderMainContent = () => {
    if (selectedSection === "analytics") {
      return <div className="placeholder">Analytics View Coming Soon</div>;
    }

    return (
      <div className="main-content-wrapper">
        <div className="main-column">
          {showTaskForm && (
            <div className="task-form-card">
              <input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <input
                placeholder="Source (e.g. Dribbble, Website)"
                value={newTask.source}
                onChange={(e) =>
                  setNewTask({ ...newTask, source: e.target.value })
                }
              />
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <div className="form-actions">
                <button onClick={handleCreateTask} className="add-button">
                  Add Task
                </button>
                <button onClick={toggleTaskForm} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="tasks-section">
            <div className="task-group">
              <h2>Today's Tasks</h2>
              {filteredTasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <div className="task-left">
                    <div className="checkbox-container">
                      <input type="checkbox" className="task-checkbox" />
                    </div>
                    <div className="task-content">
                      <div className="task-source">
                        <Menu01Icon size={14} /> {task.source || "Nimbus Todo"}
                      </div>
                      <div className="task-title">
                        {task.description || task.title}
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <div
                      className={`priority-pill ${task.priority.toLowerCase()}`}
                    >
                      <span className="priority-dot"></span>
                      {task.priority}
                      <span className="dropdown-arrow">▾</span>
                    </div>
                    <button
                      className="trash-button"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Delete01Icon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="start-session-btn">Start Session</button>
            <button className="add-task-btn" onClick={toggleTaskForm}>
              <span className="plus-icon">+</span> Add Task
            </button>
          </div>
        </div>

        <div className="focus-sidebar">
          <div className="focus-mode">
            <h3>Focus Mode</h3>
            <div className="focus-timer">{formatTime(timeLeft)}</div>
            <div style={{ marginBottom: "1rem" }}>
              <button onClick={startFocus} disabled={isFocusRunning}>
                Start
              </button>
              <button
                onClick={pauseFocus}
                disabled={!isFocusRunning}
                style={{ marginLeft: "0.5rem" }}
              >
                Pause
              </button>
              <button onClick={resetFocus} style={{ marginLeft: "0.5rem" }}>
                Reset
              </button>
            </div>
            <label>Focus Duration</label>
            <input
              type="number"
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(parseInt(e.target.value))}
            />
            <label>Break Duration</label>
            <input
              type="number"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
            />
            <label style={{ marginTop: "1rem", display: "block" }}>
              <input
                type="checkbox"
                checked={autoBreak}
                onChange={() => setAutoBreak(!autoBreak)}
              />{" "}
              Auto Break
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="brand">Nimbus Todo</div>
        <div className="menu">
          <div className="menu-section">
            <div
              className={`menu-item ${
                selectedSection === "todo" ? "selected" : ""
              }`}
              onClick={() => setSelectedSection("todo")}
            >
              <CheckListIcon className="menu-icon" /> To-do
            </div>
            <div
              className={`menu-item ${
                selectedSection === "analytics" ? "selected" : ""
              }`}
              onClick={() => setSelectedSection("analytics")}
            >
              <PresentationBarChart02Icon className="menu-icon" /> Analytics
            </div>
          </div>
        </div>
        <div className="user-footer">
          <span>{user?.name || "User"}</span>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Good Morning, {user?.name || "User"}!</h1>
          <div className="filter-controls">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </header>
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard;
