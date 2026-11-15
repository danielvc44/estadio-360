import React from 'react';

export default function FieldSelector({ currentMode, setMode }) {
  const modes = [
    {
      id: 'nocturna',
      name: 'Santiago Bernabéu',
      team: 'Real Madrid',
      description: 'Elegancia blanca y el prestigio inconfundible de la casa blanca.',
      activeStyle: 'bg-white text-slate-950 border-white ring-4 ring-slate-300 shadow-2xl scale-[1.02]',
      badgeStyle: 'bg-slate-200 text-slate-900 font-bold'
    },
    {
      id: 'entrenamiento',
      name: 'Anfield',
      team: 'Liverpool FC',
      description: 'El calor y la mítica pasión roja de los Reds en Merseyside.',
      activeStyle: 'bg-red-600 text-white border-red-500 ring-4 ring-red-400/50 shadow-2xl scale-[1.02]',
      badgeStyle: 'bg-red-700 text-white font-bold'
    },
    {
      id: 'torneo',
      name: 'Etihad Stadium',
      team: 'Manchester City',
      description: 'El vibrante ambiente del Etihad con el característico azul celeste de los Citizens.',
      activeStyle: 'bg-sky-400 text-slate-950 border-sky-300 ring-4 ring-sky-300/50 shadow-2xl scale-[1.02]',
      badgeStyle: 'bg-sky-500 text-slate-950 font-bold'
    }
  ];

  return (
    <div id="estadios-selector" className="space-y-6 pt-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Selecciona el Estadio Emblemático
        </h2>
        <p className="text-sm text-slate-400">
          Elige tu escenario favorito para cambiar la experiencia 3D en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <div
              key={mode.id}
              onClick={() => setMode(mode.id)}
              className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? mode.activeStyle
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white opacity-80 hover:opacity-100 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full inline-block ${isActive ? mode.badgeStyle : 'bg-slate-800 text-slate-300'}`}>
                  {mode.team}
                </span>
                <h3 className="text-xl font-extrabold">{mode.name}</h3>
                <p className={`text-sm leading-relaxed ${isActive ? 'opacity-90 font-medium' : 'text-slate-400'}`}>
                  {mode.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-current/10">
                <span className="text-xs font-semibold tracking-wide">
                  {isActive ? '✨ Estadio Seleccionado' : 'Hacer clic para elegir'}
                </span>
                <span className="text-lg">🏟️</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}