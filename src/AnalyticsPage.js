// AnalyticsPage.js
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchUserTasks } from "./api/azureFunctions";
import "./Analytics.css"; // We'll make a clean matching CSS too

const COLORS = ["#5e5adb", "#d1d5db"]; // Purple and Gray for pie

const AnalyticsPage = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]); // Will be empty for now unless you fetch
  const [selectedRange, setSelectedRange] = useState("Week");

  useEffect(() => {
    if (user) {
      fetchUserTasks(user.localAccountId)
        .then(setTasks)
        .catch((error) => console.error("Failed to fetch tasks:", error));
    }
    // TODO: You can later add fetchFocusSessions here
  }, [user]);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;
  const totalTasks = tasks.length;

  const taskStatusData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  // Mock focus sessions data for now
  const focusData = [
    { name: "Mon", sessions: 2 },
    { name: "Tue", sessions: 3 },
    { name: "Wed", sessions: 1 },
    { name: "Thu", sessions: 4 },
    { name: "Fri", sessions: 2 },
    { name: "Sat", sessions: 5 },
    { name: "Sun", sessions: 1 },
  ];

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>Analytics 📈</h1>
        <div className="range-toggle">
          {["Day", "Week", "Month", "Year"].map((range) => (
            <button
              key={range}
              className={`range-button ${
                selectedRange === range ? "active" : ""
              }`}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      <section className="summary-cards">
        <div className="card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="card">
          <h3>Completed Tasks</h3>
          <p>{completedTasks}</p>
        </div>
        <div className="card">
          <h3>Pending Tasks</h3>
          <p>{pendingTasks}</p>
        </div>
        <div className="card">
          <h3>Focus Sessions</h3>
          <p>{focusSessions.length || focusData.length}</p>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <h3>Focus Sessions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#5e5adb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {taskStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;
