require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload de imagem ou vídeo
app.post('/upload', upload.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo não enviado.' });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'album-do-casal', // Pasta compartilhada
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Erro ao fazer upload.', error });
        }
        return res.json({ url: result.secure_url, type: result.resource_type });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err });
  }
});

// Listar mídias
app.get('/media', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder="album-do-casal"') // Apenas da pasta compartilhada
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const media = result.resources.map((item) => ({
      url: item.secure_url,
      type: item.resource_type,
    }));

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar mídias.', error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});