const loginForm = document.getElementById('loginForm');
const album = document.getElementById('album');
const loginScreen = document.getElementById('loginScreen');
const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
const menuToggle = document.querySelector('.hamburger');
const sideMenu = document.querySelector('.sideMenu');

const validUser1 = 'Luis';
const validUser2 = 'Ayla';
const validPassword = '123amor';

let todasMidias = [];

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
    album.style.display = 'block';
    loadGallery();
  } else {
    alert('Informações incorretas 🥺');
  }
});

menuToggle.addEventListener('click', () => {
  sideMenu.classList.toggle('hidden');
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

    uploadForm.reset();
    fecharUpload();
    loadGallery();
  } catch (error) {
    alert('Erro de conexão');
  }
});

function abrirUpload() {
  document.getElementById('uploadModal').classList.remove('hidden');
}

function fecharUpload() {
  document.getElementById('uploadModal').classList.add('hidden');
}

async function loadGallery() {
  const res = await fetch('https://album-backend-x8m1.onrender.com/midias');
  todasMidias = await res.json();
  renderGallery(todasMidias);
}

function renderGallery(lista) {
  gallery.innerHTML = '';
  lista.forEach((m) => {
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    if (m.type.startsWith('image')) {
      item.innerHTML = `<img src="${m.url}" alt="imagem"><p>${m.caption}</p>`;
    } else if (m.type.startsWith('video')) {
      item.innerHTML = `<video controls><source src="${m.url}"></video><p>${m.caption}</p>`;
    }
    gallery.appendChild(item);
  });
}

function filtrar(tipo) {
  if (tipo === 'todas') {
    renderGallery(todasMidias);
  } else {
    const filtradas = todasMidias.filter((m) => m.type.startsWith(tipo));
    renderGallery(filtradas);
  }
}
