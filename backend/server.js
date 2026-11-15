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

// Crea la tabla con los campos exactos de tu formulario
pool.query(`
  CREATE TABLE IF NOT EXISTS reservas_tours (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    estadio VARCHAR(100),
    fecha VARCHAR(50),
    hora VARCHAR(50),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => console.log('✅ Conectado a Neon y tabla lista'))
  .catch(err => console.error('❌ Error conectando a Neon:', err));

app.post('/api/reservas', async (req, res) => {
  const { nombre, correo, estadio, fecha, hora } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reservas_tours (nombre, correo, estadio, fecha, hora) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, correo, estadio, fecha, hora]
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