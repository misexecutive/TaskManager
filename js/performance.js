const API_BASE = 'https://script.google.com/macros/s/AKfycbzV_Nk1Wd13kkYU8_Kzg5WPWEa40G5GYvrD90x6MNKn3EhcWtRP6T81aJea4zFZuRTy/exec';

let userEmail = ''; // This variable will be set from sessionStorage

/**
 * Initializes the performance page by retrieving the user's email from sessionStorage.
 * If no email is found, it redirects the user to the login page.
 * Otherwise, it loads the user's tasks and performance data.
 */

// The handleCredentialResponse function is removed as authentication and redirection
// are now handled exclusively by portal.js
// function handleCredentialResponse(response) { ... }

/**
 * Loads tasks assigned to the specified email.
 * @param {string} email The email of the user to load tasks for.
 */
async function loadTasks(email) {
  try {
    const res = await fetch(`${API_BASE}?action=getUserTasks&email=${email}`);
    const result = await res.json();

    if (result.status !== 'success') {
      console.error('Failed to load tasks:', result.message);
      return;
    }

    const container = document.getElementById('taskList');
    container.innerHTML = ''; // Clear previous tasks

// ... (inside loadTasks function)

    result.tasks.forEach(task => {
      const taskCard = document.createElement('div');
      taskCard.className = 'task-card'; // Changed from 'border p-4 rounded shadow'

      const statusColorClass =
        task.Status === 'On Time' ? 'status-on-time' :
        task.Status === 'Late' ? 'status-late' :
        'status-pending';

      taskCard.innerHTML = `
        <h3 class="text-lg font-semibold mb-1">${task.Task}</h3>
        <p><strong>Planned:</strong> ${task['Planned Date']}</p>
        <p><strong>Status:</strong> <span class="${statusColorClass}">${task.Status}</span></p>
        ${task.Status === 'Pending' ? `<button class="mark-btn"
          data-taskid="${task['Task ID']}"
          data-date="${task['Planned Date']}">Mark Done</button>` : ''}
      `;

      container.appendChild(taskCard);
    });

// ... (rest of the loadTasks function)
    // Attach event listeners to "Mark Done" buttons
    document.querySelectorAll('.mark-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const taskID = btn.dataset.taskid;
        const date = btn.dataset.date;
        await markTaskAsDone(taskID, date);
      });
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

/**
 * Loads performance statistics for the specified email.
 * @param {string} email The email of the user to load performance for.
 */
async function loadPerformance(email) {
  try {
    const res = await fetch(`${API_BASE}?action=getMyPerformance&email=${email}`);
    const data = await res.json();

    if (data.status !== 'success') {
      console.error('Failed to load performance data:', data.message);
      return;
    }

    document.getElementById('total').textContent = data.total;
    document.getElementById('onTime').textContent = data.onTime;
    document.getElementById('late').textContent = data.late;
    document.getElementById('pending').textContent = data.pending;
    document.getElementById('targetPercent').textContent = data.targetPercent;
    document.getElementById('achieved').textContent = data.achieved;

    const status = document.getElementById('statusMessage');
    if (data.achieved >= data.targetPercent) {
      status.textContent = "✅ Target Achieved!";
      status.classList.remove('text-red-700', 'text-yellow-600');
      status.classList.add('text-green-700');
    } else {
      status.textContent = "⚠️ Below Target";
      status.classList.remove('text-green-700', 'text-yellow-600');
      status.classList.add('text-red-700');
    }
  } catch (error) {
    console.error('Error loading performance:', error);
  }
}

/**
 * Marks a task as done for the current user.
 * @param {string} taskID The ID of the task to mark as done.
 * @param {string} date The planned date of the task.
 */
async function markTaskAsDone(taskID, date) {
  try {
    const params = new URLSearchParams({
      action: 'markTaskDone',
      email: userEmail, // Use the stored userEmail
      taskID: taskID,
      date: date
    });

    const res = await fetch(API_BASE, {
      method: 'POST',
      body: params
    });

    const result = await res.json();
    if (result.status === 'success') {
      alert('Task marked as done!'); // Use custom modal instead of alert in production
      loadTasks(userEmail); // Reload tasks to update status
      loadPerformance(userEmail); // Reload performance to update stats
    } else {
      console.error('Failed to mark task done:', result.message);
      alert('Failed to mark task done: ' + result.message); // Use custom modal
    }
  } catch (error) {
    console.error('Error marking task done:', error);
    alert('An error occurred while marking the task done.'); // Use custom modal
  }
}

async function initializePerformancePage() {
  userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName');

  if (!userEmail) {
    // If no user email, redirect to login page
    window.location.href = 'portal.html';
    return;
  }

  // Display user name
  document.getElementById('userName').textContent = userName || 'User';

  // Load tasks and performance for the authenticated user
  loadTasks(userEmail);
  loadPerformance(userEmail);
}


// Initial call to load data when the page loads
// This is now triggered by the onload event in performance.html body
// document.addEventListener('DOMContentLoaded', initializePerformancePage);
