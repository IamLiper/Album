const loginForm = document.getElementById('loginForm');
const album = document.getElementById('album');
const loginScreen = document.getElementById('loginScreen');
const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const addMediaBtn = document.getElementById('addMediaBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

const validUser1 = 'Luis';
const validUser2 = 'Ayla';
const validPassword = '123amor';

let allMedia = [];

loginForm.addEventListener('submit', async function (e) {
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
    album.style.display = 'block';
    await loadGallery();
    setActiveTab('all');
  } else {
    alert('Informações incorretas 🥺');
  }
});

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

document.querySelectorAll('.sidebar li').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sidebar li').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    filterGallery(tab.dataset.tab);
    sidebar.classList.remove('open');
  });
});

addMediaBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
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

    modal.classList.add('hidden');
    uploadForm.reset();
    await loadGallery();
    setActiveTab('all');
  } catch (error) {
    alert('Erro de conexão');
  }
});

async function loadGallery() {
  const res = await fetch('https://album-backend-x8m1.onrender.com/media');
  allMedia = await res.json();
  renderGallery(allMedia);
}

function renderGallery(mediaList) {
  gallery.innerHTML = '';
  mediaList.forEach((m) => {
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    if (m.type.startsWith('image')) {
      item.innerHTML = `<img src="${m.url}" alt="imagem"><p>${m.caption || ''}</p>`;
    } else if (m.type.startsWith('video')) {
      item.innerHTML = `<video controls><source src="${m.url}"></video><p>${m.caption || ''}</p>`;
    }

    gallery.appendChild(item);
  });
}

function filterGallery(tab) {
  if (tab === 'photos') {
    renderGallery(allMedia.filter((m) => m.type.startsWith('image')));
  } else if (tab === 'videos') {
    renderGallery(allMedia.filter((m) => m.type.startsWith('video')));
  } else {
    renderGallery(allMedia);
  }
}

function setActiveTab(tabId) {
  document.querySelectorAll('.sidebar li').forEach((tab) => {
    if (tab.dataset.tab === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  filterGallery(tabId);
}
