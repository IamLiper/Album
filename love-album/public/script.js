const loginForm = document.getElementById('loginForm');
const album = document.getElementById('album');
const loginScreen = document.getElementById('loginScreen');
const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
const uploadModal = document.getElementById('uploadModal');
const addButton = document.getElementById('addButton');
const closeModal = document.getElementById('closeModal');
const menuToggle = document.getElementById('menuToggle');
const menuOptions = document.getElementById('menuOptions');
const toggleTheme = document.getElementById('toggleTheme');
const modalOverlay = document.getElementById('modalOverlay');

const validUser1 = 'Luis';
const validUser2 = 'Ayla';
const validPassword = '123amor';

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  menuOptions.classList.toggle('hidden');
});

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const u1 = document.getElementById('user1').value.trim();
  const u2 = document.getElementById('user2').value.trim();
  const pw = document.getElementById('password').value;

  if (
    u1.toLowerCase() === validUser1.toLowerCase() &&
    u2.toLowerCase() === validUser2.toLowerCase() &&
    pw === validPassword
  ) {
    loginScreen.style.display = 'none';
    album.style.display = 'flex';
    loadGallery();
  } else {
    alert('Informações incorretas 🥺');
  }
});

uploadForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const file = document.getElementById('mediaInput').files[0];
  const caption = document.getElementById('caption').value;

  if (!file) {
    alert('Por favor, selecione um arquivo!');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('caption', caption);

  try {
    const res = await fetch('https://album-backend-x8m1.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      alert('Erro ao enviar mídia');
      return;
    }

    uploadModal.classList.add('hidden');
    uploadForm.reset();
    loadGallery();
  } catch (error) {
    alert('Erro de conexão');
  }
});

addButton.addEventListener('click', () => {
  uploadModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  uploadModal.classList.add('hidden');
});

async function loadGallery() {
  try {
    const res = await fetch('https://album-backend-x8m1.onrender.com/midias');
    const midias = await res.json();
    gallery.innerHTML = '';

    midias.forEach((m) => {
      const item = document.createElement('div');
      item.classList.add('gallery-item');

      if (m.type.startsWith('image')) {
        item.innerHTML = `<img src="${m.url}" alt="imagem"><p>${m.caption}</p>`;
      } else if (m.type.startsWith('video')) {
        item.innerHTML = `<video controls><source src="${m.url}"></video><p>${m.caption}</p>`;
      }

      gallery.appendChild(item);
    });
  } catch (err) {
    console.error('Erro ao carregar galeria', err);
  }
}

addButton.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

// Fecha o modal clicando fora da caixa
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});
