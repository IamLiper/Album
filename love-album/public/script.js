const gallery = document.getElementById('gallery');

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('menu').classList.toggle('show');
});

document.getElementById('addButton').addEventListener('click', () => {
  document.getElementById('uploadForm').style.display = 'block';
  document.getElementById('uploadForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('mediaFile').files[0];
  const caption = document.getElementById('caption').value;

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

    loadGallery('todas');
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadForm').style.display = 'none';
  } catch {
    alert('Erro de conexão');
  }
});

function abrirConfiguracoes() {
  alert('Em breve: configurações!');
}

function filtrarMidias(tipo) {
  loadGallery(tipo);
  document.getElementById('menu').classList.remove('show');
}

async function loadGallery(filtro = 'todas') {
  try {
    const res = await fetch('https://album-backend-x8m1.onrender.com/media');
    const midias = await res.json();
    gallery.innerHTML = '';

    midias
      .filter((m) => filtro === 'todas' || m.type.startsWith(filtro))
      .forEach((m) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');

        if (m.type.startsWith('image')) {
          item.innerHTML = `<img src="${m.url}" alt="imagem"><p>${m.caption || ''}</p>`;
        } else if (m.type.startsWith('video')) {
          item.innerHTML = `<video controls><source src="${m.url}"></video><p>${m.caption || ''}</p>`;
        }
        gallery.appendChild(item);
      });
  } catch {
    gallery.innerHTML = '<p style="text-align:center; color:#ff69b4;">Erro ao carregar mídias.</p>';
  }
}

// Inicializa mostrando todas as mídias
loadGallery('todas');
