const API_BASE = "https://nimbustodo.azurewebsites.net/api";

// ✅ Create a new task
export const addTask = async (task) => {
  console.log("🧩 Adding task with data:", task);

  try {
    const res = await fetch(`${API_BASE}/add_task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task), // ❗Send full correct fields including userId
    });

    const data = await res.json();
    console.log("✅ Added task:", data);
    return data; // ✅ return the created task (not call fetchUserTasks here)
  } catch (error) {
    console.error("❌ Error adding task:", error);
    throw error;
  }
};

// ✅ Delete a task by ID
export const deleteTask = async (taskId) => {
  console.log("🗑️ Sending delete request for task:", taskId);

  const res = await fetch(`${API_BASE}/delete_task/${taskId}`, {
    method: "DELETE",
  });

  const result = await res.text();
  console.log("✅ Azure responded to delete_task:", result);
  return result;
};

// ✅ Edit a task by ID
// ✅ Edit a task by task ID
export const editTask = async (taskId, userId, updatedData) => {
  try {
    console.log(
      "✏️ Sending update for task:",
      taskId,
      "with data:",
      updatedData
    );
    const res = await fetch(
      `${API_BASE}/edit_task/${taskId}?userId=${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to edit task: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("✅ Azure responded to edit_task:", data);
    return data;
  } catch (error) {
    console.error("❌ Error editing task:", error);
    throw error;
  }
};

// ✅ Fetch all tasks (filtered by userId)
export const fetchUserTasks = async (userId) => {
  console.log("📡 Fetching all tasks for user:", userId);

  try {
    const res = await fetch(`${API_BASE}/get_tasks?userId=${userId}`); // ❗ Add ?userId= param
    const data = await res.json();
    console.log("📦 Raw tasks from backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return [];
  }
};

// ✅ Create a focus session record
export const addFocusSession = async (session) => {
  console.log("🧠 Adding focus session:", session);

  try {
    const res = await fetch(`${API_BASE}/add_focus_session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });

    const data = await res.json();
    console.log("✅ Focus session saved:", data);
    return data;
  } catch (error) {
    console.error("❌ Error saving focus session:", error);
    throw error;
  }
};
