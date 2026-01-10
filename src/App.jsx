import React, { useState } from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-10 text-center">
      <div>
        <h1 className="text-4xl font-bold text-amber-500 mb-4">SOSTAC FLOW</h1>
        <p className="text-slate-400">Si ves este mensaje, el despliegue en la rama feature-dashboard-v2 funcionó.</p>
        <div className="mt-8 p-6 border border-slate-800 rounded-xl bg-slate-900">
          Ruta: <code className="text-amber-300">src/App.jsx</code>
        </div>
      </div>
    </div>
  );
}
