import './style.css'

// State management
let tempTodos = []; // Temporary holding for animations
const STORAGE_KEY = 'todo-app-data';

// DOM Elements
const form = document.querySelector('.input-container');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const addBtn = document.getElementById('add-btn');

// Load data from LocalStorage
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse todos', e);
      return [];
    }
  }
  return [];
}

// Save data to LocalStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

// Render a single todo item
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  // Custom checkbox
  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox-visual';
  checkbox.addEventListener('click', () => toggleTodo(todo.id));

  // Text content
  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;
  span.addEventListener('click', () => toggleTodo(todo.id));

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
  `;
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTodo(todo.id);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// Render all todos
function render() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    todos.forEach(todo => {
      todoList.appendChild(createTodoElement(todo));
    });
  }
}

// Add new todo
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.unshift(newTodo);
  saveTodos(todos);
  render();

  // Animation for new item (optional enhancement could go here)
}

// Toggle todo completion
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  // Sort: active first, then completed? Or keep order? 
  // Let's keep order for now to avoid jumping around.
  // Actually, users might prefer completed items to move to bottom or stay.
  // We'll keep them in place for simplicity and predictable UI.

  saveTodos(todos);
  render();
}

// Delete todo
function deleteTodo(id) {
  const el = document.querySelector(`li[data-id="${id}"]`);
  if (el) {
    // Animate removal
    el.style.transform = 'translateX(100px)';
    el.style.opacity = '0';

    setTimeout(() => {
      todos = todos.filter(t => t.id !== id);
      saveTodos(todos);
      render();
    }, 300);
  } else {
    todos = todos.filter(t => t.id !== id);
    saveTodos(todos);
    render();
  }
}

// Event Listeners
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const text = input.value.trim();
    if (text) {
      addTodo(text);
      input.value = '';
    }
  }
});

// Initial render
render();
