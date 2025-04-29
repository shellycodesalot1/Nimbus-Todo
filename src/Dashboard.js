import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import AnalyticsPage from "./AnalyticsPage";
import {
  fetchUserTasks,
  addTask,
  deleteTask,
  editTask,
  addFocusSession,
} from "./api/azureFunctions";
import {
  PresentationBarChart02Icon,
  CheckListIcon,
  Delete01Icon,
  Menu01Icon,
  Logout01Icon,
} from "hugeicons-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    description: "",
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
      fetchUserTasks(user.localAccountId)
        .then(setTasks)
        .catch((error) => console.error("Failed to fetch tasks:", error));
    }
  }, [user]);

  useEffect(() => {
    let timer = null;
    if (isFocusRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isFocusRunning && timeLeft === 0) {
      setIsFocusRunning(false);
      try {
        addFocusSession({
          userId: user.localAccountId,
          focusMinutes,
          breakMinutes,
          autoBreak,
          status: "completed",
        });
      } catch (error) {
        console.error("Failed to log completed focus session:", error);
      }
      if (autoBreak) {
        setTimeout(() => {
          setTimeLeft(breakMinutes * 60);
          setIsFocusRunning(true);
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isFocusRunning, timeLeft, autoBreak, breakMinutes, focusMinutes, user?.localAccountId]);

  const startFocus = async () => {
    setTimeLeft(focusMinutes * 60);
    setIsFocusRunning(true);
    try {
      await addFocusSession({
        userId: user.localAccountId,
        focusMinutes,
        breakMinutes,
        autoBreak,
        status: "started",
      });
    } catch (error) {
      console.error("Failed to log focus session:", error);
    }
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
    if (!newTask.description.trim()) return;
    try {
      await addTask({
        description: newTask.description,
        priority: newTask.priority,
        source: newTask.source,
        userId: user.localAccountId,
        status: "To Do",
      });
      const updatedTasks = await fetchUserTasks(user.localAccountId);
      setTasks(updatedTasks);
      setNewTask({ description: "", priority: "Low", source: "" });
      setShowTaskForm(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = await fetchUserTasks(user.localAccountId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };


  const pendingTasks = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      (filter === "All" || task.priority === filter)
  );

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed" &&
      (filter === "All" || task.priority === filter)
  );

  const renderTaskList = (taskList) =>
    taskList.map((task) => (
      <div className="task-card" key={task.id}>
        <div className="task-left">
          <div className="checkbox-container">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.status === "Completed"}
              onChange={async (e) => {
                try {
                  const newStatus = e.target.checked ? "Completed" : "To Do";
                  await editTask(task.id, user.localAccountId, {
                    status: newStatus,
                  });
                  const updatedTasks = await fetchUserTasks(
                    user.localAccountId
                  );
                  setTasks(updatedTasks);
                } catch (error) {
                  console.error("Failed to update task status:", error);
                }
              }}
            />
          </div>
          <div className="task-content">
            <div className="task-source">
              <Menu01Icon size={14} /> {task.source || "Nimbus Todo"}
            </div>
            <div className="task-title">{task.description}</div>
          </div>
        </div>
        <div className="task-actions">
          <div className={`priority-pill ${task.priority.toLowerCase()}`}>
            <span className="priority-dot"></span>
            {task.priority}
            <span className="dropdown-arrow">\u25BE</span>
          </div>
          <button
            className="trash-button"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Delete01Icon size={18} />
          </button>
        </div>
      </div>
    ));

  const renderMainContent = () => {
    if (selectedSection === "analytics") {
      return <AnalyticsPage user={user} />;

    }

    return (
      <div className="main-content-wrapper">
        <div className="main-column">
          {showTaskForm && (
            <div className="task-form-card">
              <input
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
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
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="tasks-section">
            <div className="task-group">
              <h2>Pending Tasks</h2>
              {renderTaskList(pendingTasks)}
            </div>
            <div className="task-group">
              <h2>
                Completed Tasks{" "}
                <span className="completed-count-badge">
                  {completedTasks.length}
                </span>
              </h2>
              {renderTaskList(completedTasks)}
            </div>
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

          <div className="sidebar-buttons">
            <button className="sidebar-btn" onClick={startFocus}>
              Start Session
            </button>
            <button
              className="sidebar-btn"
              onClick={() => setShowTaskForm(true)}
            >
              + Add Task
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => console.log("Logging out...")}
          >
            <Logout01Icon className="logout-icon" /> Logout
          </button>
          <div className="user-footer">
            <span>{user?.name || "User"}</span>
          </div>
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
