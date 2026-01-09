import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Circle, Calendar, 
  Save, X, Briefcase, Eye, EyeOff, LayoutDashboard, 
  ArrowLeft, ExternalLink, BarChart3 
} from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS Y TIPOGRAFÍA ---
const styles = {
  fontHeading: "font-['Poppins',_sans-serif]",
  fontBody: "font-['Raleway',_sans-serif]",
  glassCard: "bg-slate-800/50 backdrop-blur-xl border border-white/10 shadow-xl",
  activeTab: "bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  inactiveTab: "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
  primaryBtn: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/20",
  secondaryBtn: "bg-slate-700 hover:bg-slate-600 text-white border border-white/10"
};

// --- DATA INICIAL (TEMPLATES) ---
const projectTemplates = {
  blank: {
    name: 'Proyecto en Blanco',
    description: 'Empieza desde cero',
    data: { situation: [], objectives: [], strategy: [], tactics: [], action: [], control: [] }
  },
  seo: {
    name: 'Consultoría SEO High-Ticket',
    description: 'Posicionamiento y Autoridad',
    data: {
      situation: [
        { id: 's1', text: 'Auditoría SEO Técnica (Score < 80)', completed: false, notes: '' },
        { id: 's2', text: 'Análisis de Brecha de Contenidos', completed: false, notes: '' },
        { id: 's3', text: 'Investigación de Competencia Top 3', completed: false, notes: '' },
      ],
      objectives: [
        { id: 'o1', text: 'Aumentar tráfico orgánico en 40%', completed: false, notes: '' },
        { id: 'o2', text: 'Posicionar 5 keywords transaccionales', completed: false, notes: '' },
      ],
      strategy: [
        { id: 'st1', text: 'Pilar de Contenidos: Autoridad de Nicho', completed: false, notes: '' },
        { id: 'st2', text: 'Link Building: Calidad sobre Cantidad', completed: false, notes: '' },
      ],
      tactics: [
        { id: 't1', text: 'Optimización On-Page (Matriz Prioridad)', completed: false, notes: '' },
        { id: 't2', text: 'Creación de 4 artículos Pilar/mes', completed: false, notes: '' },
      ],
      action: [
        { id: 'a1', text: 'Semana 1: Correcciones Técnicas Críticas', completed: false, notes: '' },
        { id: 'a2', text: 'Semana 2-4: Producción de Contenido', completed: false, notes: '' },
      ],
      control: [
        { id: 'c1', text: 'Dashboard GA4 + GSC Configurado', completed: false, notes: '' },
        { id: 'c2', text: 'Reporte Mensual de Posiciones', completed: false, notes: '' },
      ]
    }
  },
  branding: {
    name: 'Transformación de Marca',
    description: 'Identidad y Posicionamiento',
    data: { situation: [], objectives: [], strategy: [], tactics: [], action: [], control: [] } 
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
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'client'
  
  // Persistencia de Proyectos con LÓGICA DE DEMO FORZADA
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ja_os_projects');
    
    // Convertimos lo guardado a objeto o array vacío
    const parsedProjects = saved ? JSON.parse(saved) : [];

    // SI NO HAY PROYECTOS (array vacío o null), CARGAMOS EL DEMO
    if (parsedProjects.length === 0) {
      return [{
        id: 1,
        name: 'Proyecto Demo: E-commerce',
        client: 'Cliente Ejemplo S.A.',
        industry: 'Retail / Tech',
        projectType: 'seo',
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: 15, 
        data: projectTemplates.seo.data
      }];
    }
    
    // Si ya hay proyectos reales, los devolvemos
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

  // --- FUNCIONES ---
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
    // Reset form
    setNewProjectData({ name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0] });
  };

  const updateProjectData = (newData) => {
    const updatedProject = { ...selectedProject, data: newData };
    
    // Recalcular progreso global
    let total = 0, completed = 0;
    Object.values(newData).forEach(phase => {
      total += phase.length;
      completed += phase.filter(t => t.completed).length;
    });
    updatedProject.progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    setSelectedProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const toggleTask = (taskId) => {
    if (viewMode === 'client') return; // Clientes no tocan
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

  // --- RENDERIZADO ---

  // 1. MODAL NUEVO PROYECTO
  if (showNewProject) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className={`max-w-2xl w-full ${styles.glassCard} rounded-2xl p-8 animate-in fade-in zoom-in duration-300`}>
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
            Crear Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // 2. DASHBOARD DE PROYECTOS (HOME)
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-amber-500/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-2 ${styles.fontHeading}`}>
              SOSTAC <span className="text-amber-500 italic">FLOW</span>
            </h1>
            <p className={`text-slate-400 ${styles.fontBody}`}>Sistema Operativo de Consultoría Estratégica</p>
          </div>
          <button 
            onClick={() => setShowNewProject(true)}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold ${styles.primaryBtn}`}
          >
            <Plus size={20} /> Nuevo Proyecto
          </button>
        </header>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
            <LayoutDashboard size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-500">No tienes proyectos activos. Crea el primero para comenzar.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group cursor-pointer rounded-2xl p-6 transition-all hover:-translate-y-1 ${styles.glassCard} hover:border-amber-500/50`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${styles.activeTab} bg-amber-500/10 text-amber-500`}>
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                    {project.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold text-white mb-1 ${styles.fontHeading}`}>{project.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{project.client}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Progreso SOSTAC</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000" 
                      style={{width: `${project.progress}%`}}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 3. VISTA DE DETALLE DE PROYECTO
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

          {/* CONTROLES ADMIN / CLIENTE */}
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
                      
                      <textarea 
                        placeholder={viewMode === 'admin' ? "Notas estratégicas, enlaces o detalles..." : "Sin notas adicionales."}
                        value={task.notes}
                        readOnly={viewMode === 'client'}
                        onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                        className={`w-full bg-transparent text-sm resize-none outline-none ${task.completed ? 'text-slate-600' : 'text-slate-400'} focus:text-white placeholder-slate-600`}
                        rows={task.notes ? 2 : 1}
                      />
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
