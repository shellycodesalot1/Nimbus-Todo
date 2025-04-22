const API_BASE = "https://nimbustodo.azurewebsites.net/api";

// ✅ Create a new task
export const createNewTask = async (userId, task) => {
  console.log("🧩 Adding task for user:", userId, "with data:", task);

  try {
    const payload = {
      description: task.title,
      priority: task.priority,
    };

    const res = await fetch(`${API_BASE}/add_task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("✅ Added task:", data);
    return await fetchUserTasks(userId);
  } catch (error) {
    console.error("❌ Error adding task:", error);
    return [];
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
export const editTask = async (taskId, updates) => {
  console.log("✏️ Sending update for task:", taskId, "with data:", updates);

  const res = await fetch(`${API_BASE}/edit_task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const result = await res.json();
  console.log("✅ Azure responded to edit_task:", result);
  return result;
};

// ✅ Fetch all tasks (flat list)
export const fetchUserTasks = async (userId) => {
  console.log("📡 Fetching all tasks for user:", userId);

  try {
    const res = await fetch(`${API_BASE}/get_tasks`);
    const data = await res.json();
    console.log("📦 Raw tasks from backend:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return [];
  }
};
