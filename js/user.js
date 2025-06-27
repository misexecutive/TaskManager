const API_BASE = 'https://script.google.com/macros/s/AKfycbzV_Nk1Wd13kkYU8_Kzg5WPWEa40G5GYvrD90x6MNKn3EhcWtRP6T81aJea4zFZuRTy/exec';
let userEmail = '';

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  userEmail = data.email;
  document.getElementById('userName').textContent = data.name;
  loadTasks(userEmail);
}

async function loadTasks(email) {
  const res = await fetch(`${API_BASE}?action=getMyTasks&email=${email}`);
  const result = await res.json();

  if (result.status !== 'success') return;

  const container = document.getElementById('taskList');
  container.innerHTML = '';

  result.tasks.forEach(task => {
    const taskCard = document.createElement('div');
    taskCard.className = 'border p-4 rounded shadow';

    const statusColor =
      task.Status === 'On Time' ? 'text-green-600' :
      task.Status === 'Late' ? 'text-red-600' :
      'text-yellow-600';

    taskCard.innerHTML = `
      <h3 class="text-lg font-semibold mb-1">${task.Task}</h3>
      <p><strong>Planned:</strong> ${task['Planned Date']}</p>
      <p><strong>Status:</strong> <span class="${statusColor}">${task.Status}</span></p>
      ${task.Status === 'Pending' ? `<button class="mt-2 bg-blue-600 text-white px-3 py-1 rounded mark-btn"
        data-taskid="${task['Task ID']}"
        data-date="${task['Planned Date']}">Mark Done</button>` : ''}
    `;

    container.appendChild(taskCard);
  });

  document.querySelectorAll('.mark-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const taskID = btn.dataset.taskid;
      const date = btn.dataset.date;

      const params = new URLSearchParams({
        action: 'markTaskDone',
        email: userEmail,
        taskID: taskID,
        plannedDate: date
      });

      const res = await fetch(API_BASE, {
        method: 'POST',
        body: params
      });

      const data = await res.json();
      alert(data.message);
      loadTasks(userEmail); // refresh
    });
  });
}
