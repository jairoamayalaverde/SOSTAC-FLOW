import React, { useMemo, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle, 
  Calendar, Target, Zap, Activity, BarChart3, 
  ArrowLeft, Brain, Sparkles, Clock,
  Award, ExternalLink, FileText, X, Lock
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

// ESTILOS
const styles = {
  fontHeading: "font-['Poppins',_sans-serif]",
  fontBody: "font-['Raleway',_sans-serif]",
  glassCard: "bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl",
  neonText: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300"
};

const fases = [
  { id: 'situation', name: 'Situación', icon: '📊', color: '#3b82f6' },
  { id: 'objectives', name: 'Objetivos', icon: '🎯', color: '#22c55e' },
  { id: 'strategy', name: 'Estrategia', icon: '🧠', color: '#a855f7' },
  { id: 'tactics', name: 'Tácticas', icon: '⚡', color: '#f59e0b' },
  { id: 'action', name: 'Acción', icon: '🚀', color: '#ef4444' },
  { id: 'control', name: 'Control', icon: '📈', color: '#06b6d4' }
];

export default function DashboardAnalytics({ proyecto, onClose }) {
  // ✅ VALIDACIÓN DE SEGURIDAD - Evita crash si proyecto es null
  if (!proyecto || !proyecto.data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos del proyecto...</div>
      </div>
    );
  }

  // 🛡️ REF PARA PREVENIR ACTUALIZACIONES DESPUÉS DEL UNMOUNT
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // CÁLCULO DE MÉTRICAS
  const metricas = useMemo(() => {
    if (!proyecto) return {};
    
    let totalTareas = 0;
    let tareasCompletadas = 0;
    let tareasConEnlaces = 0;
    let tareasConNotas = 0;
    
    Object.values(proyecto.data).forEach(tareasFase => {
      totalTareas += tareasFase.length;
      tareasCompletadas += tareasFase.filter(t => t.completed).length;
      tareasConEnlaces += tareasFase.filter(t => t.link).length;
      tareasConNotas += tareasFase.filter(t => t.notes).length;
    });

    const tasaCompletitud = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;
    const balanceFases = calcularBalanceFases(proyecto);
    const puntajeActividad = calcularPuntajeActividad(proyecto);
    const calidadEnlaces = totalTareas > 0 ? (tareasConEnlaces / totalTareas) * 100 : 0;
    const coberturaNotas = totalTareas > 0 ? (tareasConNotas / totalTareas) * 100 : 0;
    
    const velocityScore = Math.round(
      (tasaCompletitud * 0.3) +
      (balanceFases * 0.25) +
      (puntajeActividad * 0.20) +
      (calidadEnlaces * 0.15) +
      (coberturaNotas * 0.10)
    );

    const puntajeSalud = (velocityScore / 10).toFixed(1);

    const fechaUltimaActividad = proyecto.updated_at ? new Date(proyecto.updated_at) : new Date();
    const hoy = new Date();
    const diasSinActividad = Math.floor((hoy - fechaUltimaActividad) / (1000 * 60 * 60 * 24));

    return {
      velocityScore,
      puntajeSalud,
      totalTareas,
      tareasCompletadas,
      tasaCompletitud: Math.round(tasaCompletitud),
      diasSinActividad,
      tareasConEnlaces,
      tareasConNotas,
      balanceFases: Math.round(balanceFases),
      puntajeActividad: Math.round(puntajeActividad)
    };
  }, [proyecto]);

  const datosFases = useMemo(() => {
    if (!proyecto) return [];
    return fases.map(fase => {
      const tareas = proyecto.data[fase.id] || [];
      const completadas = tareas.filter(t => t.completed).length;
      const total = tareas.length;
      const completitud = total > 0 ? Math.round((completadas / total) * 100) : 0;
      
      return {
        fase: fase.name,
        icon: fase.icon,
        completitud,
        total,
        completadas,
        pendientes: total - completadas,
        maximo: 100
      };
    });
  }, [proyecto]);

  const datosBurndown = useMemo(() => {
    if (!proyecto) return [];
    const semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    const velocidad = metricas.totalTareas / 6;
    
    return semanas.map((semana, idx) => {
      const tareasRestantes = Math.max(0, metricas.totalTareas - metricas.tareasCompletadas);
      const avanceIdeal = metricas.totalTareas - (velocidad * (idx + 1));
      
      return {
        semana,
        real: idx === semanas.length - 1 ? tareasRestantes : metricas.totalTareas - (idx * velocidad * 0.8),
        proyectado: metricas.totalTareas - (idx * velocidad * 1.1),
        ideal: avanceIdeal
      };
    });
  }, [metricas, proyecto]);

  const datosActividad = useMemo(() => {
    if (!proyecto) return [];
    return fases.map(fase => ({
      nombre: fase.name.substring(0, 3),
      nombreCompleto: fase.name,
      tareas: proyecto.data[fase.id]?.length || 0,
      completadas: proyecto.data[fase.id]?.filter(t => t.completed).length || 0,
      color: fase.color
    }));
  }, [proyecto]);

  const insights = useMemo(() => {
    if (!proyecto) return [];
    
    const resultado = [];
    
    const tareasControl = proyecto.data.control?.length || 0;
    const completadasControl = proyecto.data.control?.filter(t => t.completed).length || 0;
    const progresoControl = tareasControl > 0 ? (completadasControl / tareasControl) * 100 : 0;
    
    if (progresoControl < 30) {
      resultado.push({
        tipo: 'advertencia',
        icono: AlertCircle,
        color: 'text-red-400',
        fondo: 'bg-red-500/10',
        borde: 'border-red-500/50',
        titulo: 'Fase CONTROL Necesita Atención',
        mensaje: `Has completado ${Math.round(progresoControl)}% de las tareas de medición. Las estrategias sin control fallan 3x más.`,
        accion: 'Agregar métricas de seguimiento'
      });
    }
    
    const tareasSituation = proyecto.data.situation?.length || 0;
    const completadasSituation = proyecto.data.situation?.filter(t => t.completed).length || 0;
    const progresoSituation = tareasSituation > 0 ? (completadasSituation / tareasSituation) * 100 : 0;
    
    if (progresoSituation >= 50) {
      resultado.push({
        tipo: 'exito',
        icono: CheckCircle,
        color: 'text-green-400',
        fondo: 'bg-green-500/10',
        borde: 'border-green-500/50',
        titulo: 'Excelente Progreso en SITUACIÓN',
        mensaje: `${Math.round(progresoSituation)}% completado. Estás construyendo fundaciones sólidas para la estrategia.`,
        accion: 'Continuar con este momentum'
      });
    }
    
    const tareasStrategy = proyecto.data.strategy?.length || 0;
    const tareasTactics = proyecto.data.tactics?.length || 0;
    const ratio = tareasStrategy > 0 ? (tareasTactics / tareasStrategy).toFixed(1) : 0;
    
    if (ratio >= 1.0 && ratio <= 1.5) {
      resultado.push({
        tipo: 'info',
        icono: Sparkles,
        color: 'text-amber-400',
        fondo: 'bg-amber-500/10',
        borde: 'border-amber-500/50',
        titulo: 'Ratio Estrategia/Tácticas Balanceado',
        mensaje: `Tu ratio ${ratio}:1 sugiere ejecución alineada con la planificación estratégica.`,
        accion: 'Mantener este balance'
      });
    }
    
    if (resultado.length < 3) {
      resultado.push({
        tipo: 'info',
        icono: Sparkles,
        color: 'text-blue-400',
        fondo: 'bg-blue-500/10',
        borde: 'border-blue-500/50',
        titulo: 'Progreso General Positivo',
        mensaje: `Llevas ${metricas.tasaCompletitud}% de avance total en el proyecto.`,
        accion: 'Seguir ejecutando'
      });
    }
    
    return resultado.slice(0, 3);
  }, [proyecto, metricas]);

  if (!proyecto) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-4xl font-bold text-white tracking-tight ${styles.fontHeading}`}>
                Dashboard de <span className={styles.neonText}>Analíticas</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">{proyecto.name} • {proyecto.client}</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <X size={24} />
          </button>
        </header>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group col-span-1 md:col-span-2`}>
            <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={120} className="text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">
                <Zap size={16} className="text-amber-500" />
                Puntaje de Velocidad™
              </div>
              <div className="flex items-end gap-3 mb-4">
                <div className={`text-6xl font-bold ${styles.neonText}`}>{metricas.velocityScore}</div>
                <div className="text-2xl text-slate-500 mb-2">/100</div>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000"
                  style={{ width: `${metricas.velocityScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Indicador de momentum de ejecución estratégica
              </p>
            </div>
          </div>

          <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
            <Activity size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
                <CheckCircle size={14} />
                Completadas
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {metricas.tareasCompletadas}<span className="text-xl text-slate-500">/{metricas.totalTareas}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div 
                  className={metricas.tasaCompletitud >= 50 ? 'text-green-400' : 'text-slate-500'}
                  title="Progreso global considerando todas las fases SOSTAC"
                >
                  {metricas.tasaCompletitud}% de progreso global
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
            <Award size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Target size={14} />
                Salud del Proyecto
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {metricas.puntajeSalud}<span className="text-xl text-slate-500">/10</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock size={12} className="text-slate-500" />
                <span className="text-slate-500">Última actualización</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          
          <div className={`${styles.glassCard} p-6 rounded-2xl lg:col-span-2`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="text-amber-500" size={20} />
                Distribución de Fases SOSTAC
              </h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={datosFases}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis 
                  dataKey="fase" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar 
                  name="Completitud %" 
                  dataKey="completitud" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {datosFases.map((fase, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl mb-1">{fase.icon}</div>
                  <div className="text-xs text-slate-500">{fase.fase}</div>
                  <div className="text-lg font-bold text-white">{fase.completitud}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${styles.glassCard} p-6 rounded-2xl`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Estadísticas Rápidas
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar size={14} className="text-blue-400" />
                    Días sin actividad
                  </div>
                  <div className={`text-lg font-bold ${metricas.diasSinActividad === 0 ? 'text-green-400' : metricas.diasSinActividad > 7 ? 'text-red-400' : 'text-amber-400'}`}>
                    {metricas.diasSinActividad}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <ExternalLink size={14} className="text-purple-400" />
                    Tareas con recursos
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metricas.tareasConEnlaces}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <FileText size={14} className="text-amber-400" />
                    Tareas con notas
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metricas.tareasConNotas}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-500 mb-2">Tasa de Completitud</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                        style={{ width: `${metricas.tasaCompletitud}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-white">{metricas.tasaCompletitud}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          <div className={`${styles.glassCard} p-6 rounded-2xl`}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <TrendingDown className="text-blue-400" size={20} />
              Gráfica de Avance
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={datosBurndown}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="semana" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="real" 
                  stroke="#f59e0b" 
                  fillOpacity={1}
                  fill="url(#colorReal)"
                  strokeWidth={3}
                  name="Progreso Real"
                />
                <Line 
                  type="monotone" 
                  dataKey="proyectado" 
                  stroke="#64748b" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="Proyectado"
                />
                <Line 
                  type="monotone" 
                  dataKey="ideal" 
                  stroke="#22c55e" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  dot={false}
                  name="Ideal"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`${styles.glassCard} p-6 rounded-2xl`}>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <BarChart3 className="text-purple-400" size={20} />
              Distribución de Actividad
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={datosActividad}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="nombre" 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="tareas" fill="#475569" radius={[8, 8, 0, 0]} name="Total" />
                <Bar dataKey="completadas" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Completadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.glassCard} p-8 rounded-2xl`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Brain className="text-amber-500" size={24} />
              Insights con Inteligencia Artificial
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-xl border ${insight.fondo} ${insight.borde} transition-all hover:scale-105`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${insight.fondo}`}>
                    <insight.icono className={insight.color} size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm mb-1">
                      {insight.titulo}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  {insight.mensaje}
                </p>
                <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                  {insight.accion} →
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function calcularBalanceFases(proyecto) {
  const fases = [
    { id: 'situation' },
    { id: 'objectives' },
    { id: 'strategy' },
    { id: 'tactics' },
    { id: 'action' },
    { id: 'control' }
  ];
  const conteoFases = fases.map(f => proyecto.data[f.id]?.length || 0);
  const promedio = conteoFases.reduce((a, b) => a + b, 0) / conteoFases.length;
  const varianza = conteoFases.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0) / conteoFases.length;
  return Math.max(0, 100 - varianza * 2);
}

function calcularPuntajeActividad(proyecto) {
  const fechaUltimaActividad = proyecto.updated_at ? new Date(proyecto.updated_at) : new Date();
  const hoy = new Date();
  const diasDesde = Math.floor((hoy - fechaUltimaActividad) / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - (diasDesde * 10));
}
