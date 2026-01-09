import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Circle, Calendar, 
  Save, X, Briefcase, Eye, EyeOff, LayoutDashboard, 
  ArrowLeft, ExternalLink, BarChart3, FileText, RefreshCw,
  Activity, Zap, Target, Layers, ArrowUpRight, Share2, 
  Github, Twitter, Linkedin, Globe, HardDrive, Cpu, Terminal
} from 'lucide-react';

// --- 1. CONFIGURACIÓN DE ESTILOS & BRANDING ---
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

// --- 2. DATA: TEMPLATES COMPLETOS (ECOSISTEMA) ---
const projectTemplates = {
  seo: {
    name: 'Consultoría SEO (Ecosistema)',
    description: 'Diagnóstico + Estrategia + Priorización',
    data: {
      situation: [
        { 
            id: 's1', 
            text: 'Ejecutar Auditoría Técnica Inicial', 
            completed: false, 
            notes: 'Usar la herramienta propietaria para detectar errores 404, LCP y redirecciones.', 
            link: 'https://jairoamaya.co/auditor-seo-interactivo/' // LINK A TU HERRAMIENTA
        },
        { id: 's2', text: 'Análisis de Competencia (Top 3 SERP)', completed: true, notes: 'Competidor A domina keywords informacionales. Oportunidad en transaccionales.', link: '' },
        { id: 's3', text: 'Keyword Research Transaccional', completed: false, notes: 'Foco en long-tail keywords con intención de compra alta.', link: '' },
        { id: 's4', text: 'Revisión de Perfil de Enlaces (Backlinks)', completed: false, notes: '', link: '' },
        { id: 's5', text: 'Benchmark de Velocidad (Core Web Vitals)', completed: true, notes: 'LCP en móvil necesita optimización urgente (3.5s).', link: '' },
      ],
      objectives: [
        { id: 'o1', text: '+40% Tráfico Orgánico YoY', completed: false, notes: 'Meta: 15,000 visitas/mes para Q3.', link: '' },
        { id: 'o2', text: 'Posicionar 5 Keywords "Money" en Top 3', completed: false, notes: '', link: '' },
        { id: 'o3', text: 'Mejorar Tasa de Conversión Orgánica (CRO)', completed: false, notes: 'Objetivo: Pasar del 1.2% al 2.0%.', link: '' },
      ],
      strategy: [
        { id: 'st1', text: 'Content Hubs: Autoridad Temática', completed: false, notes: 'Crear clusters de contenido alrededor de productos core.', link: '' },
        { id: 'st2', text: 'SEO Técnico: Fundación Sólida', completed: false, notes: 'Priorizar indexabilidad y velocidad de carga.', link: '' },
        { id: 'st3', text: 'Link Building: Digital PR & Outreach', completed: false, notes: 'Conseguir enlaces de sitios de nicho con DR > 40.', link: '' },
      ],
      tactics: [
          { 
              id: 't1', 
              text: 'Matriz de Prioridad (Impacto vs Esfuerzo)', 
              completed: false, 
              notes: 'Clasificar hallazgos de la auditoría para definir Quick Wins.', 
              link: 'https://jairoamaya.co/matriz-de-prioridad-seo/' // LINK A TU HERRAMIENTA
          },
          { id: 't2', text: 'Optimización On-Page de 20 URLs Prioritarias', completed: false, notes: '', link: '' },
          { id: 't3', text: 'Creación de 4 Artículos "Pilar" Mensuales', completed: false, notes: 'Contenido de >1500 palabras.', link: '' },
          { id: 't4', text: 'Implementación de Schema Markup', completed: false, notes: '', link: '' },
      ],
      action: [
        { id: 'a1', text: 'Semana 1: Fix Errores Técnicos Críticos', completed: false, notes: '', link: '' },
        { id: 'a2', text: 'Semana 2: Optimización On-Page Categorías', completed: false, notes: '', link: '' },
        { id: 'a3', text: 'Semana 3: Producción Contenido Blog', completed: false, notes: '', link: '' },
        { id: 'a4', text: 'Semana 4: Revisión y Ajustes Mensuales', completed: false, notes: '', link: '' },
      ],
      control: [
        { id: 'c1', text: 'Setup Dashboard GA4 + GSC', completed: false, notes: '', link: '' },
        { id: 'c2', text: 'Tracking Semanal de Posiciones', completed: false, notes: '', link: '' },
        { id: 'c3', text: 'Auditoría de Salud del Sitio (Mensual)', completed: false, notes: '', link: '' },
        { id: 'c4', text: 'Revisión Trimestral de Estrategia', completed: false, notes: '', link: '' },
      ]
    }
  },
  personal_brand: {
    name: 'Marca Personal',
    description: 'Posicionamiento de Líderes',
    data: {
      situation: [
        { id: 'pb1', text: 'Auditoría de Huella Digital Actual', completed: false, notes: 'Googlear nombre y analizar SERP.', link: '' },
        { id: 'pb2', text: 'Definición de Arquetipo de Marca', completed: false, notes: '¿Sabio, Héroe o Gobernante?', link: '' },
        { id: 'pb3', text: 'Análisis de Audiencia Objetivo', completed: false, notes: '', link: '' },
      ],
      objectives: [
        { id: 'po1', text: 'Ser Top of Mind en el nicho', completed: false, notes: '', link: '' },
        { id: 'po2', text: 'Crecer 10k seguidores en LinkedIn', completed: false, notes: '', link: '' },
      ],
      strategy: [], tactics: [], action: [], control: []
    }
  },
  smo: {
    name: 'SMO (Social Media)',
    description: 'Optimización de Redes Sociales',
    data: {
      situation: [{ id: 'sm1', text: 'Auditoría de Canales Actuales', completed: false, notes: '', link: '' }],
      objectives: [], strategy: [], tactics: [], action: [], control: []
    }
  },
  blank: {
    name: 'Proyecto en Blanco',
    description: 'Personalizado',
    data: { situation: [], objectives: [], strategy: [], tactics: [], action: [], control: [] }
  }
};

const phases = [
  { id: 'situation', name: 'Situation', icon: '📊', color: 'text-blue-400' },
  { id: 'objectives', name: 'Objectives', icon: '🎯', color: 'text-green-400' },
  { id: 'strategy', name: 'Strategy', icon: '🧠', color: 'text-purple-400' },
  { id: 'tactics', name: 'Tactics', icon: '⚡', color: 'text-amber-400' },
  { id: 'action', name: 'Action', icon: '🚀', color: 'text-red-400' },
  { id: 'control', name: 'Control', icon: '📈', color: 'text-cyan-400' }
];

export default function App() {
  const [viewMode, setViewMode] = useState('admin');
  
  // --- 3. PERSISTENCIA + DEMO AUTOMÁTICA ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ja_os_projects');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // SIEMPRE que esté vacío, cargamos el DEMO SEO ROBUSTO
    if (parsed.length === 0) {
      const demoData = JSON.parse(JSON.stringify(projectTemplates.seo.data));
      return [{
        id: 1,
        name: 'Demo: E-commerce Growth',
        client: 'TechStore Global',
        industry: 'Retail',
        projectType: 'seo',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: 12,
        data: demoData
      }];
    }
    return parsed;
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhase, setActivePhase] = useState('situation');
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [newProjectData, setNewProjectData] = useState({
    name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0]
  });

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

  // --- 4. FUNCIONES LÓGICAS ---
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
    const updated = { ...selectedProject, data: newData };
    setSelectedProject(updated);
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
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
    const newTask = { id: Date.now(), text: 'Nuevo item estratégico', completed: false, notes: '', link: '' };
    const newData = { ...selectedProject.data };
    newData[activePhase] = [...newData[activePhase], newTask];
    updateProjectData(newData);
    setEditingTask(newTask.id);
  };

  const deleteTask = (taskId) => {
    if (confirm('¿Eliminar este item?')) {
      const newData = { ...selectedProject.data };
      newData[activePhase] = newData[activePhase].filter(t => t.id !== taskId);
      updateProjectData(newData);
    }
  };

  const updateTaskField = (taskId, field, value) => {
    const newData = { ...selectedProject.data };
    newData[activePhase] = newData[activePhase].map(t => t.id === taskId ? { ...t, [field]: value } : t);
    updateProjectData(newData);
  };

  const shareProject = () => {
      const text = `🚀 *Estado de Proyecto: ${selectedProject.name}*\nCliente: ${selectedProject.client}\nProgreso Global: ${selectedProject.progress}%\n\nGenerado con SOSTAC FLOW`;
      navigator.clipboard.writeText(text);
      alert('Resumen copiado al portapapeles!');
  };

  const isInternalTool = (url) => url && url.includes('jairoamaya.co');

  // --- 5. RENDERIZADO: MODAL ---
  if (showNewProject) return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full ${styles.glassCard} rounded-2xl p-8 border-amber-500/20 animate-in fade-in zoom-in duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl text-white ${styles.fontHeading}`}>Inicializar Nueva Estrategia</h2>
          <button onClick={() => setShowNewProject(false)} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
                 <div>
                    <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Datos del Proyecto</label>
                    <input 
                        placeholder="Nombre de la Campaña / Proyecto" 
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none mb-3"
                        value={newProjectData.name}
                        onChange={e => setNewProjectData({...newProjectData, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                        placeholder="Cliente" 
                        className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                        value={newProjectData.client}
                        onChange={e => setNewProjectData({...newProjectData, client: e.target.value})}
                        />
                        <input 
                        placeholder="Industria" 
                        className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                        value={newProjectData.industry}
                        onChange={e => setNewProjectData({...newProjectData, industry: e.target.value})}
                        />
                    </div>
                </div>
                
                <button 
                    onClick={createNewProject}
                    disabled={!newProjectData.name}
                    className={`w-full py-4 rounded-xl font-bold mt-4 ${styles.primaryBtn} ${!newProjectData.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Lanzar Protocolo SOSTAC
                </button>
            </div>

            <div>
                <label className="text-xs text-slate-400 uppercase font-bold mb-3 block">Selecciona un Framework</label>
                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(projectTemplates).map(([key, tpl]) => (
                    <div 
                        key={key}
                        onClick={() => setNewProjectData({...newProjectData, projectType: key})}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                            newProjectData.projectType === key 
                            ? 'bg-amber-500/10 border-amber-500' 
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <div>
                            <div className={`font-bold text-white group-hover:text-amber-400 transition-colors ${styles.fontHeading}`}>{tpl.name}</div>
                            <div className="text-xs text-slate-400">{tpl.description}</div>
                        </div>
                        {newProjectData.projectType === key && <CheckCircle size={18} className="text-amber-500" />}
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  // --- CALCULOS DASHBOARD ---
  const totalProjects = projects.length;
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) : 0;
  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);

  // --- 6. RENDERIZADO: DASHBOARD (HOME) - ESTILO BENTO GRID V2.0 RESTAURADO ---
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">System Online // v5.0</span>
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

        {/* BENTO GRID METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={80} />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tareas en Radar</h3>
                <div className="text-4xl font-bold text-white mb-2">{totalTasks}</div>
                <div className="text-xs text-slate-500">Items estratégicos bajo gestión</div>
            </div>
        </div>

        {/* MAIN LAYOUT: PROJECTS + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PROJECTS LIST */}
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
                            
                            {/* PHASE DOTS VISUALIZER */}
                            <div className="flex gap-1 mb-2">
                                {phases.map((ph, idx) => {
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

            {/* QUICK ACTIONS SIDEBAR */}
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
                                <span className="text-slate-300 font-mono">v5.0 (Ultimate)</span>
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

      {/* FOOTER V4.0 (FULL STACK MARKETER) */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md pt-12 pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* BRAND */}
            <div className="md:col-span-2">
                <h4 className={`text-2xl font-bold text-white mb-2 ${styles.fontHeading}`}>JAIRO AMAYA</h4>
                <div className="flex items-center gap-2">
                    <span className="h-0.5 w-8 bg-amber-500"></span>
                    <p className="text-amber-500 font-bold text-sm tracking-wider uppercase">Full Stack Marketer</p>
                </div>
                <p className="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">
                    Transformando negocios mediante ingeniería de marketing y estrategias orientadas a resultados tangibles.
                </p>
            </div>
            
            {/* ECOSISTEMA LINKS */}
            <div>
                <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Ecosistema</h5>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="https://jairoamaya.co/auditor-seo-interactivo/" target="_blank" className="hover:text-amber-500 transition-colors">Auditor SEO</a></li>
                    <li><a href="https://jairoamaya.co/matriz-de-prioridad-seo/" target="_blank" className="hover:text-amber-500 transition-colors">Matriz de Prioridad</a></li>
                    <li><a href="#" className="hover:text-amber-500 transition-colors">Consultoría</a></li>
                </ul>
            </div>

            {/* STATUS & SOCIAL */}
            <div className="flex flex-col md:items-end">
                 <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Estado</h5>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs text-green-500 font-mono font-bold">SYSTEM OPERATIONAL</span>
                 </div>
                 <div className="flex gap-4">
                    <a href="https://www.linkedin.com/in/jairoamaya" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Linkedin size={18} /></a>
                    <a href="https://twitter.com" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Twitter size={18} /></a>
                    <a href="https://jairoamaya.co" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Globe size={18} /></a>
                </div>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>© 2026 Jairo Amaya. All rights reserved.</p>
            <p className="font-mono">v5.0.0 BUILD 2026</p>
        </div>
      </footer>
    </div>
  );

  // --- 7. RENDERIZADO: VISTA DE PROYECTO (COCKPIT) ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 flex flex-col justify-between">
      
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedProject(null)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-lg font-bold text-white ${styles.fontHeading}`}>{selectedProject.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{selectedProject.client}</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="text-amber-500 font-bold">{projectTemplates[selectedProject.projectType]?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={shareProject} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Copiar Resumen">
                <Share2 size={18} />
             </button>
             <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>
             <button 
                onClick={() => setViewMode(viewMode === 'admin' ? 'client' : 'admin')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                    viewMode === 'admin' 
                    ? 'bg-slate-800 border-slate-700 text-slate-300' 
                    : 'bg-green-500/10 border-green-500/50 text-green-500'
                }`}
            >
                {viewMode === 'admin' ? 'MODO EDITOR' : 'VISTA CLIENTE'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        
        {/* PHASE NAVIGATOR (Metro Line) */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex min-w-max gap-3 p-1">
          {phases.map((phase, idx) => {
            const isActive = activePhase === phase.id;
            const tasks = selectedProject.data[phase.id] || [];
            const completedCount = tasks.filter(t => t.completed).length;
            const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
            const isPhaseComplete = progress === 100;
            
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl border transition-all relative ${
                    isActive 
                    ? 'bg-slate-900 border-amber-500 shadow-lg scale-105 z-10' 
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className={`text-2xl ${isActive ? 'text-amber-500 scale-110 transition-transform' : isPhaseComplete ? 'text-green-500' : 'text-slate-600'}`}>
                    {isPhaseComplete ? <CheckCircle size={24} /> : phase.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>{phase.name}</span>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                    <div className={`${progress === 100 ? 'bg-green-500' : 'bg-amber-500'} h-full transition-all`} style={{width: `${progress}%`}}></div>
                </div>
              </button>
            )
          })}
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* TASKS LIST */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {phases.find(p => p.id === activePhase).icon} Tareas & Entregables
                    </h2>
                    {viewMode === 'admin' && (
                        <button onClick={addTask} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${styles.primaryBtn}`}>
                            <Plus size={14} /> AGREGAR
                        </button>
                    )}
                </div>

                {selectedProject.data[activePhase]?.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-center text-slate-600">
                        No hay items configurados en esta fase.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selectedProject.data[activePhase]?.map(task => (
                            <div key={task.id} className={`group bg-slate-900/50 border border-slate-800 p-5 rounded-xl hover:border-slate-600 transition-all ${task.completed ? 'opacity-70' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        disabled={viewMode === 'client'}
                                        className={`mt-1 ${task.completed ? 'text-green-500' : 'text-slate-600 hover:text-amber-500'}`}
                                    >
                                        {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                                    </button>
                                    
                                    <div className="flex-1 space-y-2">
                                        {/* Task Title */}
                                        {editingTask === task.id ? (
                                            <input 
                                                autoFocus
                                                className="w-full bg-slate-950 text-white p-2 rounded border border-amber-500 outline-none"
                                                defaultValue={task.text}
                                                onBlur={(e) => updateTaskField(task.id, 'text', e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && setEditingTask(null)}
                                            />
                                        ) : (
                                            <div 
                                                onClick={() => viewMode === 'admin' && setEditingTask(task.id)}
                                                className={`text-lg font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'} ${viewMode === 'admin' ? 'cursor-pointer hover:text-amber-400' : ''}`}
                                            >
                                                {task.text}
                                            </div>
                                        )}
                                        
                                        {/* Notes */}
                                        <div className={`flex items-start gap-2 ${!task.notes && viewMode === 'client' ? 'hidden' : ''}`}>
                                            <FileText size={14} className="text-slate-600 mt-1 flex-shrink-0" />
                                            <textarea 
                                                placeholder={viewMode === 'admin' ? "Notas o detalles..." : ""}
                                                value={task.notes}
                                                readOnly={viewMode === 'client'}
                                                onChange={(e) => updateTaskField(task.id, 'notes', e.target.value)}
                                                className="w-full bg-transparent text-sm text-slate-400 outline-none resize-none placeholder-slate-700"
                                                rows={task.notes ? Math.max(1, task.notes.split('\n').length) : 1}
                                            />
                                        </div>

                                        {/* ACTION BUTTON (INTELLIGENT LINK) */}
                                        {(viewMode === 'admin' || task.link) && (
                                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/50">
                                                {task.link && (
                                                    <a href={task.link} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all border shadow-lg ${
                                                        isInternalTool(task.link) 
                                                        ? 'bg-amber-500 text-slate-900 border-amber-400 hover:bg-amber-400 hover:scale-105' 
                                                        : 'bg-slate-800 text-blue-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                                                    }`}>
                                                        {isInternalTool(task.link) ? <Cpu size={14} /> : <ExternalLink size={14} />}
                                                        {isInternalTool(task.link) ? 'EJECUTAR HERRAMIENTA' : 'ABRIR RECURSO'}
                                                    </a>
                                                )}
                                                
                                                {viewMode === 'admin' && (
                                                    <div className="flex-1 flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 focus-within:border-slate-600 transition-colors">
                                                        <HardDrive size={12} className="text-slate-600" />
                                                        <input 
                                                            placeholder="Pegar URL (Drive, JairoAmaya.co, etc)..."
                                                            value={task.link || ''}
                                                            onChange={(e) => updateTaskField(task.id, 'link', e.target.value)}
                                                            className="w-full bg-transparent text-xs text-blue-300 outline-none placeholder-slate-700"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {viewMode === 'admin' && (
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SIDEBAR INFO */}
            <div className="space-y-6">
                <div className={`${styles.glassCard} p-6 rounded-2xl`}>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" /> Stats de Fase
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Completado</span>
                            <span className="text-white font-bold">{selectedProject.data[activePhase]?.filter(t => t.completed).length} items</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Total</span>
                            <span className="text-white font-bold">{selectedProject.data[activePhase]?.length} items</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full" style={{width: `${selectedProject.data[activePhase]?.length > 0 ? (selectedProject.data[activePhase]?.filter(t => t.completed).length / selectedProject.data[activePhase]?.length) * 100 : 0}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER SAME AS DASHBOARD */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md pt-12 pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
                <h4 className={`text-2xl font-bold text-white mb-2 ${styles.fontHeading}`}>JAIRO AMAYA</h4>
                <div className="flex items-center gap-2">
                    <span className="h-0.5 w-8 bg-amber-500"></span>
                    <p className="text-amber-500 font-bold text-sm tracking-wider uppercase">Full Stack Marketer</p>
                </div>
                <p className="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">
                    Transformando marcas con estrategias orientadas a resultados tangibles.
                </p>
            </div>
            
            <div>
                <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Ecosistema</h5>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="https://jairoamaya.co/auditor-seo-interactivo/" target="_blank" className="hover:text-amber-500 transition-colors">Auditor SEO</a></li>
                    <li><a href="https://jairoamaya.co/matriz-de-prioridad-seo/" target="_blank" className="hover:text-amber-500 transition-colors">Matriz de Prioridad</a></li>
                    <li><a href="#" className="hover:text-amber-500 transition-colors">Consultoría</a></li>
                </ul>
            </div>

            <div className="flex flex-col md:items-end">
                 <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Estado</h5>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs text-green-500 font-mono font-bold">SYSTEM OPERATIONAL</span>
                 </div>
                 <div className="flex gap-4">
                    <a href="https://www.linkedin.com/in/jairoamaya" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Linkedin size={18} /></a>
                    <a href="https://twitter.com" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Twitter size={18} /></a>
                    <a href="https://jairoamaya.co" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Globe size={18} /></a>
                </div>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>© 2026 Jairo Amaya - Full Stack Marketer. All rights reserved.</p>
            <p className="font-mono">v5.0.0 BUILD 2026</p>
        </div>
      </footer>
    </div>
  );
}
