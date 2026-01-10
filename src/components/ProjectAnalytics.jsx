import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
  Calendar, Target, Zap, Activity, BarChart3, 
  Download, ArrowLeft, Brain, Sparkles, Clock,
  Award, ExternalLink, FileText, ChevronRight
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// --- CONFIGURACIÓN ESTÁTICA ---
const PHASES = [
  { id: 'situation', name: 'Situation', icon: '📊', color: '#3b82f6' },
  { id: 'objectives', name: 'Objectives', icon: '🎯', color: '#22c55e' },
  { id: 'strategy', name: 'Strategy', icon: '🧠', color: '#a855f7' },
  { id: 'tactics', name: 'Tactics', icon: '⚡', color: '#f59e0b' },
  { id: 'action', name: 'Action', icon: '🚀', color: '#ef4444' },
  { id: 'control', name: 'Control', icon: '📈', color: '#06b6d4' }
];

const STYLES = {
  glassCard: "bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl hover:border-slate-700/50 transition-all duration-300",
  neonText: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300",
  heading: "font-['Poppins',_sans-serif]",
};

// --- COMPONENTE PRINCIPAL ---
export default function ProjectAnalytics({ project, onBack }) {
  const [timeRange, setTimeRange] = useState('30d');
  const [showInsights, setShowInsights] = useState(false);
  
  // Si no hay proyecto seleccionado o datos vacíos, mostramos loading o empty state
  if (!project) return <div className="p-8 text-center text-slate-500">Cargando métricas...</div>;

  // 1. CÁLCULOS EN TIEMPO REAL (Maldita sea, esto es potente)
  const metrics = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let tasksWithLinks = 0;
    let tasksWithNotes = 0;
    
    // Asumimos que project.sostac_data viene de Supabase (JSONB)
    // Si la estructura en DB es diferente, aquí hacemos el mapeo.
    const dataMap = project.sostac_data || {};

    Object.values(dataMap).forEach(phaseTasks => {
      if (Array.isArray(phaseTasks)) {
        totalTasks += phaseTasks.length;
        completedTasks += phaseTasks.filter(t => t.completed).length;
        tasksWithLinks += phaseTasks.filter(t => t.link).length;
        tasksWithNotes += phaseTasks.filter(t => t.notes).length;
      }
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Algoritmo de Salud del Proyecto
    const velocityScore = Math.round(
      (completionRate * 0.4) + // Peso: Avance
      ((tasksWithLinks / (totalTasks || 1)) * 20) + // Peso: Recursos
      ((tasksWithNotes / (totalTasks || 1)) * 10) + // Peso: Documentación
      30 // Base
    );

    return {
      velocityScore: Math.min(100, velocityScore), // Cap at 100
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate),
      tasksWithLinks,
      tasksWithNotes,
    };
  }, [project]);

  // 2. PREPARAR DATOS PARA GRÁFICOS
  const chartData = useMemo(() => {
    const dataMap = project.sostac_data || {};
    
    const radar = PHASES.map(phase => {
      const tasks = dataMap[phase.id] || [];
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      return {
        phase: phase.name,
        completion: total > 0 ? Math.round((completed / total) * 100) : 0,
        total,
        fullMark: 100
      };
    });

    const activity = PHASES.map(phase => ({
      name: phase.name.substring(0, 3),
      tasks: (dataMap[phase.id] || []).length,
      completed: (dataMap[phase.id] || []).filter(t => t.completed).length,
      color: phase.color
    }));

    return { radar, activity };
  }, [project]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 animate-fade-in">
      
      {/* FONDO AMBIENTAL */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 p-6 md:p-8">
        
        {/* HEADER DE NAVEGACIÓN */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-800/60">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="group p-2 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-500 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold text-white tracking-tight ${STYLES.heading}`}>
                Analytics <span className={STYLES.neonText}>Command Center</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  v2.0 LIVE
                </span>
                <p className="text-slate-400 text-sm">{project.name || "Sin Nombre"}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            >
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Trimestre Q1</option>
              <option value="all">Ciclo Completo</option>
            </select>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2">
              <Download size={18} /> Reporte PDF
            </button>
          </div>
        </header>

        {/* KPIs PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          {/* VELOCITY SCORE CARD */}
          <div className={`${STYLES.glassCard} p-6 rounded-2xl relative overflow-hidden group col-span-1 md:col-span-2`}>
            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <Zap size={180} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <Zap size={14} className="text-amber-500" />
                  Velocity Score™
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <div className={`text-6xl font-bold ${STYLES.neonText} leading-none`}>
                    {metrics.velocityScore}
                  </div>
                  <div className="text-xl text-slate-600 font-medium mb-1">/100</div>
                </div>
              </div>

              <div>
                <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mb-3 backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${metrics.velocityScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 flex justify-between">
                  <span>Eficiencia Operativa</span>
                  <span className={metrics.velocityScore > 50 ? "text-green-400" : "text-amber-400"}>
                    {metrics.velocityScore > 50 ? "Óptimo" : "Mejorable"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* TARJETAS SECUNDARIAS */}
          <StatCard 
            title="Tasa de Completitud" 
            value={`${metrics.completionRate}%`} 
            subtitle={`${metrics.completedTasks} de ${metrics.totalTasks} tareas`}
            icon={CheckCircle}
            trend="+5% vs semana pasada"
            trendUp={true}
          />
          
          <StatCard 
            title="Salud Documental" 
            value={`${metrics.tasksWithNotes}`} 
            subtitle="Items con notas/estrategia"
            icon={FileText}
            trend="Alta densidad"
            trendColor="text-blue-400"
          />
        </div>

        {/* ZONA DE GRÁFICOS */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          {/* RADAR CHART (SOSTAC BALANCE) */}
          <div className={`${STYLES.glassCard} p-6 rounded-2xl lg:col-span-2 flex flex-col`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="text-amber-500" size={20} />
                SOSTAC® Phase Balance
              </h3>
              <div className="flex gap-2">
                {PHASES.map((p, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}} title={p.name}></div>
                ))}
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-6">Visualización de cobertura estratégica vs. ejecución táctica.</p>
            
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.radar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="phase" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Completado" dataKey="completion" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#f59e0b' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTIVITY BARS */}
          <div className={`${STYLES.glassCard} p-6 rounded-2xl flex flex-col`}>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <BarChart3 className="text-blue-500" size={20} />
              Densidad por Fase
            </h3>
            
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.activity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={30} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="tasks" fill="#334155" radius={[0, 4, 4, 0]} barSize={8} />
                  <Bar dataKey="completed" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
               <p className="text-xs text-slate-500">
                 La fase de <span className="text-white font-bold">Acción</span> concentra el 40% de la carga de trabajo.
               </p>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS (SECCIÓN INFERIOR) */}
        <div className={`${STYLES.glassCard} rounded-2xl overflow-hidden`}>
          <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Brain className="text-amber-500" size={24} />
              AI Strategic Recommendations
            </h3>
            <button 
              onClick={() => setShowInsights(!showInsights)}
              className="text-xs text-amber-500 font-bold hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              <Sparkles size={14} /> {showInsights ? 'Actualizar Análisis' : 'Ver Detalles'}
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
            <InsightItem 
              type="warning"
              title="Déficit en Control"
              text="Solo has definido 2 KPIs. Lo que no se mide, no se puede mejorar."
            />
            <InsightItem 
              type="success"
              title="Situación Sólida"
              text="Tu análisis de situación (Auditoría + Competencia) está al 100%."
            />
            <InsightItem 
              type="info"
              title="Oportunidad SEO"
              text="Faltan definir las 'Core Keywords' en la fase de Estrategia."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, trendColor }) {
  return (
    <div className={`${STYLES.glassCard} p-6 rounded-2xl group`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-800/50 rounded-lg group-hover:bg-slate-800 transition-colors">
          <Icon size={20} className="text-slate-400 group-hover:text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-900 ${trendColor || (trendUp ? 'text-green-400' : 'text-slate-400')}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</div>
      <div className="text-xs text-slate-600 mt-2">{subtitle}</div>
    </div>
  );
}

function InsightItem({ type, title, text }) {
  const colors = {
    warning: "text-red-400 bg-red-500/10 border-red-500/20",
    success: "text-green-400 bg-green-500/10 border-green-500/20",
    info: "text-blue-400 bg-blue-500/10 border-blue-500/20"
  };

  return (
    <div className="p-6 hover:bg-slate-800/30 transition-colors">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${colors[type]}`}>
        {type === 'warning' && <AlertCircle size={12} />}
        {type === 'success' && <CheckCircle size={12} />}
        {type === 'info' && <Sparkles size={12} />}
        {title}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
      <button className="mt-4 text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
        Aplicar sugerencia <ChevronRight size={12} />
      </button>
    </div>
  );
}
