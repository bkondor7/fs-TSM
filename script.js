// script.js

document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
  
    fetchTasks();
  
    // Add event listener to form
    taskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = taskInput.value;
      if (title.trim()) {
        addTask(title);
        taskInput.value = '';
      }
    });
  
    // Add task function
    async function addTask(title) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title })
        });
        const task = await response.json();
        createTaskElement(task);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    // Fetch tasks function
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        tasks.forEach(task => createTaskElement(task));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    // Create task element function
    function createTaskElement(task) {
      const li = document.createElement('li');
      li.dataset.id = task._id;
      li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
        <button class="toggle-btn">${task.completed ? 'Undo' : 'Done'}</button>
        <button class="delete-btn">Delete</button>
      `;
      taskList.appendChild(li);
  
      const toggleBtn = li.querySelector('.toggle-btn');
      const deleteBtn = li.querySelector('.delete-btn');
  
      toggleBtn.addEventListener('click', async function () {
        try {
          const response = await fetch(`/api/tasks/${task._id}`, {
            method: 'PUT'
          });
          const updatedTask = await response.json();
          li.querySelector('span').classList.toggle('completed');
          toggleBtn.textContent = updatedTask.completed ? 'Undo' : 'Done';
        } catch (error) {
          console.error('Error:', error);
        }
      });
  
      deleteBtn.addEventListener('click', async function () {
        try {
          await fetch(`/api/tasks/${task._id}`, {
            method: 'DELETE'
          });
          li.remove();
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
  });
  