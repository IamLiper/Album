// Alternar seções
const menuItems = document.querySelectorAll('.menu li');
const sections = document.querySelectorAll('.menu-section');
menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.section).classList.add('active');
  });
});

// Mostrar modal
const addBtn = document.getElementById('addMediaBtn');
const modal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
addBtn.addEventListener('click', () => modal.style.display = 'block');
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Upload
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const res = await fetch('https://album-backend-x8m1.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    alert('Enviado com sucesso!');
    modal.style.display = 'none';
    location.reload();
  } catch (err) {
    alert('Erro ao enviar mídia.');
  }
});

// Alternar tema claro/escuro
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Aplicar tema salvo
window.addEventListener('DOMContentLoaded', async () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  // Carregar mídias
  try {
    const res = await fetch('https://album-backend-x8m1.onrender.com/media');
    const data = await res.json();
    const all = document.getElementById('all');
    const photos = document.getElementById('photos');
    const videos = document.getElementById('videos');
    all.innerHTML = '';
    photos.innerHTML = '';
    videos.innerHTML = '';

    data.forEach((item) => {
      const element = document.createElement(item.type === 'image' ? 'img' : 'video');
      element.src = item.url;
      element.classList.add('media-item');
      element.controls = item.type !== 'image';
      element.style.maxWidth = '100%';
      element.style.borderRadius = '12px';
      element.style.marginBottom = '12px';

      all.appendChild(element.cloneNode(true));
      if (item.type === 'image') photos.appendChild(element.cloneNode(true));
      if (item.type === 'video') videos.appendChild(element.cloneNode(true));
    });
  } catch (err) {
    console.error('Erro ao carregar mídias:', err);
  }
});
