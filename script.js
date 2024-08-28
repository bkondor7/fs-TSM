document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const priorityFilter = document.getElementById('priority-filter');

  const loadTasks = async () => {
      const response = await fetch('/api/tasks');
      const tasks = await response.json();
      displayTasks(tasks);
  };

  const displayTasks = (tasks) => {
      taskList.innerHTML = '';
      tasks.forEach(task => {
          const li = document.createElement('li');
          li.classList.add('task-item');
          li.innerHTML = `
              <div>
                  <span class="task-name">${task.name}</span>
                  <span class="task-category">${task.category}</span>
                  <span class="task-priority">${task.priority}</span>
                  <span class="task-due-date">${task.dueDate}</span>
              </div>
              <button class="delete-btn" data-id="${task.id}">Delete</button>
          `;
          taskList.appendChild(li);
      });

      // Attach delete event listeners
      document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', async (e) => {
              const taskId = e.target.getAttribute('data-id');
              await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
              loadTasks();
          });
      });
  };

  taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('task-input').value;
      const category = document.getElementById('category-select').value;
      const dueDate = document.getElementById('due-date').value;
      const priority = document.getElementById('priority-select').value;

      const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, category, dueDate, priority })
      });

      if (response.ok) {
          loadTasks();
          taskForm.reset();
      }
  });

  searchInput.addEventListener('input', async () => {
      const query = searchInput.value;
      const category = categoryFilter.value;
      const priority = priorityFilter.value;
      const response = await fetch(`/api/tasks?query=${query}&category=${category}&priority=${priority}`);
      const tasks = await response.json();
      displayTasks(tasks);
  });

  categoryFilter.addEventListener('change', () => searchInput.dispatchEvent(new Event('input')));
  priorityFilter.addEventListener('change', () => searchInput.dispatchEvent(new Event('input')));

  loadTasks();
});
