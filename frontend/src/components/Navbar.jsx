import React from 'react';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🏟️</span>
          <span className="font-extrabold text-lg tracking-tight text-white">
            ESTADIO<span className="text-emerald-400">360</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <a href="#estadio" className="hover:text-emerald-400 transition-colors">Estadio 3D</a>
          <a href="#estadios-selector" className="hover:text-emerald-400 transition-colors">Estadios</a>
          <a href="#reserva" className="hover:text-emerald-400 transition-colors">Reservar Visita</a>
        </nav>
      </div>
    </header>
  );
}