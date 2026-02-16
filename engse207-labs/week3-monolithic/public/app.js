// app.js - Frontend Logic
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: STATE MANAGEMENT
// ========================================

// TODO 1.1: Declare global variables for state
let allTasks = [];
let currentFilter = 'ALL';


// ========================================
// PART 2: DOM ELEMENTS
// ========================================

// TODO 2.1: Get references to DOM elements
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task list containers
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Task counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');


// ========================================
// PART 11: UTILITY FUNCTIONS
// ========================================

// TODO 11.1: Create utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}


// ========================================
// PART 10: HELPER FUNCTIONS - STATUS BUTTONS
// ========================================

// TODO 10.1: Create function to generate status buttons HTML
function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    
    // ปุ่มเปลี่ยนสถานะเป็น TODO: จะแสดงเมื่อสถานะปัจจุบันไม่ใช่ TODO
    if (currentStatus !== 'TODO') {
        buttons.push(`
            <button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← To Do
            </button>
        `);
    }
    
    // ปุ่มเปลี่ยนสถานะเป็น IN_PROGRESS: จะแสดงเมื่อสถานะปัจจุบันไม่ใช่ IN_PROGRESS
    if (currentStatus !== 'IN_PROGRESS') {
        const label = currentStatus === 'TODO' ? '→ In Progress' : '← In Progress';
        buttons.push(`
            <button class="btn btn-info btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                ${label}
            </button>
        `);
    }

    // ปุ่มเปลี่ยนสถานะเป็น DONE: จะแสดงเมื่อสถานะปัจจุบันไม่ใช่ DONE
    if (currentStatus !== 'DONE') {
        buttons.push(`
            <button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">
                → Done
            </button>
        `);
    }
    
    return buttons.join('');
}


// ========================================
// PART 9: RENDER FUNCTIONS - CREATE CARD
// ========================================

// TODO 9.1: Create function to create a task card element
function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    // ใช้ task.status ใน className เพื่อให้สี card ตามสถานะจริง
    card.className = `task-card status-${task.status.toLowerCase()}`; 
    
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            Created: ${formatDate(task.created_at)}
        </div>
        <div class="task-actions">
            ${createStatusButtons(task.id, task.status)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}


// ========================================
// PART 8: RENDER FUNCTIONS - RENDER LIST
// ========================================

// TODO 8.1: Create function to render a list of tasks
function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tasks yet</p></div>';
        return;
    }
    
    tasks.forEach(task => {
        const card = createTaskCard(task, task.status);
        container.appendChild(card);
    });
}


// ========================================
// PART 7: RENDER FUNCTIONS - MAIN RENDER
// ========================================

// TODO 7.1: Create function to render all tasks
function renderTasks() {
    // Clear all lists
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    // Filter tasks based on currentFilter
    let tasksToRender = allTasks;
    if (currentFilter !== 'ALL') {
        tasksToRender = allTasks.filter(task => task.status === currentFilter);
    }
    
    // Separate by status
    const todo = tasksToRender.filter(t => t.status === 'TODO');
    const progress = tasksToRender.filter(t => t.status === 'IN_PROGRESS');
    const done = tasksToRender.filter(t => t.status === 'DONE');
    
    // Update counters (นับจาก allTasks เพื่อแสดงจำนวนรวมทั้งหมดในแต่ละสถานะ)
    const totalTodo = allTasks.filter(t => t.status === 'TODO').length;
    const totalProgress = allTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const totalDone = allTasks.filter(t => t.status === 'DONE').length;

    todoCount.textContent = totalTodo;
    progressCount.textContent = totalProgress;
    doneCount.textContent = totalDone;
    
    // Render each column
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}


// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================

// TODO 3.1: Create async function to fetch all tasks from API
async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allTasks = data.tasks;
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please refresh the page.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 4: API FUNCTIONS - CREATE TASK
// ========================================

// TODO 4.1: Create async function to create a new task
async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        
        const data = await response.json();
        allTasks.unshift(data.task); // Add to beginning
        renderTasks();
        
        // Reset form
        addTaskForm.reset();
        
        alert('✅ Task created successfully!');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ Failed to create task. Please try again.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 5: API FUNCTIONS - UPDATE STATUS
// ========================================

// TODO 5.1: Create async function to update task status
async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update task status');
        }
        
        const data = await response.json();
        const updatedTask = data.task;

        // 3. Update task in the allTasks array
        const taskIndex = allTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            allTasks[taskIndex] = updatedTask; 
        }
        
        // 4. Call renderTasks()
        renderTasks();

    } catch (error) {
        console.error('Error updating task status:', error);
        alert('❌ Failed to update task status.');
    } finally {
        // 5. Hide loading overlay
        hideLoading();
    }
}


// ========================================
// PART 6: API FUNCTIONS - DELETE TASK
// ========================================

// TODO 6.1: Create async function to delete a task
async function deleteTask(taskId) {
    // 1. Confirm with user
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    try {
        // 3. DELETE to '/api/tasks/:id'
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        // 4. Remove task from allTasks array
        allTasks = allTasks.filter(t => t.id !== taskId);
        
        // 5. Call renderTasks()
        renderTasks();
        
        // 6. Show success message
        alert('🗑️ Task deleted successfully!');

    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ Failed to delete task. Please try again.');
    } finally {
        // 7. Hide loading overlay
        hideLoading();
    }
}


// ========================================
// PART 12: EVENT LISTENERS
// ========================================

// TODO 12.1: Add event listener for form submission
if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        createTask({ title, description, priority });
    });
}


// TODO 12.2: Add event listener for status filter
if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });
}


// ========================================
// PART 14: GLOBAL FUNCTION EXPOSURE
// ========================================

// TODO 14.1: Make functions globally accessible for inline event handlers
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;


// ========================================
// PART 13: INITIALIZATION
// ========================================

// TODO 13.1: Add DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Task Board App Initialized');
    console.log('📊 Architecture: Monolithic');
    // เริ่มต้นโหลดข้อมูล
    fetchTasks();
});