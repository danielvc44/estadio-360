import React, { useState } from 'react';

export default function BookingForm({ currentMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: ''
  });
  
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const stadiumNames = {
    nocturna: 'Santiago Bernabéu (Real Madrid)',
    entrenamiento: 'Anfield (Liverpool FC)',
    torneo: 'Etihad Stadium (Manchester City)'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });

    const stadiumName = stadiumNames[currentMode] || currentMode;

    try {
      const payload = {
        name: formData.name,
        nombre: formData.name,
        email: formData.email,
        correo: formData.email,
        date: formData.date,
        fecha: formData.date,
        time: formData.time,
        hora: formData.time,
        stadium: stadiumName,
        estadio: stadiumName,
        tipo: 'Tour / Visita Guiada'
      };

      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = `Error del servidor (Estado ${response.status})`;
        try {
          const errData = await response.json();
          if (errData.message || errData.error) {
            errorMsg = errData.message || errData.error;
          }
        } catch (e) {
          // Si no devuelve JSON, ignoramos y dejamos el mensaje por defecto
        }
        throw new Error(errorMsg);
      }

      setStatus({
        loading: false,
        success: '¡Visita reservada con éxito! Te hemos enviado los tiquetes y detalles de acceso a tu correo.',
        error: ''
      });
      setFormData({ name: '', email: '', date: '', time: '' });

    } catch (err) {
      console.error('Error en reserva:', err);
      
      const isNetworkError = err.message.includes('Failed to fetch') || err.message.includes('NetworkError');
      
      setStatus({
        loading: false,
        success: '',
        error: isNetworkError 
          ? 'No se pudo conectar con el servidor backend. Asegúrate de que tu servidor esté encendido en el puerto 5000.'
          : err.message
      });
    }
  };

  return (
    <div id="reserva" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl text-white my-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Tour Oficial & Experiencia
          </span>
          <h3 className="text-2xl font-bold tracking-tight">Reserva tu Visita al Estadio</h3>
          <p className="text-sm text-slate-400">
            Asegura tu entrada para recorrer las gradas, el museo y el campo de: <span className="text-emerald-400 font-semibold">{stadiumNames[currentMode]}</span>
          </p>
        </div>

        {status.success && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-xl text-sm flex items-center space-x-3 shadow-lg">
            <span className="text-xl">🎫</span>
            <span>{status.success}</span>
          </div>
        )}

        {status.error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-sm flex items-center space-x-3 shadow-lg">
            <span className="text-xl">⚠️</span>
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Nombre del Visitante Principal</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Ej. Daniel Pérez"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico (para recibir los tiquetes)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="daniel@email.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Fecha de la Visita</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Hora del Tour</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 text-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            {status.loading ? 'Generando tiquetes...' : 'Confirmar Reserva de Visita 🎟️'}
          </button>
        </form>
      </div>
    </div>
  );
}