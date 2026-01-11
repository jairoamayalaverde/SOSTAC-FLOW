import React, { useMemo } from 'react';
import { 
  CheckCircle, X, Printer, Target, Lightbulb, 
  Globe, Mail, BarChart3, Clock, ChevronRight
} from 'lucide-react';

const ExecutiveReport = ({ proyecto, metricas, config, onClose }) => {
  if (!proyecto || !config) return null;

  // PROCESAMIENTO DE DATOS SOSTAC
  const reportData = useMemo(() => {
    const fasesConfig = [
      { id: 'situation', name: 'Situación', icon: '📊', color: '#3b82f6' },
      { id: 'objectives', name: 'Objetivos', icon: '🎯', color: '#22c55e' },
      { id: 'strategy', name: 'Estrategia', icon: '🧠', color: '#a855f7' },
      { id: 'tactics', name: 'Tácticas', icon: '⚡', color: '#f59e0b' },
      { id: 'action', name: 'Acción', icon: '🚀', color: '#ef4444' },
      { id: 'control', name: 'Control', icon: '📈', color: '#06b6d4' }
    ];

    const fasesProcessed = fasesConfig.map(f => {
      const tareas = proyecto.data[f.id] || [];
      const completadas = tareas.filter(t => t.completed).length;
      return {
        ...f,
        total: tareas.length,
        completadas,
        completitud: tareas.length > 0 ? Math.round((completadas / tareas.length) * 100) : 0,
        tareas: tareas.slice(0, 5) // Mostramos hasta 5 tareas por fase
      };
    });

    const recomendaciones = [];
    if (metricas.velocityScore < 50) recomendaciones.push("Optimizar flujo de trabajo: El ritmo actual sugiere cuellos de botella técnicos.");
    if (fasesProcessed.find(f => f.id === 'control').completitud < 20) recomendaciones.push("Fortalecer mecanismos de medición: Sin datos de control, la estrategia carece de feedback.");

    return { fases: fasesProcessed, recomendaciones };
  }, [proyecto, metricas]);

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-900 pb-20 relative z-[9999]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Raleway:wght@400;700&display=swap');
        @media print { 
          .no-print { display: none !important; } 
          body { background: white !important; padding: 0 !important; }
          .report-sheet { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
        }
        .hero-black { background: #000000; }
        h1, h2, h3 { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* CONTROLES */}
      <div className="fixed top-6 right-6 flex gap-3 no-print">
        <button onClick={() => window.print()} className="bg-amber-500 text-black px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-all">
          <Printer size={18} /> GENERAR REPORTE
        </button>
        <button onClick={onClose} className="bg-black text-white p-2 rounded-full border border-white/20 shadow-xl">
          <X size={24} />
        </button>
      </div>

      <div className="max-w-[950px] mx-auto bg-white shadow-2xl report-sheet min-h-screen transition-all">
        
        {/* HEADER PERSONALIZADO (Modal Config) */}
        <header className="p-8 border-b-4 border-amber-500 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {config.logo ? (
              <img src={config.logo} alt="Consultant Logo" className="h-14 object-contain" />
            ) : (
              <div className="bg-black text-amber-500 w-12 h-12 flex items-center justify-center rounded font-bold text-2xl">J</div>
            )}
            <div>
              <div className="font-bold text-lg tracking-tight uppercase">{config.consultantName || 'Jairo Amaya'}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">{config.consultantTitle || 'Full Stack Marketer'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Estrategia SOSTAC®</div>
            <div className="text-sm font-bold text-slate-400">{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          </div>
        </header>

        {/* PORTADA IMPACTANTE */}
        <section className="hero-black text-white p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Confidencial / Strategic Roadmap</span>
            <h1 className="text-5xl font-bold mb-6 leading-[1.1]">{proyecto.name.toUpperCase()}</h1>
            <p className="text-xl text-slate-400 font-light border-l-2 border-amber-500 pl-6">
              Preparado para: <span className="text-white font-bold">{proyecto.client}</span>
            </p>
          </div>
        </section>

        {/* MÉTRICAS (Condicional) */}
        {config.includeSections.metrics && (
          <section className="grid grid-cols-4 bg-slate-50 border-b border-slate-100">
            {[
              { label: 'Velocity Score', val: metricas.velocityScore, color: 'text-amber-500' },
              { label: 'Completion', val: `${proyecto.progress}%`, color: 'text-black' },
              { label: 'Health Index', val: `${metricas.puntajeSalud}/10`, color: 'text-green-600' },
              { label: 'Execution Days', val: Math.floor((new Date() - new Date(proyecto.created_at)) / (1000*60*60*24)), color: 'text-black' }
            ].map((m, i) => (
              <div key={i} className="p-8 text-center border-r border-slate-200 last:border-0">
                <div className="text-[9px] text-slate-400 font-black uppercase mb-1">{m.label}</div>
                <div className={`text-2xl font-bold ${m.color}`}>{m.val}</div>
              </div>
            ))}
          </section>
        )}

        {/* FASES SOSTAC (Condicional) */}
        {config.includeSections.sostacPhases && (
          <section className="p-12">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <BarChart3 className="text-amber-500" size={20} /> Análisis de Madurez SOSTAC
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {reportData.fases.map(f => (
                <div key={f.id} className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                   <div className="text-3xl">{f.icon}</div>
                   <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{f.name}</span>
                        <span>{f.completitud}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{width: `${f.completitud}%`}}></div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TABLA DE TAREAS (Condicional) */}
        {config.includeSections.tasks && (
          <section className="p-12 bg-white">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
               <Target size={20} className="text-amber-500"/> Hoja de Ruta Ejecutiva
             </h2>
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b-2 border-black text-[10px] uppercase font-black text-slate-400">
                   <th className="py-4">Fase</th>
                   <th className="py-4">Iniciativa Estratégica</th>
                   <th className="py-4">Estatus</th>
                 </tr>
               </thead>
               <tbody>
                 {reportData.fases.filter(f => f.total > 0).map(f => (
                   f.tareas.map((t, idx) => (
                     <tr key={t.id} className="border-b border-slate-100 text-sm">
                       <td className="py-3 font-bold text-[10px] text-amber-600">{idx === 0 ? f.name : ''}</td>
                       <td className="py-3 text-slate-700">{t.text}</td>
                       <td className="py-3">
                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${t.completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                           {t.completed ? 'LOGRADO' : 'EN PROCESO'}
                         </span>
                       </td>
                     </tr>
                   ))
                 ))}
               </tbody>
             </table>
          </section>
        )}

        {/* RECOMENDACIONES (Condicional) */}
        {config.includeSections.recommendations && (
          <section className="p-12 mx-8 bg-black text-white rounded-3xl mb-12 shadow-xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-amber-500">
               <Lightbulb size={20}/> Insights del Consultor
             </h2>
             <div className="space-y-4">
               {reportData.recomendaciones.map((r, i) => (
                 <div key={i} className="flex gap-3 text-sm font-light border-l border-amber-500/30 pl-4 py-2">
                   <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                   <p className="text-slate-300 italic">{r}</p>
                 </div>
               ))}
               {reportData.recomendaciones.length === 0 && <p className="text-green-400 text-sm italic">Ejecución alineada con los estándares de alto impacto.</p>}
             </div>
          </section>
        )}

        {/* FOOTER CORPORATIVO */}
        <footer className="mt-auto bg-slate-50 p-12 flex justify-between items-end border-t border-slate-200">
           <div>
             <div className="font-bold text-lg mb-1">{config.consultantName}</div>
             <div className="text-xs text-slate-500 max-w-[250px] mb-4">{config.consultantServices}</div>
             <div className="flex gap-4 text-xs text-amber-600 font-bold">
               {config.consultantWebsite && <span className="flex items-center gap-1"><Globe size={10}/> {config.consultantWebsite}</span>}
               {config.consultantEmail && <span className="flex items-center gap-1"><Mail size={10}/> {config.consultantEmail}</span>}
             </div>
           </div>
           <div className="text-right">
             <p className="text-amber-500 font-black italic text-xl mb-1">"Siente el poder de ser diferente"</p>
             <p className="text-[9px] text-slate-300 uppercase tracking-widest">© 2026 Powered by SOSTAC FLOW</p>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default ExecutiveReport;
