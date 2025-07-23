const loginForm = document.getElementById('loginForm');
const album = document.getElementById('album');
const loginScreen = document.getElementById('loginScreen');
const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');

const validUser1 = 'Luis';
const validUser2 = 'Ayla';
const validPassword = '123amor';

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

uploadForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const file = document.getElementById('mediaInput').files[0];
  const caption = document.getElementById('caption').value;

  if (!file) {
    alert('Por favor, selecione um arquivo!');
    return;
  }

  const formData = new FormData();
  formData.append('media', file); // ⚠️ nome 'file' deve bater com backend
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
    loadGallery();
  } catch (error) {
    alert('Erro de conexão');
  }
});

async function loadGallery() {
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
}
