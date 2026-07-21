const form            = document.getElementById('todo-form');
const input            = document.getElementById('todo-input');
const todoList         = document.getElementById('todo-list');
const itemsLeftText    = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterButtons    = document.querySelectorAll('.filter-btn');
const themeToggleBtn   = document.getElementById('themeToggleBtn');
const themeIcon        = document.getElementById('themeIcon'); 

let currentFilter = 'all';

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;

  createTodoItem(text, false);
  input.value = '';
  updateItemsLeft();
});

function createTodoItem(text, isCompleted) {
  const row = document.createElement('div');
  row.className = 'todo-row flex items-center gap-4 px-5 py-4 border-b border-[#393a4b] group';
  row.draggable = true; 

  const checkbox = document.createElement('button');
  checkbox.className = 'checkbox w-5 h-5 rounded-full border-2 border-[#777990] hover:border-[#55DDFF] shrink-0 flex items-center justify-center';

  const label = document.createElement('span');
  label.className = 'flex-1 text-[#c8cbe7]';
  label.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn text-[#777990] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity';
  deleteBtn.textContent = '✕';

  row.appendChild(checkbox);
  row.appendChild(label);
  row.appendChild(deleteBtn);
  todoList.appendChild(row);

  if (isCompleted) markCompleted(row, label, checkbox);

  checkbox.addEventListener('click', function () {
    const isNowCompleted = row.dataset.completed === 'true';
    if (isNowCompleted) {
      markActive(row, label, checkbox);
    } else {
      markCompleted(row, label, checkbox);
    }
    updateItemsLeft();
  });

  deleteBtn.addEventListener('click', function () {
    row.remove(); 
    updateItemsLeft();
  });

  attachDragEvents(row);
}

function markCompleted(row, label, checkbox) {
  row.dataset.completed = 'true';
  label.classList.add('line-through', 'text-[#777990]');
  checkbox.classList.add('bg-gradient-to-br', 'from-[#55DDFF]', 'to-[#C058F3]', 'border-none');
  checkbox.textContent = '✓';
  checkbox.classList.add('text-white', 'text-xs');
  applyFilterToRow(row);
}

function markActive(row, label, checkbox) {
  row.dataset.completed = 'false';
  label.classList.remove('line-through', 'text-[#777990]');
  checkbox.classList.remove('bg-gradient-to-br', 'from-[#55DDFF]', 'to-[#C058F3]', 'border-none', 'text-white', 'text-xs');
  checkbox.textContent = '';
  applyFilterToRow(row);
}

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove('text-[#3A7CFD]');
      btn.classList.add('text-[#777990]');
    });
    button.classList.remove('text-[#777990]');
    button.classList.add('text-[#3A7CFD]');

    document.querySelectorAll('.todo-row').forEach(applyFilterToRow);
  });
});

function applyFilterToRow(row) {
  const isCompleted = row.dataset.completed === 'true';
  let shouldShow = true;

  if (currentFilter === 'active') shouldShow = !isCompleted;
  if (currentFilter === 'completed') shouldShow = isCompleted;

  row.style.display = shouldShow ? 'flex' : 'none';
}

clearCompletedBtn.addEventListener('click', function () {
  document.querySelectorAll('.todo-row').forEach(function (row) {
    if (row.dataset.completed === 'true') {
      row.remove();
    }
  });
  updateItemsLeft();
});

function updateItemsLeft() {
  const allRows = document.querySelectorAll('.todo-row');
  let count = 0;
  allRows.forEach(function (row) {
    if (row.dataset.completed !== 'true') count++;
  });
  itemsLeftText.textContent = count + (count === 1 ? ' item left' : ' items left');
}

let isDarkMode = true;

themeToggleBtn.addEventListener('click', function () {
  isDarkMode = !isDarkMode;

  themeIcon.src = isDarkMode ? 'images/icon-sun.svg' : 'images/icon-moon.svg';

  document.body.classList.toggle('bg-[#171823]', isDarkMode);
  document.body.classList.toggle('bg-[#FAFAFA]', !isDarkMode);

  document.querySelectorAll('.theme-card').forEach(function (card) {
    card.classList.toggle('bg-[#25273c]', isDarkMode);
    card.classList.toggle('bg-white', !isDarkMode);
  });
});

let draggedRow = null;

function attachDragEvents(row) {
  row.addEventListener('dragstart', function () {
    draggedRow = row;
    row.classList.add('opacity-40');
  });

  row.addEventListener('dragend', function () {
    row.classList.remove('opacity-40');
    draggedRow = null;
  });

  row.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  row.addEventListener('drop', function (event) {
    event.preventDefault();
    if (draggedRow === null || draggedRow === row) return;

    todoList.insertBefore(draggedRow, row);
  });
}

createTodoItem('Complete online JavaScript course', true);
createTodoItem('Jog around the park 3x', false);
createTodoItem('10 minutes meditation', false);
updateItemsLeft();