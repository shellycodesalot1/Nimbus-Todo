//const API_BASE = "https://nimbustodo.azurewebsites.net/api"; // Later, update this to your deployed Azure Function URL

export const addTask = async (task) => {
    console.log("🛰️ Sending task to Azure (add):", task);
  
    const res = await fetch("https://nimbustodo.azurewebsites.net/api/add_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  
    const result = await res.json();
    console.log("✅ Azure responded to add_task:", result);
    return result;
  };
  
  export const deleteTask = async (taskId) => {
    console.log("🗑️ Sending delete request for task:", taskId);
  
    const res = await fetch(`https://nimbustodo.azurewebsites.net/api/delete_task/${taskId}`, {
      method: "DELETE",
    });
  
    const result = await res.text();
    console.log("✅ Azure responded to delete_task:", result);
    return result;
  };
  
  export const editTask = async (taskId, updates) => {
    console.log("✏️ Sending update for task:", taskId, "with data:", updates);
  
    const res = await fetch(`https://nimbustodo.azurewebsites.net/api/edit_task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  
    const result = await res.json();
    console.log("✅ Azure responded to edit_task:", result);
    return result;
  };
  