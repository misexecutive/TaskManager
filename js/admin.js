const API_BASE = 'https://script.google.com/macros/s/AKfycbzV_Nk1Wd13kkYU8_Kzg5WPWEa40G5GYvrD90x6MNKn3EhcWtRP6T81aJea4zFZuRTy/exec';

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'addEmployee',
    name: formData.get('name'),
    email: formData.get('email'),
    department: formData.get('department')
  });

  const res = await fetch(API_BASE, {
    method: 'POST',
    body: params
  });

  const result = await res.json();
  alert(result.message);
  e.target.reset();
  loadEmployees();
});

async function loadEmployees() {
  const res = await fetch(`${API_BASE}?action=getAllEmployees`);
  const data = await res.json();

  const tbody = document.getElementById('employeeTableBody');
  tbody.innerHTML = '';

  if (data.status === 'success') {
    data.employees.forEach(emp => {
      const row = `<tr>
        <td class="p-2 border">${emp.Name}</td>
        <td class="p-2 border">${emp.Email}</td>
        <td class="p-2 border">${emp.Department}</td>
      </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  }
}

document.addEventListener('DOMContentLoaded', loadEmployees);

document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'addTask',
    name: formData.get('name'),
    description: formData.get('description')
  });

  const res = await fetch(API_BASE, {
    method: 'POST',
    body: params
  });

  const result = await res.json();
  alert(result.message);
  e.target.reset();
  loadTasks();
});

async function loadTasks() {
  const res = await fetch(`${API_BASE}?action=getAllTasks`);
  const data = await res.json();

  const tbody = document.getElementById('taskTableBody');
  tbody.innerHTML = '';

  if (data.status === 'success') {
    data.tasks.forEach(task => {
      const row = `<tr>
        <td class="p-2 border">${task["Task ID"]}</td>
        <td class="p-2 border">${task["Task Name"]}</td>
        <td class="p-2 border">${task["Description"]}</td>
      </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  }
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadTasks();
});


document.getElementById('assignForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'assignTask',
    task: formData.get('task'),
    assignedTo: formData.get('assignedTo'),
    recurrence: formData.get('recurrence'),
    startDate: formData.get('startDate')
  });

  const res = await fetch(API_BASE, {
    method: 'POST',
    body: params
  });

  const result = await res.json();
  alert(result.message);
  e.target.reset();
});

// Populate task and employee dropdowns
async function populateDropdowns() {
  // Populate task dropdown
  const taskRes = await fetch(`${API_BASE}?action=getAllTasks`);
  const taskData = await taskRes.json();
  const taskDropdown = document.getElementById('taskDropdown');
  taskDropdown.innerHTML = '';
  if (taskData.status === 'success') {
    taskData.tasks.forEach(task => {
      const opt = document.createElement('option');
      opt.value = task["Task ID"];
      opt.textContent = `${task["Task ID"]} - ${task["Task Name"]}`;
      taskDropdown.appendChild(opt);
    });
  }

  // Populate employee dropdown
  const empRes = await fetch(`${API_BASE}?action=getAllEmployees`);
  const empData = await empRes.json();
  const empDropdown = document.getElementById('employeeDropdown');
  empDropdown.innerHTML = '';
  if (empData.status === 'success') {
    empData.employees.forEach(emp => {
      const opt = document.createElement('option');
      opt.value = emp.Email;
      opt.textContent = `${emp.Name} (${emp.Email})`;
      empDropdown.appendChild(opt);
    });
  }
}

// Call dropdown population on page load
document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadTasks();
  populateDropdowns();
});
