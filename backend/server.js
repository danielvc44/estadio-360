const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Habilitar CORS y lectura de JSON
app.use(cors());
app.use(express.json());

// Endpoint para recibir las reservas del frontend
app.post('/api/reservas', (req, res) => {
  const reserva = req.body;
  console.log('🎉 ¡Nueva reserva recibida en el backend!', reserva);

  // Respondemos al frontend con éxito
  res.status(200).json({ 
    success: true, 
    message: 'Reserva registrada correctamente en el servidor' 
  });
});

// Iniciar el servidor (Esto es lo que evita que se cierre la terminal)
app.listen(PORT, () => {
  console.log(`Servidor backend encendido y escuchando en http://localhost:${PORT}`);
});