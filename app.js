// Fetch tasks on window loading
window.onload = function () {
    fetchTasks();
};

// GET/READ all tasks
function fetchTasks() {
    fetch('http://localhost:5000/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';  

            tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="task-item">
                    <span class="task-description">${task.title}</span>
                    <input type="checkbox" id="check-task${task.id}" name="task${task.id}" ${task.completed ? 'checked' : ''}>
                    <button class="edit-btn" onclick="editTask(${task.id}, '${task.title}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;

                // Checkbox event listener function call
                const checkbox = li.querySelector(`#check-task${task.id}`);
                checkbox.addEventListener('change', () => {
                    updateCheckbox(task.id, checkbox.checked);
                });

                taskList.appendChild(li);
            });
        });
}

// Function to PATCH/UPDATE checkbox
function updateCheckbox(id, isCompleted) {
    fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({completed: isCompleted})
    })
    .then(response => response.json())
}

// POST/CREATE task
function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskTitle = taskInput.value;

    if (taskTitle.trim() === '') {
        alert('Task cannot be empty!');
        return;
    }

    fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: taskTitle })
    }).then(response => response.json())
    .then(() => {
        taskInput.value = ''; 
        fetchTasks(); 
    });
}

// DELETE task
function deleteTask(id) {
    fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
    }).then(() => {
        fetchTasks();
    });
}

// PATCH/UPDATE task
function editTask(id, currentTitle) {
    const newTitle = prompt("Edit This Task:", currentTitle);  

    if (newTitle && newTitle.trim() !== currentTitle.trim()) { 
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        }).then(() => {
            fetchTasks(); 
        });
    }
}