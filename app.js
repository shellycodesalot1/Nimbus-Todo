document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskModal = document.getElementById('task-modal');
    const listForm = document.getElementById('project-form');
    const listModal = document.getElementById('project-modal');
    const addTaskBtn = document.getElementById('add-task-btn');
    const addListBtn = document.getElementById('add-project');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const taskList = document.getElementById('task-list');
    const taskSearch = document.getElementById('task-search');
    const taskDetails = document.querySelector('.task-details');
    const closeDetailsBtn = document.querySelector('.close-details');
    const navLinks = document.querySelectorAll('.main-nav a');
    const listsList = document.getElementById('projects-list');
    const listSelect = document.getElementById('task-project');
    
    // Default lists data
    const defaultLists = [
        {
            id: 'personal',
            name: 'Personal',
            color: '#6366f1'
        },
        {
            id: 'work',
            name: 'Work',
            color: '#22c55e'
        },
        {
            id: 'shopping',
            name: 'Shopping',
            color: '#f59e0b'
        }
    ];
    
    // Default tasks data
    const defaultTasks = [
        {
            id: 1,
            title: 'Code Review',
            description: 'Review the latest pull request for the authentication feature',
            dueDate: '2024-04-22T14:00',
            priority: 'high',
            list: 'dev',
            tag: 'Dev',
            completed: false
        },
        {
            id: 2,
            title: 'Meetings with Ragazo Company',
            description: 'Discuss project requirements and timeline',
            dueDate: '2024-04-22T12:00',
            priority: 'medium',
            list: 'meetings',
            tag: 'Meeting',
            completed: false
        },
        {
            id: 3,
            title: 'Documenting on Github',
            description: 'Create a documentation for Github project that we have created a project with successfully, push it on them.',
            dueDate: '2024-04-22T09:30',
            priority: 'low',
            list: 'dev',
            tag: 'Dev',
            completed: false
        }
    ];
    
    // Load data from localStorage or use defaults
    let lists = loadFromLocalStorage('lists') || defaultLists;
    let tasks = loadFromLocalStorage('tasks') || defaultTasks;
    
    // Initialize the app
    function init() {
        renderLists();
        renderTasks();
        setupEventListeners();
        // Ensure task details panel is closed on page load
        taskDetails.classList.remove('open');
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                const section = this.textContent.trim();
                updateHeader(section);
                filterTasksBySection(section);
            });
        });
        
        // Task interactions
        taskList.addEventListener('click', handleTaskClick);
        
        // Task details panel
        closeDetailsBtn.addEventListener('click', () => {
            taskDetails.classList.remove('open');
        });
        
        // Search
        taskSearch.addEventListener('input', handleSearch);
        
        // Add task
        addTaskBtn.addEventListener('click', () => openModal(taskModal));
        
        // Add list
        addListBtn.addEventListener('click', () => openModal(listModal));
        
        // Close modals using X button
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                closeModal(modal);
            });
        });
        
        // Task form submission
        taskForm.addEventListener('submit', handleTaskSubmit);
        
        // List form submission
        listForm.addEventListener('submit', handleListSubmit);

        // List delete buttons
        listsList.addEventListener('click', handleListClick);
    }
    
    // Handle list clicks (including delete)
    function handleListClick(e) {
        const listItem = e.target.closest('li');
        if (!listItem) return;

        // Handle delete button click
        if (e.target.classList.contains('fa-times') || e.target.classList.contains('delete-project')) {
            e.preventDefault();
            e.stopPropagation();
            const listId = listItem.dataset.listId;
            deleteList(listId);
            return;
        }

        // Handle list selection
        e.preventDefault();
        const listId = listItem.dataset.listId;
        const listName = lists.find(l => l.id === listId)?.name;
        
        // Update active states
        document.querySelectorAll('#projects-list li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.main-nav li').forEach(li => li.classList.remove('active'));
        listItem.classList.add('active');
        
        // Update header and filter tasks
        updateHeader(listName);
        filterTasksBySection('list', listId);
    }

    // Delete a list
    function deleteList(listId) {
        if (confirm('Are you sure you want to delete this list? All associated tasks will be deleted.')) {
            // Delete all tasks associated with this list
            tasks = tasks.filter(task => task.list !== listId);
            
            // Remove the list
            lists = lists.filter(list => list.id !== listId);
            
            // Update UI
            renderLists();
            renderTasks();
            saveToLocalStorage('lists', lists);
            saveToLocalStorage('tasks', tasks);
        }
    }

    // Delete a task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            renderTasks();
            saveToLocalStorage('tasks', tasks);
            // Close task details panel if the deleted task was being viewed
            taskDetails.classList.remove('open');
        }
    }
    
    // Render lists in the sidebar and task form
    function renderLists() {
        // Update sidebar list
        listsList.innerHTML = lists.map(list => `
            <li data-list-id="${list.id}">
                <a href="#">
                    <i class="fas fa-circle" style="color: ${list.color};"></i>
                    ${list.name}
                    <button class="delete-project" title="Delete List">
                        <i class="fas fa-times"></i>
                    </button>
                </a>
            </li>
        `).join('');
        
        // Update task form list select
        listSelect.innerHTML = lists.map(list => `
            <option value="${list.id}">${list.name}</option>
        `).join('');
        
        // Save to localStorage
        saveToLocalStorage('lists', lists);
    }
    
    // Handle list form submission
    function handleListSubmit(e) {
        e.preventDefault();
        
        const listName = document.getElementById('project-name').value.trim();
        const listColor = document.getElementById('project-color').value;
        
        // Create new list
        const newList = {
            id: listName.toLowerCase().replace(/\s+/g, '-'),
            name: listName,
            color: listColor
        };
        
        // Add to lists array
        lists.push(newList);
        
        // Update UI and save
        renderLists();
        
        // Reset form and close modal
        listForm.reset();
        closeModal(listModal);
    }
    
    // Render tasks in the list
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-title">${task.title}</div>
                <div class="task-date">${formatDate(task.dueDate)}</div>
                <div class="task-priority priority-${task.priority}">${capitalizeFirst(task.priority)}</div>
                <div class="task-status">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <button class="favorite-task ${task.important ? 'active' : ''}" 
                            data-active="${task.important}" 
                            title="Mark as Important">
                        <i class="fa-${task.important ? 'solid' : 'regular'} fa-star" 
                           style="color: ${task.important ? '#f59e0b' : 'var(--secondary-color)'}"></i>
                    </button>
                    <button class="delete-task" title="Delete Task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Save to localStorage
        saveToLocalStorage('tasks', tasks);
    }
    
    // Handle task click
    function handleTaskClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        // Handle checkbox click
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(taskItem.dataset.taskId);
            toggleTaskComplete(taskId);
            return;
        }

        // Handle favorite button click
        if (e.target.closest('.favorite-task')) {
            const taskId = parseInt(taskItem.dataset.taskId);
            toggleTaskImportant(taskId);
            return;
        }

        // Handle delete button click
        if (e.target.closest('.delete-task')) {
            const taskId = parseInt(taskItem.dataset.taskId);
            deleteTask(taskId);
            return;
        }
        
        // Select task and show details
        document.querySelectorAll('.task-item').forEach(item => item.classList.remove('selected'));
        taskItem.classList.add('selected');
        
        const taskId = parseInt(taskItem.dataset.taskId);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            selectTask(task);
        }
    }
    
    // Select a task and show its details
    function selectTask(task) {
        taskDetails.classList.add('open');
        
        const detailsHtml = `
            <div class="task-details-header">
                <div>
                    <h2 class="task-details-title">${task.title}</h2>
                    <span class="task-tag">${task.tag}</span>
                </div>
                <button class="close-details">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="task-details-content">
                <div class="task-detail-section">
                    <span class="detail-label">Description</span>
                    <p class="task-description">${task.description}</p>
                </div>
                
                <div class="task-detail-section">
                    <span class="detail-label">Due Date</span>
                    <p class="detail-value">${formatDateLong(task.dueDate)}</p>
                </div>
                
                <div class="task-detail-section">
                    <span class="detail-label">Priority</span>
                    <div class="task-priority priority-${task.priority}">${capitalizeFirst(task.priority)}</div>
                </div>
            </div>
        `;
        
        taskDetails.innerHTML = detailsHtml;
        
        // Reattach close button event listener
        taskDetails.querySelector('.close-details').addEventListener('click', () => {
            taskDetails.classList.remove('open');
        });
    }
    
    // Toggle task complete status
    function toggleTaskComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            
            // Get current active section
            const activeSection = document.querySelector('.main-nav li.active a').textContent.trim();
            
            // Re-filter tasks based on current section
            filterTasksBySection(activeSection);
            
            // Save to localStorage
            saveToLocalStorage('tasks', tasks);
        }
    }
    
    // Toggle task important status
    function toggleTaskImportant(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.important = !task.important;
            
            // Get current active section
            const activeSection = document.querySelector('.main-nav li.active a').textContent.trim();
            
            // Re-filter tasks based on current section
            filterTasksBySection(activeSection);
            
            // Save to localStorage
            saveToLocalStorage('tasks', tasks);
        }
    }
    
    // Handle task search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
        renderTasks(filteredTasks);
    }
    
    // Handle new task submission
    function handleTaskSubmit(e) {
        e.preventDefault();
        
        const listId = document.getElementById('task-project').value;
        const list = lists.find(l => l.id === listId);
        
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            dueDate: document.getElementById('task-due-date').value,
            priority: document.getElementById('task-priority').value,
            list: listId,
            tag: list.name,
            completed: false,
            important: false
        };
        
        tasks.unshift(newTask);
        renderTasks();
        closeModal(taskModal);
        taskForm.reset();
    }
    
    // Update header based on selected section
    function updateHeader(section) {
        const pageTitle = document.querySelector('.page-title');
        if (section === 'Today') {
            const today = new Date();
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            pageTitle.textContent = today.toLocaleDateString('en-US', options);
        } else {
            pageTitle.textContent = section;
        }
    }
    
    // Filter tasks based on selected section
    function filterTasksBySection(section, listId = null) {
        let filteredTasks;
        
        switch(section) {
            case 'Completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            case 'Today':
                const today = new Date().toDateString();
                filteredTasks = tasks.filter(task => {
                    const taskDate = new Date(task.dueDate).toDateString();
                    return taskDate === today;
                });
                break;
            case 'Important':
                filteredTasks = tasks.filter(task => task.important);
                break;
            case 'list':
                filteredTasks = tasks.filter(task => task.list === listId);
                break;
            default: // Inbox and other sections
                filteredTasks = tasks;
        }
        
        renderTasks(filteredTasks);
    }
    
    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        return isToday
            ? `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
            : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    function formatDateLong(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // LocalStorage functions
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function loadFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    // Modal functions
    function openModal(modal) {
        modal.style.display = 'block';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
    
    // Initialize the app
    init();
});