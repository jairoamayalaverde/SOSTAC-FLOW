import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Circle, Calendar, 
  Save, X, Briefcase, Eye, EyeOff, LayoutDashboard, 
  ArrowLeft, ExternalLink, BarChart3, FileText, RefreshCw,
  Activity, Zap, Target, Layers, ArrowUpRight
} from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS Y TIPOGRAFÍA ---
const styles = {
  fontHeading: "font-['Poppins',_sans-serif]",
  fontBody: "font-['Raleway',_sans-serif]",
  glassCard: "bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl",
  activeTab: "bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  inactiveTab: "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
  primaryBtn: "bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all",
  secondaryBtn: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600",
  neonText: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
};

// --- DATA INICIAL (TEMPLATES ROBUSTOS) ---
const projectTemplates = {
  blank: {
    name: 'Proyecto en Blanco',
    description: 'Empieza desde cero',
    data: { situation: [], objectives: [], strategy: [], tactics: [], action: [], control: [] }
  },
  seo: {
    name: 'Consultoría SEO High-Ticket',
    description: 'Posicionamiento, Autoridad y Conversión',
    data: {
      situation: [
        { id: 's1', text: 'Auditoría Técnica Profunda (Crawl & Indexación)', completed: true, notes: 'Identificados 15 errores 404 y 3 cadenas de redirección críticas.' },
        { id: 's2', text: 'Análisis de Competencia (Top 3 SERP)', completed: true, notes: 'Competidor A domina keywords informacionales. Oportunidad en transaccionales.' },
        { id: 's3', text: 'Keyword Research & Gap Analysis', completed: false, notes: 'Foco en long-tail keywords con intención de compra alta.' },
        { id: 's4', text: 'Revisión de Perfil de Enlaces (Backlinks)', completed: false, notes: '' },
        { id: 's5', text: 'Benchmark de Velocidad (Core Web Vitals)', completed: true, notes: 'LCP en móvil necesita optimización urgente (3.5s).' },
      ],
      objectives: [
        { id: 'o1', text: 'Aumentar Tráfico Orgánico Calificado (+40% YoY)', completed: false, notes: 'Meta: 15,000 visitas/mes para Q3.' },
        { id: 'o2', text: 'Posicionar 5 Keywords "Money" en Top 3', completed: false, notes: '' },
        { id: 'o3', text: 'Mejorar Tasa de Conversión Orgánica (CRO)', completed: false, notes: 'Objetivo: Pasar del 1.2% al 2.0%.' },
      ],
      strategy: [
        { id: 'st1', text: 'Content Hubs: Autoridad Temática', completed: false, notes: 'Crear clusters de contenido alrededor de productos core.' },
        { id: 'st2', text: 'SEO Técnico: Fundación Sólida', completed: false, notes: 'Priorizar indexabilidad y velocidad de carga.' },
        { id: 'st3', text: 'Link Building: Digital PR & Outreach', completed: false, notes: 'Conseguir enlaces de sitios de nicho con DR > 40.' },
      ],
      tactics: [
        { id: 't1', text: 'Optimización On-Page de 20 URLs Prioritarias', completed: false, notes: 'Uso de la Matriz de Prioridad para seleccionar las URLs.' },
        { id: 't2', text: 'Creación de 4 Artículos "Pilar" Mensuales', completed: false, notes: 'Contenido de >1500 palabras, profundidad semántica.' },
        { id: 't3', text: 'Implementación de Schema Markup (Product, FAQ)', completed: false, notes: '' },
        { id: 't4', text: 'Campaña de Guest Posting (2 links/mes)', completed: false, notes: '' },
      ],
      action: [
        { id: 'a1', text: 'Semana 1: Fix Errores Técnicos Críticos', completed: false, notes: '' },
        { id: 'a2', text: 'Semana 2: Optimización On-Page Categorías', completed: false, notes: '' },
        { id: 'a3', text: 'Semana 3: Producción Contenido Blog', completed: false, notes: '' },
        { id: 'a4', text: 'Semana 4: Revisión y Ajustes Mensuales', completed: false, notes: '' },
      ],
      control: [
        { id: 'c1', text: 'Dashboard GA4 + GSC Personalizado', completed: false, notes: '' },
        { id: 'c2', text: 'Tracking Semanal de Posiciones (Rank Tracker)', completed: false, notes: '' },
        { id: 'c3', text: 'Auditoría de Salud del Sitio (Mensual)', completed: false, notes: '' },
        { id: 'c4', text: 'Revisión Trimestral de Estrategia', completed: false, notes: '' },
      ]
    }
  },
  branding: {
    name: 'Transformación de Marca',
    description: 'Identidad, Voz y Posicionamiento',
    data: { 
        situation: [
            { id: 'bs1', text: 'Auditoría de Marca Actual', completed: false, notes: '' },
            { id: 'bs2', text: 'Entrevistas a Stakeholders', completed: false, notes: '' }
        ], 
        objectives: [], strategy: [], tactics: [], action: [], control: [] 
    } 
  }
};

const phases = [
  { id: 'situation', name: 'Situation', icon: '📊', color: 'text-blue-400', border: 'border-blue-500' },
  { id: 'objectives', name: 'Objectives', icon: '🎯', color: 'text-green-400', border: 'border-green-500' },
  { id: 'strategy', name: 'Strategy', icon: '🧠', color: 'text-purple-400', border: 'border-purple-500' },
  { id: 'tactics', name: 'Tactics', icon: '⚡', color: 'text-amber-400', border: 'border-amber-500' },
  { id: 'action', name: 'Action', icon: '🚀', color: 'text-red-400', border: 'border-red-500' },
  { id: 'control', name: 'Control', icon: '📈', color: 'text-cyan-400', border: 'border-cyan-500' }
];

export default function App() {
  // --- ESTADOS ---
  const [viewMode, setViewMode] = useState('admin');
  
  // Persistencia
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ja_os_projects');
    const parsedProjects = saved ? JSON.parse(saved) : [];
    if (parsedProjects.length === 0) {
      const demoData = JSON.parse(JSON.stringify(projectTemplates.seo.data));
      return [{
        id: 1,
        name: 'Proyecto Demo: E-commerce',
        client: 'Cliente Ejemplo S.A.',
        industry: 'Retail / Tech',
        projectType: 'seo',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: 15,
        data: demoData
      }];
    }
    return parsedProjects;
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhase, setActivePhase] = useState('situation');
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [newProjectData, setNewProjectData] = useState({
    name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0]
  });

  // --- EFECTOS ---
  useEffect(() => {
    localStorage.setItem('ja_os_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
      if (selectedProject) {
          let total = 0, completed = 0;
          Object.values(selectedProject.data).forEach(phase => {
              total += phase.length;
              completed += phase.filter(t => t.completed).length;
          });
          const realProgress = total === 0 ? 0 : Math.round((completed / total) * 100);
          
          if (selectedProject.progress !== realProgress) {
              const updated = { ...selectedProject, progress: realProgress };
              setSelectedProject(updated);
              setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          }
      }
  }, [selectedProject?.data]);

  // --- FUNCIONES ---
  const handleHardReset = () => {
    if(confirm('⚠️ ¿RESET DE FÁBRICA? \n\nSe borrarán todos los proyectos y se restaurará la Demo.')) {
      localStorage.removeItem('ja_os_projects');
      window.location.reload();
    }
  };

  const createNewProject = () => {
    const template = projectTemplates[newProjectData.projectType];
    const newProject = {
      id: Date.now(),
      ...newProjectData,
      status: 'active',
      progress: 0,
      data: JSON.parse(JSON.stringify(template.data))
    };
    setProjects([...projects, newProject]);
    setShowNewProject(false);
    setNewProjectData({ name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0] });
  };

  const updateProjectData = (newData) => {
    const updatedProject = { ...selectedProject, data: newData };
    setSelectedProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const toggleTask = (taskId) => {
    if (viewMode === 'client') return;
    const newData = { ...selectedProject.data };
    newData[activePhase] = newData[activePhase].map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateProjectData(newData);
  };

  const addTask = () => {
    const newTask = { id: Date.now(), text: 'Nueva tarea estratégica', completed: false, notes: '' };
    const newData = { ...selectedProject.data };
    newData[activePhase] = [...newData[activePhase], newTask];
    updateProjectData(newData);
    setEditingTask(newTask.id);
  };

  const deleteTask = (taskId) => {
    if (confirm('¿Eliminar esta tarea?')) {
      const newData = { ...selectedProject.data };
      newData[activePhase] = newData[activePhase].filter(t => t.id !== taskId);
      updateProjectData(newData);
    }
  };

  const updateTaskText = (taskId, text) => {
    const newData = { ...selectedProject.data };
    newData[activePhase] = newData[activePhase].map(t => t.id === taskId ? { ...t, text } : t);
    updateProjectData(newData);
    setEditingTask(null);
  };

  const updateTaskNotes = (taskId, notes) => {
    const newData = { ...selectedProject.data };
    newData[activePhase] = newData[activePhase].map(t => t.id === taskId ? { ...t, notes } : t);
    updateProjectData(newData);
  };

  // --- CALCULOS DASHBOARD ---
  const totalProjects = projects.length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) 
    : 0;
  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);

  // --- RENDERIZADO ---

  // 1. MODAL NUEVO PROYECTO
  if (showNewProject) return (
    <div className="min-h-screen bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans z-50 fixed inset-0">
      <div className={`max-w-2xl w-full ${styles.glassCard} rounded-2xl p-8 border-amber-500/20`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl text-white ${styles.fontHeading}`}>Iniciar Nuevo Proyecto</h2>
          <button onClick={() => setShowNewProject(false)} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        
        <div className="space-y-4">
          <input 
            placeholder="Nombre del Proyecto" 
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
            value={newProjectData.name}
            onChange={e => setNewProjectData({...newProjectData, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              placeholder="Cliente" 
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
              value={newProjectData.client}
              onChange={e => setNewProjectData({...newProjectData, client: e.target.value})}
            />
            <input 
              placeholder="Industria" 
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
              value={newProjectData.industry}
              onChange={e => setNewProjectData({...newProjectData, industry: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(projectTemplates).map(([key, tpl]) => (
              <div 
                key={key}
                onClick={() => setNewProjectData({...newProjectData, projectType: key})}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${newProjectData.projectType === key ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
              >
                <div className={`font-bold text-white ${styles.fontHeading}`}>{tpl.name}</div>
                <div className="text-xs text-slate-400">{tpl.description}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={createNewProject}
            disabled={!newProjectData.name}
            className={`w-full py-4 rounded-xl font-bold mt-6 ${styles.primaryBtn} ${!newProjectData.name ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Lanzar Estrategia
          </button>
        </div>
      </div>
    </div>
  );

  // 2. DASHBOARD DE PROYECTOS (HOME - IMPACTANTE)
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      {/* FONDO ANIMADO TECH */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER TIPO HUD */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-xs font-mono text-slate-400 tracking-widest">SYSTEM ONLINE // V 2.0</span>
            </div>
            <h1 className={`text-5xl font-bold text-white tracking-tight ${styles.fontHeading}`}>
              SOSTAC <span className={styles.neonText}>FLOW</span>
            </h1>
            <p className={`text-slate-400 mt-2 ${styles.fontBody}`}>Centro de Comando Estratégico</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button 
              onClick={handleHardReset}
              className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
            >
              <RefreshCw size={14} /> RESET DB
            </button>
            <button 
              onClick={() => setShowNewProject(true)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm ${styles.primaryBtn}`}
            >
              <Plus size={18} /> NUEVA ESTRATEGIA
            </button>
          </div>
        </header>

        {/* KPI CARDS (BENTO GRID TOP) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* KPI 1 */}
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={80} />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Proyectos Activos</h3>
                <div className="text-4xl font-bold text-white mb-2">{totalProjects}</div>
                <div className="flex items-center gap-2 text-xs text-green-400">
                    <ArrowUpRight size={14} /> <span>100% Operativo</span>
                </div>
            </div>

            {/* KPI 2 */}
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={80} />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Eficiencia Global</h3>
                <div className="text-4xl font-bold text-white mb-2">{avgProgress}%</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
                    <div className="bg-amber-500 h-full rounded-full" style={{width: `${avgProgress}%`}}></div>
                </div>
            </div>

            {/* KPI 3 */}
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={80} />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tareas en Radar</h3>
                <div className="text-4xl font-bold text-white mb-2">{totalTasks}</div>
                <div className="text-xs text-slate-500">Items estratégicos bajo gestión</div>
            </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN LEFT: PROJECTS LIST (2/3) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className={`text-xl font-bold text-white flex items-center gap-2 ${styles.fontHeading}`}>
                        <Briefcase size={20} className="text-amber-500" /> Proyectos en Curso
                    </h2>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
                        <LayoutDashboard size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-500">Sistema en espera. Inicie una nueva estrategia.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {projects.map(project => (
                        <div 
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`group cursor-pointer rounded-xl p-6 transition-all border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-lg relative overflow-hidden`}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className={`text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors ${styles.fontHeading}`}>{project.name}</h3>
                                    <p className="text-sm text-slate-400">{project.client} • {projectTemplates[project.projectType]?.name}</p>
                                </div>
                                <div className="text-2xl font-bold text-slate-700 group-hover:text-white transition-colors">
                                    {project.progress}%
                                </div>
                            </div>
                            
                            {/* MINI VISUALIZER OF PHASES */}
                            <div className="flex gap-1 mb-2">
                                {phases.map((ph, idx) => {
                                    // Check status of phase
                                    const pTasks = project.data[ph.id] || [];
                                    const isComplete = pTasks.length > 0 && pTasks.every(t => t.completed);
                                    const hasProgress = pTasks.some(t => t.completed);
                                    
                                    let colorClass = "bg-slate-800";
                                    if (isComplete) colorClass = "bg-green-500";
                                    else if (hasProgress) colorClass = "bg-amber-500";
                                    
                                    return (
                                        <div key={idx} className={`h-1 flex-1 rounded-full ${colorClass}`} title={ph.name}></div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                                <span>S</span><span>O</span><span>S</span><span>T</span><span>A</span><span>C</span>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COLUMN RIGHT: SYSTEM STATUS (1/3) */}
            <div className="space-y-6">
                 <div className="flex justify-between items-center mb-2">
                    <h2 className={`text-xl font-bold text-white flex items-center gap-2 ${styles.fontHeading}`}>
                        <Zap size={20} className="text-amber-500" /> Acciones Rápidas
                    </h2>
                </div>
                
                <div className={`${styles.glassCard} p-6 rounded-2xl`}>
                    <div className="space-y-4">
                        <button onClick={() => setShowNewProject(true)} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center gap-3 group">
                            <div className="p-2 bg-amber-500/10 rounded-md text-amber-500 group-hover:text-white group-hover:bg-amber-500 transition-colors">
                                <Plus size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Nueva Estrategia</div>
                                <div className="text-xs text-slate-500">Crear desde template</div>
                            </div>
                        </button>

                        <button className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center gap-3 group">
                            <div className="p-2 bg-blue-500/10 rounded-md text-blue-500 group-hover:text-white group-hover:bg-blue-500 transition-colors">
                                <FileText size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Exportar Reportes</div>
                                <div className="text-xs text-slate-500">Generar PDF global</div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Estado del Sistema</h4>
                        <div className="space-y-3">
                             <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Database</span>
                                <span className="text-green-400 font-mono">LOCAL_STORAGE OK</span>
                            </div>
                             <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Version</span>
                                <span className="text-slate-300 font-mono">v2.4.0 (Beta)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">License</span>
                                <span className="text-amber-500 font-mono">JAIRO AMAYA PRO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );

  // 3. VISTA DE DETALLE DE PROYECTO (MANTENIDA IGUAL PERO CON FONDO AJUSTADO)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      
      {/* HEADER DE PROYECTO */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-xl font-bold text-white ${styles.fontHeading}`}>{selectedProject.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{selectedProject.client}</span>
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span className="text-amber-500">{projectTemplates[selectedProject.projectType]?.name}</span>
              </div>
            </div>
          </div>

          {/* CONTROLES ADMIN / CLIENTE + RESET */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'admin' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <EyeOff size={14} /> Vista Editor
              </button>
              <button 
                onClick={() => setViewMode('client')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'client' ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Eye size={14} /> Vista Cliente
              </button>
            </div>
            
            <button 
              onClick={handleHardReset}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all ml-2"
              title="Borrar todo y reiniciar demo"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TABS DE FASES SOSTAC */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
          {phases.map(phase => {
            const isActive = activePhase === phase.id;
            const phaseTasks = selectedProject.data[phase.id] || [];
            const completed = phaseTasks.filter(t => t.completed).length;
            const progress = phaseTasks.length > 0 ? Math.round((completed / phaseTasks.length) * 100) : 0;
            
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`flex-shrink-0 min-w-[160px] p-4 rounded-xl border transition-all ${isActive ? `${styles.activeTab} border-amber-500` : `${styles.inactiveTab} border-transparent`}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : phase.color}`}>{progress}%</span>
                </div>
                <div className={`font-bold text-left ${styles.fontHeading}`}>{phase.name}</div>
                <div className="w-full bg-black/10 h-1 mt-2 rounded-full overflow-hidden">
                  <div className={`h-full ${isActive ? 'bg-slate-900' : 'bg-slate-500'}`} style={{width: `${progress}%`}}></div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ÁREA DE TRABAJO */}
        <div className={`rounded-3xl p-6 md:p-8 min-h-[500px] ${styles.glassCard}`}>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className={`text-3xl font-bold text-white flex items-center gap-3 ${styles.fontHeading}`}>
                {phases.find(p => p.id === activePhase).icon}
                {phases.find(p => p.id === activePhase).name} Phase
              </h2>
              <p className="text-slate-400 mt-1">Gestión estratégica y táctica</p>
            </div>
            {viewMode === 'admin' && (
              <button onClick={addTask} className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold ${styles.primaryBtn}`}>
                <Plus size={18} /> Agregar Tarea
              </button>
            )}
          </div>

          <div className="space-y-3">
            {selectedProject.data[activePhase]?.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-2xl">
                <p className="text-slate-500">No hay items en esta fase aún.</p>
                {viewMode === 'admin' && <p className="text-amber-500 text-sm mt-2 cursor-pointer hover:underline" onClick={addTask}>Crear el primer item</p>}
              </div>
            ) : (
              selectedProject.data[activePhase]?.map(task => (
                <div 
                  key={task.id} 
                  className={`group p-4 rounded-xl border transition-all ${task.completed ? 'bg-green-500/5 border-green-500/20 opacity-75' : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'}`}
                >
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      disabled={viewMode === 'client'}
                      className={`mt-1 transition-colors ${task.completed ? 'text-green-500' : 'text-slate-600 hover:text-amber-500'}`}
                    >
                      {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1">
                      {editingTask === task.id ? (
                        <input 
                          autoFocus
                          className="w-full bg-slate-900 text-white p-2 rounded border border-amber-500 outline-none mb-2"
                          defaultValue={task.text}
                          onBlur={(e) => updateTaskText(task.id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateTaskText(task.id, e.target.value)}
                        />
                      ) : (
                        <div 
                          onClick={() => viewMode === 'admin' && setEditingTask(task.id)}
                          className={`text-lg mb-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'} ${viewMode === 'admin' ? 'cursor-pointer hover:text-amber-400' : ''}`}
                        >
                          {task.text}
                        </div>
                      )}
                      
                      <div className={`mt-2 flex items-start gap-2 ${!task.notes && viewMode === 'client' ? 'hidden' : ''}`}>
                        <FileText size={14} className={`mt-1 ${task.notes ? 'text-slate-400' : 'text-slate-600'}`} />
                        <textarea 
                          placeholder={viewMode === 'admin' ? "Notas estratégicas, enlaces o detalles..." : "Sin notas adicionales."}
                          value={task.notes}
                          readOnly={viewMode === 'client'}
                          onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                          className={`w-full bg-transparent text-sm resize-none outline-none ${task.completed ? 'text-slate-500' : 'text-slate-400'} focus:text-white placeholder-slate-600`}
                          rows={task.notes ? Math.max(2, task.notes.split('\n').length) : 1}
                        />
                      </div>
                    </div>

                    {viewMode === 'admin' && (
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
