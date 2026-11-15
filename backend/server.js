require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crea la tabla automáticamente en Neon al arrancar si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    zona VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => console.log('✅ Conectado a Neon y tabla lista'))
  .catch(err => console.error('❌ Error conectando a Neon:', err));

app.post('/api/reservas', async (req, res) => {
  const { nombre, correo, zona } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservas (nombre, correo, zona) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, zona]
    );
    res.status(201).json({ mensaje: 'Reserva guardada en Neon', reserva: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la reserva' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});