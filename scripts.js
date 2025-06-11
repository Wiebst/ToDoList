const taskForm = document.querySelector("form")
const taskInput = document.getElementById("taskInput")
const activeTasksList = document.getElementById("activeTasks")
const completedTasksList = document.getElementById("completedTasks")
const allTasksList = document.getElementById("allTasks")
const TASKS_STORAGE_KEY = 'tasks';

let activeTasks = [];
let completedTasks = [];
let allTasks = [];

window.addEventListener('load', loadTasks);

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTask();
})

activeTasksList.addEventListener('click', deleteTask);
completedTasksList.addEventListener('click', deleteTask);

activeTasksList.addEventListener('change', markTaskAsCompleted);

function updateTaskList() {
    activeTasksList.innerHTML = "";
    activeTasks.forEach((task, taskIndex)=>{
        activeTask = createTaskItem(task, taskIndex);
        activeTasksList.append(activeTask);
    })

    completedTasksList.innerHTML = "";
    completedTasks.forEach((task, taskIndex)=>{
        completedlTask = createTaskItem(task, taskIndex);
        completedTasksList.append(completedlTask);
    })

    allTasksList.innerHTML = "";
    allTasks.forEach((task, taskIndex)=>{
        generalTask = createTaskItem(task, taskIndex);
        allTasksList.append(generalTask);
    })
}

function createTaskItem(task, taskIndex) {
    const taskId = "task" + taskIndex;
    const newTask = document.createElement("li");
    newTask.className = "task";
    newTask.innerHTML = `
                    <input type="checkbox" id="${taskId}">
                    <label for="${taskId}" class="taskContent">
                       ${task}     
                    </label>
                    <button class="deleteButton">𐤕</button>`
    return newTask;
}

function addTask() {
    const taskContent = taskInput.value.trim();
    if(taskContent.length > 0) {
        activeTasks.push(taskContent);
        allTasks.push(taskContent);
        createTaskItem(taskContent);
        updateTaskList();
        taskInput.value = "";
    }
    saveTasksToStorage()
}

function markTaskAsCompleted(event) {
    const checkbox = event.target;
    if (checkbox.type === 'checkbox' && checkbox.checked) {
        const markedTask = checkbox.closest('li');

        const label = markedTask.querySelector('label.taskContent');
        const taskText = label.textContent.trim();

        const activeIndex = activeTasks.indexOf(taskText);
        if (activeIndex > -1) {
            activeTasks.splice(activeIndex, 1);
        }

        if (!completedTasks.includes(taskText)) {
            completedTasks.push(taskText);
        }

        updateTaskList();
    }
    saveTasksToStorage()
}

function deleteTask(event) {
    const target = event.target;
    if (target.classList.contains('deleteButton')) {
        const taskItem = target.closest('li');

        const label = taskItem.querySelector('label.taskContent');
        const taskText = label.textContent.trim();

        const activeIndex = activeTasks.indexOf(taskText);
        if (activeIndex > -1) {
            activeTasks.splice(activeIndex, 1);
        }

        const completedIndex = completedTasks.indexOf(taskText);
        if (completedIndex > -1) {
            completedTasks.splice(completedIndex, 1);
        }

        const allIndex = allTasks.indexOf(taskText);
        if (allIndex > -1) {
            allTasks.splice(allIndex, 1);
        }

        updateTaskList();
    }
    saveTasksToStorage()
}

async function fetchTasks() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');

        if (response.ok == false) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data));
        return data;
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

function renderTasks(tasks) {
    activeTasks = [];
    completedTasks = [];
    allTasks = [];

    tasks.forEach(task => {
        allTasks.push(task.title);
        if (task.completed) {
            completedTasks.push(task.title);
        } else {
            activeTasks.push(task.title);
        }
    });
    updateTaskList();
}

async function loadTasks() {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        renderTasks(tasks);
        } 
        else {
            const tasks = await fetchTasks();
        if (tasks) {
            renderTasks(tasks);
        } 
        else {
            document.getElementById('tasks').innerText = 'Error';
        }
    }
}

function saveTasksToStorage() {
    const tasksToSave = [];

    activeTasks.forEach(title => {
        tasksToSave.push({ title, completed: false });
    });

    completedTasks.forEach(title => {
        tasksToSave.push({ title, completed: true });
    });

    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksToSave));
}
