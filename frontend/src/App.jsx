import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Stadium3D from './components/Stadium3D';
import FieldSelector from './components/FieldSelector';
import BookingForm from './components/BookingForm';

export default function App() {
  const [currentMode, setMode] = useState('nocturna');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* SECCIÓN DE BIENVENIDA / HERO GENERAL */}
        <div className="text-center space-y-3 max-w-2xl mx-auto py-4">
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
            Plataforma 3D Interactiva
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Bienvenidos a <span className="text-emerald-400">Estadio 360</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Disfruta de nuestros campos de fútbol en un entorno 3D interactivo. Explora y cambia en tiempo real entre los estadios más emblemáticos del mundo (Santiago Bernabéu, Anfield y Etihad Stadium) y asegura tu turno fácilmente.
          </p>
        </div>

        {/* Visor 3D del Estadio Seleccionado */}
        <Stadium3D currentMode={currentMode} />

        {/* Selector de Estadios / Equipos */}
        <FieldSelector currentMode={currentMode} setMode={setMode} />

        {/* Formulario de Reserva conectado al backend */}
        <BookingForm currentMode={currentMode} />

      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 Estadio 360. Todos los derechos reservados.
      </footer>
    </div>
  );
}