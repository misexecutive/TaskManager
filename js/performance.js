const API = 'https://script.google.com/macros/s/AKfycbzV_Nk1Wd13kkYU8_Kzg5WPWEa40G5GYvrD90x6MNKn3EhcWtRP6T81aJea4zFZuRTy/exec';
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
