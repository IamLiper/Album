document.querySelectorAll('.menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

document.querySelector('.add-button').addEventListener('click', () => {
  document.getElementById('addModal').classList.remove('hidden');
});

document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('addModal').classList.add('hidden');
});

document.getElementById('themeToggle').addEventListener('change', (e) => {
  document.body.className = e.target.checked ? 'dark-mode' : 'light-mode';
});

// Toggle sidebar
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
});