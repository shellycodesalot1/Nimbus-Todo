// azure.js
const API_BASE = "https://nimbustodo.azurewebsites.net/api";

// ✅ Fetch all tasks for a user
export const fetchUserTasks = async (userId) => {
  try {
    console.log("Fetching tasks for user:", userId);
    const res = await fetch(`${API_BASE}/get_tasks?userId=${userId}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to fetch tasks: ${res.status} ${errorText}`);

    }

    const data = await res.json();
    console.log("Tasks fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return empty array to prevent UI errors
  }
};


// ✅ Add a new task
export const addTask = async (taskData) => {
  try {
    console.log("Adding task with data:", taskData);
    const res = await fetch(`${API_BASE}/add_task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    console.log("API Response Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to add task: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Task added successfully:", data);
    return data;

  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};


// ✅ Delete a task by task ID
export const deleteTask = async (taskId) => {
  try {
    console.log("Deleting task:", taskId);
    const res = await fetch(`${API_BASE}/delete_task/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to delete task: ${res.status} ${errorText}`);
    }

    const responseText = await res.text();
    console.log("Task deleted successfully:", responseText);
    return responseText;


  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};


// ✅ Edit a task by task ID
export const editTask = async (taskId, updatedData) => {
  try {
    console.log("Updating task:", taskId, "with data:", updatedData);
    const res = await fetch(`${API_BASE}/edit_task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to edit task: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("Task updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error editing task:", error);
    throw error;
  }
};
