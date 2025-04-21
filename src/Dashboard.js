import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addTask, deleteTask, editTask } from './api/azureFunctions';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    description: '', 
    priority: 'Medium' // Matches backend expectation
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load tasks on component mount (you'll need to implement this endpoint)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // You'll need to implement this endpoint in your Azure Functions
        const response = await fetch('https://nimbustodo.azurewebsites.net/api/get_tasks');
        const data = await response.json();
        // Map backend tasks to frontend format (add status based on completed)
        setTasks(data.map(task => ({
          ...task,
          status: task.completed ? 'Done' : 'To Do' // Default status mapping
        })));
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!newTask.description.trim()) {
      setError('Task description cannot be empty');
      setIsLoading(false);
      return;
    }
    
    try {
      // Send only what backend expects
      const taskToSend = {
        description: newTask.description,
        priority: newTask.priority
      };
      
      const created = await addTask(taskToSend);
      
      // Add frontend-specific status (not provided by backend)
      setTasks([...tasks, { 
        ...created, 
        status: 'To Do' // Default status for new tasks
      }]);
      
      setNewTask({ description: '', priority: 'Medium' });
    } catch (err) {
      console.error('Failed to add task:', err);
      setError(err.message || 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      // Convert frontend status to backend completed boolean
      const completed = newStatus === 'Done';
      const updated = await editTask(taskId, { completed });
      
      // Update local state
      setTasks(tasks.map((task) => 
        task.id === taskId ? { 
          ...task, 
          status: newStatus,
          completed // Keep in sync with backend
        } : task
      ));
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError(err.message || 'Failed to update task');
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // No change if dropped outside or in same column
    if (!destination || source.droppableId === destination.droppableId) return;
    
    handleUpdateStatus(draggableId, destination.droppableId);
  };

  const categories = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user?.name || 'User'}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <form className="task-form" onSubmit={handleAddTask}>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask(e)}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {categories.map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <div
                  className="task-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2>{category}</h2>
                  {tasks
                    .filter((task) => task.status === category)
                    .map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(provided) => (
                          <div
                            className="task-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p><strong>{task.description}</strong></p>
                            <p>Priority: {task.priority}</p>
                            <div className="task-actions">
                              <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;