document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskModal = document.getElementById('task-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const taskList = document.getElementById('task-list');
    const taskSearch = document.getElementById('task-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectModal = document.getElementById('project-modal');
    const addProjectBtn = document.getElementById('add-project');
    const projectForm = document.getElementById('project-form');
    const notificationModal = document.getElementById('notification-modal');
    const notificationsBtn = document.querySelector('.notifications');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Sample tasks data (in a real app, this would come from a database)
    let tasks = [
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish the proposal document and send to client',
            dueDate: '2023-06-15T14:00',
            priority: 'high',
            project: 'work',
            important: true,
            completed: false,
            reminderSet: true
        },
        {
            id: 2,
            title: 'Grocery shopping',
            description: 'Buy fruits, vegetables, and milk',
            dueDate: '2023-06-10T18:00',
            priority: 'medium',
            project: 'personal',
            important: false,
            completed: false,
            reminderSet: false
        },
        {
            id: 3,
            title: 'Morning run',
            description: '5km run in the park',
            dueDate: '2023-06-11T07:00',
            priority: 'low',
            project: 'personal',
            important: true,
            completed: true,
            reminderSet: true
        }
    ];
    
    // Current filter
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskStats();
        checkReminders();
        
        // Load user data if authenticated
        if (isAuthenticated()) {
            loadUserData();
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'auth/login.html';
        }
    }
    
    // Check if user is authenticated
    function isAuthenticated() {
        // In a real app, this would check for a valid auth token
        return localStorage.getItem('authToken') !== null;
    }
    
    // Load user data
    function loadUserData() {
        // In a real app, this would fetch user data from the server
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'assets/images/user-avatar.jpg'
        };
        
        document.getElementById('username-display').textContent = userData.name;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('user-avatar').src = userData.avatar;
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = [...tasks];
        
        // Apply filter
        if (currentFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filteredTasks = filteredTasks.filter(task => 
                task.dueDate && task.dueDate.startsWith(today)
            );
        } else if (currentFilter === 'important') {
            filteredTasks = filteredTasks.filter(task => task.important);
        } else if (currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }
        
        // Apply search
        if (taskSearch.value) {
            const searchTerm = taskSearch.value.toLowerCase();
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm))
            );
        }
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">No tasks found</li>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const dueDate = new Date(task.dueDate);
            const formattedDate = task.dueDate ? dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'No due date';
            
            taskItem.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <div>
                        <div class="task-title">${task.title}</div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    </div>
                </div>
                <div class="task-due-date">${formattedDate}</div>
                <div class="task-priority priority-${task.priority}">${task.priority}</div>
                <div class="task-actions">
                    <button class="task-btn important ${task.important ? 'active' : ''}" data-id="${task.id}">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="task-btn edit" data-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to task buttons
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskComplete);
        });
        
        document.querySelectorAll('.task-btn.important').forEach(btn => {
            btn.addEventListener('click', toggleTaskImportant);
        });
        
        document.querySelectorAll('.task-btn.edit').forEach(btn => {
            btn.addEventListener('click', editTask);
        });
        
        document.querySelectorAll('.task-btn.delete').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    // Update task statistics
    function updateTaskStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        // Simple overdue check (in a real app, this would be more robust)
        const today = new Date();
        const overdueTasks = tasks.filter(task => 
            !task.completed && 
            task.dueDate && 
            new Date(task.dueDate) < today
        ).length;
        
        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('overdue-tasks').textContent = overdueTasks;
    }
    
    // Check for reminders
    function checkReminders() {
        const now = new Date();
        const soon = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
        
        tasks.forEach(task => {
            if (task.reminderSet && task.dueDate && !task.completed) {
                const dueDate = new Date(task.dueDate);
                
                if (dueDate > now && dueDate <= soon) {
                    showReminderNotification(task);
                }
            }
        });
    }
    
    // Show reminder notification
    function showReminderNotification(task) {
        const notificationList = document.getElementById('notification-list');
        const notificationItem = document.createElement('li');
        notificationItem.className = 'notification-item';
        
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="notification-info">
                <div class="notification-title">Reminder: ${task.title}</div>
                <div class="notification-time">Due soon</div>
            </div>
        `;
        
        notificationList.appendChild(notificationItem);
        
        // Show notification badge
        const badge = document.querySelector('.notification-badge');
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + 1;
        badge.style.display = 'flex';
    }
    
    // Toggle task completion status
    function toggleTaskComplete(e) {
        const taskId = parseInt(e.target.dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = e.target.checked;
            renderTasks();
            updateTaskStats();
            saveTasks();
        }
    }
    
    // Toggle task importance
    function toggleTaskImportant(e) {
        const taskId = parseInt(e.target.closest('button').dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].important = !tasks[taskIndex].important;
            renderTasks();
            saveTasks();
        }
    }
    
    // Edit task
    function editTask(e) {
        const taskId = parseInt(e.target.closest('button').dataset.id);
        const task = tasks.find(task => task.id === taskId);
        
        if (task) {
            // Fill the form with task data
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-due-date').value = task.dueDate ? task.dueDate.slice(0, 16) : '';
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-project').value = task.project;
            document.getElementById('task-important').checked = task.important;
            document.getElementById('task-reminder').checked = task.reminderSet;
            
            // Change form to edit mode
            taskForm.dataset.mode = 'edit';
            taskForm.dataset.id = taskId;
            
            // Show modal
            openModal(taskModal);
        }
    }
    
    // Delete task
    function deleteTask(e) {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskId = parseInt(e.target.closest('button').dataset.id);
            tasks = tasks.filter(task => task.id !== taskId);
            renderTasks();
            updateTaskStats();
            saveTasks();
        }
    }
    
    // Handle task form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-description').value.trim();
        const dueDate = document.getElementById('task-due-date').value;
        const priority = document.getElementById('task-priority').value;
        const project = document.getElementById('task-project').value;
        const important = document.getElementById('task-important').checked;
        const reminderSet = document.getElementById('task-reminder').checked;
        
        if (taskForm.dataset.mode === 'edit') {
            // Update existing task
            const taskId = parseInt(taskForm.dataset.id);
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    dueDate: dueDate || null,
                    priority,
                    project,
                    important,
                    reminderSet
                };
            }
        } else {
            // Add new task
            const newTask = {
                id: Date.now(), // Simple ID generation
                title,
                description,
                dueDate: dueDate || null,
                priority,
                project,
                important,
                completed: false,
                reminderSet
            };
            
            tasks.push(newTask);
        }
        
        // Reset form and close modal
        taskForm.reset();
        taskForm.removeAttribute('data-mode');
        taskForm.removeAttribute('data-id');
        closeModal(taskModal);
        
        // Update UI
        renderTasks();
        updateTaskStats();
        saveTasks();
    });
    
    // Handle project form submission
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('project-name').value.trim();
        const color = document.getElementById('project-color').value;
        
        // In a real app, this would save to the database
        alert(`Project "${name}" created with color ${color}`);
        
        // Reset form and close modal
        projectForm.reset();
        closeModal(projectModal);
    });
    
    // Open modal
    function openModal(modal) {
        modal.style.display = 'flex';
    }
    
    // Close modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }
    
    // Save tasks to localStorage (in a real app, this would save to a database)
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Load tasks from localStorage (in a real app, this would fetch from a database)
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', function() {
        taskForm.reset();
        taskForm.removeAttribute('data-mode');
        taskForm.removeAttribute('data-id');
        openModal(taskModal);
    });
    
    addProjectBtn.addEventListener('click', function() {
        projectForm.reset();
        openModal(projectModal);
    });
    
    notificationsBtn.addEventListener('click', function() {
        openModal(notificationModal);
        // Clear notifications badge
        document.querySelector('.notification-badge').style.display = 'none';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    taskSearch.addEventListener('input', renderTasks);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    logoutBtn.addEventListener('click', function() {
        // In a real app, this would also call the server to invalidate the token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'auth/login.html';
    });
    
    // Check if user is authenticated on page load
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/')) {
        init();
    }
});