import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos desde la carpeta dist
app.use(express.static(path.join(__dirname, 'dist')));


// Ruta para verificar las variables de entorno (solo para desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/env', (req, res) => {
    res.json({
      VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY ? 'Definida' : 'No definida'
    });
  });
}

// Maneja cualquier solicitud que no sea encontrada en los archivos estáticos
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log('Variables de entorno cargadas:', process.env.VITE_OPENAI_API_KEY ? 'VITE_OPENAI_API_KEY está definida' : 'VITE_OPENAI_API_KEY no está definida');
});