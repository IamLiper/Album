require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('./cloudinary-config');
const app = express();

// Usando memória para armazenar o upload temporariamente
const upload = multer({ storage: multer.memoryStorage() });

let galeria = [];

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const caption = req.body.caption;

    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo recebido.' });
    }

    // Upload para Cloudinary usando upload_stream para buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'album_casal',
      },
      (error, result) => {
        if (error) {
          console.error('Erro no upload:', error);
          return res.status(500).json({ error });
        }

        const midia = {
          url: result.secure_url,
          type: result.resource_type,
          caption,
          createdAt: Date.now(),
        };

        galeria.unshift(midia);
        res.json({ success: true, midia });
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/midias', (req, res) => {
  res.json(galeria);
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
