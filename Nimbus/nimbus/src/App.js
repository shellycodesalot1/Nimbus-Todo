import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignUp from "./SignUp";

function App() {
  return (
<<<<<<< Updated upstream

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </Router>
  );
}
=======
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>)
>>>>>>> Stashed changes

// ✅ Add this line

  // Dummy task list for testing
  const dummyTasks = [
    {
      id: "1",
      title: "Submit report",
      completed: false,
      dueDate: "2025-04-21T12:00:00Z",
      priority: "High",
    },
    {
      id: "2",
      title: "Finish laundry",
      completed: true,
      dueDate: "2025-04-18T08:00:00Z",
      priority: "Low",
    },
    {
      id: "3",
      title: "Meeting with team",
      completed: false,
      dueDate: "2025-04-20T15:00:00Z",
      priority: "Medium",
    },
  ];

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={<Dashboard tasks={dummyTasks} />}
          />{" "}
          {/* ✅ Add this */}
        </Routes>
      </Router>
    );
  }

}
  export default App;
