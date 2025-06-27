const API_BASE = 'https://script.google.com/macros/s/AKfycbzV_Nk1Wd13kkYU8_Kzg5WPWEa40G5GYvrD90x6MNKn3EhcWtRP6T81aJea4zFZuRTy/exec';

let adminUserEmail = ''; // This variable will store the admin's email

/**
 * Initializes the admin page.
 * It retrieves the user's email from sessionStorage and verifies their role.
 * If not an admin, it redirects them to the portal.
 * Otherwise, it loads all necessary admin data.
 */
async function initializeAdminPage() {
  adminUserEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName');

  if (!adminUserEmail) {
    // If no user email, redirect to login page
    window.location.href = 'portal.html';
    return;
  }

  // Verify if the logged-in user is an Admin
  try {
    const res = await fetch(`${API_BASE}?action=getUserRole&email=${adminUserEmail}`);
    const result = await res.json();

    if (result.status === 'success' && result.role === 'Admin') {
      // Display admin user name
      document.getElementById('userName').textContent = userName || 'Admin';
      // Load all admin-specific data
      loadEmployees();
      loadTasks();
      populateDropdowns();
      loadGlobalPerformance();
    } else {
      // If not an admin, redirect to user portal or login
      window.location.href = 'performance.html'; // Or 'portal.html' if unauthorized access is not allowed at all
      alert('Access Denied: You are not authorized to view this page.'); // Use custom modal
    }
  } catch (error) {
    console.error('Error verifying admin role:', error);
    window.location.href = 'portal.html'; // Redirect to login on error
    alert('An error occurred during authorization. Please try again.'); // Use custom modal
  }
}

// Event listener for adding a new employee
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'addEmployee',
    name: formData.get('name'),
    email: formData.get('email'),
    department: formData.get('department')
  });

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: params
    });

    const result = await res.json();
    // Replace alert with a custom message box
    alert(result.message); // Use custom modal
    e.target.reset();
    loadEmployees(); // Reload employee list
    populateDropdowns(); // Update employee dropdown
  } catch (error) {
    console.error('Error adding employee:', error);
    alert('An error occurred while adding the employee.'); // Use custom modal
  }
});

/**
 * Loads all employees and populates the employee table.
 */
async function loadEmployees() {
  try {
    const res = await fetch(`${API_BASE}?action=getAllEmployees`);
    const data = await res.json();

    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    if (data.status === 'success') {
      data.employees.forEach(emp => {
        const row = `<tr>
          <td class="p-2 border">${emp.Name}</td>
          <td class="p-2 border">${emp.Email}</td>
          <td class="p-2 border">${emp.Department}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    } else {
      console.error('Failed to load employees:', data.message);
    }
  } catch (error) {
    console.error('Error loading employees:', error);
  }
}

// Event listener for adding a new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'addTask',
    name: formData.get('name'),
    description: formData.get('description')
  });

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: params
    });

    const result = await res.json();
    alert(result.message); // Use custom modal
    e.target.reset();
    loadTasks(); // Reload task list
    populateDropdowns(); // Update task dropdown
  } catch (error) {
    console.error('Error adding task:', error);
    alert('An error occurred while adding the task.'); // Use custom modal
  }
});

/**
 * Loads all tasks and populates the task table.
 */
async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}?action=getAllTasks`);
    const data = await res.json();

    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    if (data.status === 'success') {
      data.tasks.forEach(task => {
        const row = `<tr>
          <td class="p-2 border">${task["Task ID"]}</td>
          <td class="p-2 border">${task["Task Name"]}</td>
          <td class="p-2 border">${task["Description"]}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    } else {
      console.error('Failed to load tasks:', data.message);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Event listener for assigning a task
document.getElementById('assignForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams({
    action: 'assignTask',
    task: formData.get('task'), // Fixed: changed from 'taskID' to 'task'
    assignedTo: formData.get('assignedTo'), // Fixed: changed from 'assignedToEmail' to 'assignedTo'
    recurrence: formData.get('recurrence'),
    startDate: formData.get('startDate')
  });

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: params
    });

    const result = await res.json();
    alert(result.message); // Use custom modal
    e.target.reset();
  } catch (error) {
    console.error('Error assigning task:', error);
    alert('An error occurred while assigning the task.'); // Use custom modal
  }
});

/**
 * Populates the task and employee dropdowns for the assign task form.
 */
async function populateDropdowns() {
  try {
    // Populate task dropdown
    const taskRes = await fetch(`${API_BASE}?action=getAllTasks`);
    const taskData = await taskRes.json();
    const taskDropdown = document.getElementById('taskDropdown');
    taskDropdown.innerHTML = '<option value="">Select Task</option>'; // Add a default option
    if (taskData.status === 'success') {
      taskData.tasks.forEach(task => {
        const opt = document.createElement('option');
        opt.value = task["Task ID"];
        opt.textContent = `${task["Task ID"]} - ${task["Task Name"]}`;
        taskDropdown.appendChild(opt);
      });
    } else {
      console.error('Failed to load tasks for dropdown:', taskData.message);
    }

    // Populate employee dropdown
    const empRes = await fetch(`${API_BASE}?action=getAllEmployees`);
    const empData = await empRes.json();
    const empDropdown = document.getElementById('employeeDropdown');
    empDropdown.innerHTML = '<option value="">Select Employee</option>'; // Add a default option
    if (empData.status === 'success') {
      empData.employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.Email;
        opt.textContent = `${emp.Name} (${emp.Email})`;
        empDropdown.appendChild(opt);
      });
    } else {
      console.error('Failed to load employees for dropdown:', empData.message);
    }
  } catch (error) {
    console.error('Error populating dropdowns:', error);
  }
}

/**
 * Loads global performance statistics.
 * Fixed to handle the summary array structure returned by backend.
 */
async function loadGlobalPerformance() {
  try {
    const res = await fetch(`${API_BASE}?action=getStatsAll`);
    const data = await res.json();

    if (data.status === 'success' && data.summary) {
      // Calculate totals from summary array
      const totals = data.summary.reduce((acc, user) => ({
        total: acc.total + (user.total || 0),
        onTime: acc.onTime + (user.onTime || 0),
        late: acc.late + (user.late || 0),
        pending: acc.pending + (user.pending || 0)
      }), { total: 0, onTime: 0, late: 0, pending: 0 });

      document.getElementById('globalTotal').textContent = totals.total;
      document.getElementById('globalOnTime').textContent = totals.onTime;
      document.getElementById('globalLate').textContent = totals.late;
      document.getElementById('globalPending').textContent = totals.pending;
    } else {
      console.error('Failed to load global performance stats:', data.message);
      // Show zero values instead of error
      document.getElementById('globalTotal').textContent = '0';
      document.getElementById('globalOnTime').textContent = '0';
      document.getElementById('globalLate').textContent = '0';
      document.getElementById('globalPending').textContent = '0';
    }
  } catch (error) {
    console.error('Error fetching global performance stats:', error);
    document.getElementById('globalTotal').textContent = 'Error';
    document.getElementById('globalOnTime').textContent = 'Error';
    document.getElementById('globalLate').textContent = 'Error';
    document.getElementById('globalPending').textContent = 'Error';
  }
}

/**
 * Loads filtered performance statistics based on user inputs.
 * This function can be called when implementing advanced filtering features.
 */
async function loadFilteredStats(filters = {}) {
  try {
    const params = new URLSearchParams({
      action: 'getFilteredStats',
      ...filters
    });

    const res = await fetch(`${API_BASE}?${params}`);
    const data = await res.json();

    if (data.status === 'success') {
      return data.data; // Return the filtered statistics
    } else {
      console.error('Failed to load filtered stats:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching filtered stats:', error);
    return [];
  }
}

// The document.addEventListener('DOMContentLoaded') calls are replaced by initializeAdminPage
// which is called by the onload event on the body tag.
// document.addEventListener('DOMContentLoaded', () => {
//   loadEmployees();
//   loadTasks();
//   populateDropdowns();
// });
