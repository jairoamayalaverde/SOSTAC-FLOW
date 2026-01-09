import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Circle, Calendar, 
  Save, X, Briefcase, Eye, EyeOff, LayoutDashboard, 
  ArrowLeft, ExternalLink, BarChart3, FileText, RefreshCw,
  Activity, Zap, Target, Layers, ArrowUpRight, Share2, 
  Github, Twitter, Linkedin, Globe, HardDrive, Cpu
} from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS ---
const styles = {
  fontHeading: "font-['Poppins',_sans-serif]",
  fontBody: "font-['Raleway',_sans-serif]",
  glassCard: "bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl",
  activeTab: "bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  inactiveTab: "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
  primaryBtn: "bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all",
  neonText: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
};

// --- DATA: TEMPLATES CON HERRAMIENTAS JAIRO AMAYA INTEGRADAS ---
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
            link: 'https://jairoamaya.co/auditor-seo-interactivo/' // <--- INTEGRACIÓN AUDITOR
        },
        { id: 's2', text: 'Keyword Research Transaccional', completed: false, notes: '', link: '' },
      ],
      objectives: [
        { id: 'o1', text: '+40% Tráfico Orgánico YoY', completed: false, notes: '', link: '' },
      ],
      strategy: [{ id: 'st1', text: 'Content Hubs Temáticos', completed: false, notes: '', link: '' }],
      tactics: [
          { 
              id: 't1', 
              text: 'Matriz de Prioridad (Impacto vs Esfuerzo)', 
              completed: false, 
              notes: 'Clasificar hallazgos de la auditoría para definir Quick Wins.', 
              link: 'https://jairoamaya.co/matriz-de-prioridad-seo/' // <--- INTEGRACIÓN MATRIZ
          },
          { id: 't2', text: '4 Artículos Pilar / Mes', completed: false, notes: '', link: '' }
      ],
      action: [{ id: 'a1', text: 'Sprint 1: Technical Fixes', completed: false, notes: '', link: '' }],
      control: [{ id: 'c1', text: 'Setup GA4 + GSC', completed: false, notes: '', link: '' }]
    }
  },
  personal_brand: {
    name: 'Marca Personal',
    description: 'Posicionamiento de Líderes',
    data: {
      situation: [
        { id: 'pb1', text: 'Auditoría de Huella Digital Actual', completed: false, notes: 'Googlear nombre y analizar SERP.', link: '' },
        { id: 'pb2', text: 'Definición de Arquetipo de Marca', completed: false, notes: '¿Sabio, Héroe o Gobernante?', link: '' },
      ],
      objectives: [
        { id: 'po1', text: 'Ser Top of Mind en el nicho', completed: false, notes: '', link: '' },
        { id: 'po2', text: 'Crecer 10k seguidores en LinkedIn', completed: false, notes: '', link: '' },
      ],
      strategy: [
        { id: 'pst1', text: 'Estrategia de Contenidos "Thought Leadership"', completed: false, notes: 'Opinión experta vs contenido educativo.', link: '' },
      ],
      tactics: [
        { id: 'pt1', text: 'Newsletter Semanal (Substack)', completed: false, notes: '', link: '' },
      ],
      action: [
        { id: 'pa1', text: 'Semana 1: Optimización de Perfiles Sociales', completed: false, notes: '', link: '' },
      ],
      control: [
        { id: 'pc1', text: 'Métricas de Engagement (SSI LinkedIn)', completed: false, notes: '', link: '' },
      ]
    }
  },
  smo: {
    name: 'SMO (Social Media)',
    description: 'Optimización de Redes Sociales',
    data: {
      situation: [
        { id: 'sm1', text: 'Auditoría de Canales Actuales', completed: false, notes: '', link: '' },
      ],
      objectives: [
        { id: 'mo1', text: 'Aumentar Engagement Rate al 5%', completed: false, notes: '', link: '' },
      ],
      strategy: [
        { id: 'mst1', text: 'Estrategia de Contenido Visual (Reels/TikTok)', completed: false, notes: '', link: '' },
      ],
      tactics: [
        { id: 'mt1', text: 'Calendario Editorial Mensual', completed: false, notes: '', link: '' },
      ],
      action: [
        { id: 'ma1', text: 'Producción de Lote de Contenido (Batch)', completed: false, notes: '', link: '' },
      ],
      control: [
        { id: 'mc1', text: 'Reporte Mensual de Alcance e Interacción', completed: false, notes: '', link: '' },
      ]
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
  
  // Persistencia
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ja_os_projects');
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length === 0) {
      // PROYECTO DEMO CON ENLACES A TUS HERRAMIENTAS
      const demoData = JSON.parse(JSON.stringify(projectTemplates.seo.data));
      return [{
        id: 1,
        name: 'Demo: E-commerce Growth',
        client: 'TechStore Global',
        industry: 'Retail',
        projectType: 'seo',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: 10,
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

  // Recálculo de progreso
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

  // --- ACTIONS ---
  const handleHardReset = () => {
    if(confirm('⚠️ ¿Reiniciar Sistema? Se borrarán todos los datos locales.')) {
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

  // Task Operations
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

  // Helper para detectar links propios
  const isInternalTool = (url) => url.includes('jairoamaya.co');

  // --- RENDER HELPERS ---
  const totalProjects = projects.length;
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) : 0;
  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);

  // 1. MODAL NUEVO PROYECTO
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

  // 2. DASHBOARD DE PROYECTOS (HOME)
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 flex flex-col justify-between">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      {/* FONDO ANIMADO TECH */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Sistema Operativo v3.1</span>
            </div>
            <h1 className={`text-5xl font-bold text-white tracking-tight ${styles.fontHeading}`}>
              SOSTAC <span className={styles.neonText}>FLOW</span>
            </h1>
            <p className={`text-slate-400 mt-2 ${styles.fontBody}`}>Ingeniería de Marketing & Gestión Estratégica</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button 
              onClick={handleHardReset}
              className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
            >
              <RefreshCw size={14} /> RESET
            </button>
            <button 
              onClick={() => setShowNewProject(true)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm ${styles.primaryBtn}`}
            >
              <Plus size={18} /> NUEVA ESTRATEGIA
            </button>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden`}>
                <Layers size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50" />
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Estrategias Activas</h3>
                <div className="text-4xl font-bold text-white">{totalProjects}</div>
            </div>
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden`}>
                <Activity size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50" />
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Progreso Global</h3>
                <div className="text-4xl font-bold text-white">{avgProgress}%</div>
                <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{width: `${avgProgress}%`}}></div>
                </div>
            </div>
            <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden`}>
                <Target size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50" />
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Entregables</h3>
                <div className="text-4xl font-bold text-white">{totalTasks}</div>
            </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="mb-12">
            <h2 className={`text-xl font-bold text-white mb-6 flex items-center gap-2 ${styles.fontHeading}`}>
                <Briefcase size={20} className="text-amber-500" /> Proyectos Recientes
            </h2>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
                    <p className="text-slate-500">No hay operaciones activas.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                    <div 
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`group cursor-pointer rounded-xl p-6 transition-all border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-lg relative overflow-hidden`}
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className={`text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors ${styles.fontHeading}`}>{project.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>{project.client}</span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span className="text-amber-500 uppercase font-bold">{projectTemplates[project.projectType]?.name}</span>
                                </div>
                            </div>
                            <div className="text-xl font-bold text-slate-700 group-hover:text-white transition-colors">
                                {project.progress}%
                            </div>
                        </div>
                        
                        <div className="flex gap-1 mt-4">
                            {phases.map((ph, idx) => {
                                const pTasks = project.data[ph.id] || [];
                                const hasProgress = pTasks.some(t => t.completed);
                                return (
                                    <div key={idx} className={`h-1 flex-1 rounded-full ${hasProgress ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                                )
                            })}
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>

      </div>

      {/* FOOTER IMPACTANTE */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 pt-12 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <h4 className={`text-xl font-bold text-white mb-2 ${styles.fontHeading}`}>JAIRO AMAYA</h4>
                <p className="text-slate-500 text-sm">Consultor de Marketing Digital & Estrategia</p>
            </div>
            
            <div className="flex gap-6">
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="https://jairoamaya.co" target="_blank" className="text-slate-500 hover:text-white transition-colors"><Globe size={20} /></a>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Systems Operational</span>
                 </div>
                 <span className="text-[10px] text-slate-600">© 2026 Jairo Amaya OS. All rights reserved.</span>
            </div>
        </div>
      </footer>
    </div>
  );

  // 3. VISTA DE PROYECTO
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* PHASE NAVIGATOR */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex min-w-max gap-3 p-1">
          {phases.map((phase) => {
            const isActive = activePhase === phase.id;
            const tasks = selectedProject.data[phase.id] || [];
            const completedCount = tasks.filter(t => t.completed).length;
            const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
            
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-2xl border transition-all ${
                    isActive 
                    ? 'bg-slate-900 border-amber-500 shadow-lg scale-105' 
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className={`text-2xl ${isActive ? 'scale-110 transition-transform' : 'opacity-50'}`}>{phase.icon}</div>
                <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-slate-500'}`}>{phase.name}</span>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                    <div className={`${progress === 100 ? 'bg-green-500' : 'bg-amber-500'} h-full transition-all`} style={{width: `${progress}%`}}></div>
                </div>
              </button>
            )
          })}
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="grid lg:grid-cols-3 gap-8">
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
                            <div key={task.id} className={`group bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-slate-600 transition-all ${task.completed ? 'opacity-70' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        disabled={viewMode === 'client'}
                                        className={`mt-1 ${task.completed ? 'text-green-500' : 'text-slate-600 hover:text-amber-500'}`}
                                    >
                                        {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                    </button>
                                    
                                    <div className="flex-1 space-y-2">
                                        {/* Titulo Tarea */}
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
                                                className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'} ${viewMode === 'admin' ? 'cursor-pointer' : ''}`}
                                            >
                                                {task.text}
                                            </div>
                                        )}
                                        
                                        {/* Notas / Descripcion */}
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

                                        {/* LINK / RECURSO (CON DETECCIÓN JAIRO AMAYA) */}
                                        {(viewMode === 'admin' || task.link) && (
                                            <div className="flex items-center gap-2 mt-2">
                                                {task.link && (
                                                    <a href={task.link} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-all border ${
                                                        isInternalTool(task.link) 
                                                        ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold hover:bg-amber-400' 
                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white'
                                                    }`}>
                                                        {isInternalTool(task.link) ? <Cpu size={12} /> : <ExternalLink size={12} />}
                                                        {isInternalTool(task.link) ? 'EJECUTAR HERRAMIENTA' : 'Abrir Recurso'}
                                                    </a>
                                                )}
                                                
                                                {viewMode === 'admin' && (
                                                    <div className="flex-1 flex items-center gap-2 bg-slate-950 px-2 py-1 rounded border border-slate-800 focus-within:border-slate-600">
                                                        <HardDrive size={12} className="text-slate-600" />
                                                        <input 
                                                            placeholder="Pegar URL (Drive, Docs, JairoAmaya.co)..."
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
                                            <Trash2 size={16} />
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
    </div>
  );
}
