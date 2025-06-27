const API = 'https://script.google.com/macros/s/AKfycbyXqpKEvkGqZcTVXvoSBRBl1EI-j5UkODqSlUqgeKjPlIoOddnB3uHM7eGQTce_cwRW/exec';
let userEmail = '';

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  userEmail = data.email;
  document.getElementById('userName').textContent = data.name;
  loadPerformance(userEmail);
}

async function loadPerformance(email) {
  const res = await fetch(`${API}?action=getMyPerformance&email=${email}`);
  const data = await res.json();

  if (data.status !== 'success') return;

  document.getElementById('total').textContent = data.total;
  document.getElementById('onTime').textContent = data.onTime;
  document.getElementById('late').textContent = data.late;
  document.getElementById('pending').textContent = data.pending;
  document.getElementById('targetPercent').textContent = data.targetPercent;
  document.getElementById('achieved').textContent = data.achieved;

  const status = document.getElementById('statusMessage');
  if (data.achieved >= data.targetPercent) {
    status.textContent = "✅ Target Achieved!";
    status.classList.add('text-green-700');
  } else {
    status.textContent = "⚠️ Below Target";
    status.classList.add('text-red-700');
  }
}
