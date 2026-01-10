import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle, Circle, Calendar, 
  Save, X, Briefcase, Eye, EyeOff, LayoutDashboard, 
  ArrowLeft, ExternalLink, BarChart3, FileText, RefreshCw,
  Activity, Zap, Target, Layers, ArrowUpRight, Share2, 
  Github, Twitter, Linkedin, Globe, HardDrive, Cpu, Terminal,
  Database, Network, Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import { createClient } from '@supabase/supabase-js';
import DashboardAnalytics from './DashboardAnalytics';


// --- 0. CONFIGURACIÓN SUPABASE (TUS CREDENCIALES) ---
const SUPABASE_URL = 'https://hompawsonronlgrvujjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXBhd3NvbnJvbmxncnZ1ampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODI0MTMsImV4cCI6MjA4MzU1ODQxM30.UicwlthUkU9Ey5KltrZwdK7ZkTxHcYr4hr5foDUCW0A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. ESTILOS & BRANDING ---
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

// --- 2. DATA: TEMPLATES COMPLETOS (SIN RECORTES) ---
const projectTemplates = {
  seo: {
    name: 'Consultoría SEO',
    description: 'Diagnóstico + Estrategia + Priorización',
    data: {
      situation: [
        { 
            id: 's1', 
            text: 'Ejecutar Auditoría Técnica Inicial', 
            completed: true, 
            notes: 'Diagnóstico de salud del sitio usando herramienta propietaria (Crawl/Index).', 
            link: 'https://jairoamaya.co/auditor-seo-interactivo/' 
        },
        { id: 's2', text: 'Análisis de Competencia (Top 3 SERP)', completed: true, notes: 'Competidor A domina keywords informacionales. Oportunidad en transaccionales.', link: '' },
        { id: 's3', text: 'Keyword Research Transaccional', completed: false, notes: 'Foco en long-tail keywords con intención de compra alta.', link: '' },
        { id: 's4', text: 'Revisión de Perfil de Enlaces (Backlinks)', completed: false, notes: 'Análisis de toxicidad y autoridad de dominio.', link: '' },
        { id: 's5', text: 'Benchmark de Velocidad (Core Web Vitals)', completed: true, notes: 'LCP en móvil necesita optimización urgente (3.5s).', link: '' },
      ],
      objectives: [
        { id: 'o1', text: '+40% Tráfico Orgánico Calificado', completed: false, notes: 'Meta: 15,000 visitas/mes para Q3.', link: '' },
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
              link: 'https://jairoamaya.co/matriz-de-prioridad-seo/'
          },
          { id: 't2', text: 'Optimización On-Page de 20 URLs Prioritarias', completed: false, notes: 'Ajuste de H-Tags y NLP.', link: '' },
          { id: 't3', text: 'Creación de 4 Artículos "Pilar" Mensuales', completed: false, notes: 'Contenido de >1500 palabras.', link: '' },
          { id: 't4', text: 'Implementación de Schema Markup', completed: false, notes: 'Product, FAQ y Organization.', link: '' },
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
  smo: {
    name: 'Social Growth Engineering',
    description: 'Distribución y Arquitectura de Canales',
    data: {
      situation: [
        { id: 'sm1', text: 'Mapeo de Ecosistema Digital', completed: false, notes: 'Análisis de dónde reside la atención real del usuario.', link: '' },
        { id: 'sm2', text: 'Análisis de Fugas de Tráfico', completed: false, notes: '¿Dónde se pierden los usuarios entre redes y web?', link: '' },
        { id: 'sm3', text: 'Benchmark Competitivo (Social)', completed: false, notes: 'Análisis de engagement y formatos de la competencia.', link: '' },
      ],
      objectives: [
        { id: 'mo1', text: 'Construcción de Activos Propios (Data)', completed: false, notes: 'Convertir seguidores (rentado) en base de datos (propio).', link: '' },
      ],
      strategy: [
        { id: 'mst1', text: 'Distribución de Contenido Líquido', completed: false, notes: 'Un mensaje central, múltiples formatos de distribución.', link: '' },
      ],
      tactics: [
        { id: 'mt1', text: 'Automatización de Flujos (ManyChat/Zapier)', completed: false, notes: 'Sistemas de respuesta y captura de leads automáticos.', link: '' },
        { id: 'mt2', text: 'Calendario Editorial Interactivo', completed: false, notes: '', link: '' },
      ],
      action: [
        { id: 'ma1', text: 'Implementación de Pixels y Tracking', completed: false, notes: 'Medición exacta de la atribución social.', link: '' },
        { id: 'ma2', text: 'Producción de Activos Visuales', completed: false, notes: '', link: '' },
      ],
      control: [
        { id: 'mc1', text: 'Informe de Atribución y Conversión', completed: false, notes: 'ROI real de los esfuerzos sociales.', link: '' },
      ]
    }
  },
  personal_brand: {
    name: 'Marca Personal High-Ticket',
    description: 'Posicionamiento de Autoridad',
    data: {
      situation: [
        { id: 'pb1', text: 'Auditoría de Reputación Online', completed: false, notes: '', link: '' },
        { id: 'pb2', text: 'Definición de Propuesta de Valor Única', completed: false, notes: '', link: '' },
      ],
      objectives: [
        { id: 'po1', text: 'Convertirse en Referente de Industria', completed: false, notes: '', link: '' },
      ],
      strategy: [{ id: 'pst1', text: 'Metodología Propietaria', completed: false, notes: 'Empaquetar el conocimiento en un sistema vendible.', link: '' }],
      tactics: [{ id: 'pt1', text: 'Networking Estratégico (B2B)', completed: false, notes: '', link: '' }],
      action: [{ id: 'pa1', text: 'Optimización de Perfil LinkedIn (Landing Page)', completed: false, notes: '', link: '' }],
      control: [{ id: 'pc1', text: 'Calidad de Inbound Leads', completed: false, notes: '', link: '' }]
    }
  },
  blank: {
    name: 'Proyecto en Blanco',
    description: 'Estrategia Personalizada',
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
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const [viewMode, setViewMode] = useState('admin');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhase, setActivePhase] = useState('situation');
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [newProjectData, setNewProjectData] = useState({
    name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0]
  });
const [showAnalytics, setShowAnalytics] = useState(false);
  const initializedRef = useRef(false);

  // --- SESIÓN Y CARGA INICIAL ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchProjects(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- BASE DE DATOS (SUPABASE) ---
  const fetchProjects = async (userId) => {
    setLoadingProjects(true);
    const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
    
    if (!error && data) {
        // Parsear el JSON 'data' que viene de la DB
        const parsedProjects = data.map(p => ({
            ...p,
            data: p.data // Supabase ya devuelve JSONB como objeto
        }));
        setProjects(parsedProjects);

        // --- AUTO-ONBOARDING: Si no hay proyectos, crear DEMO automáticamente ---
        if (parsedProjects.length === 0 && !initializedRef.current) {
            initializedRef.current = true; // Evitar bucles infinitos
            setOnboarding(true);
            setTimeout(() => {
                autoGenerateDemo(userId);
            }, 1500); // Pequeña espera para UX
        }
    }
    setLoadingProjects(false);
  };

  const autoGenerateDemo = async (userId) => {
      const template = projectTemplates['seo'];
      // Insertar directo sin pasar ID manual (Dejar que Supabase genere el ID)
      const { data, error } = await supabase.from('projects').insert([{
          name: 'Demo: Tech Growth Strategy',
          client: 'SaaS Unicorn Inc.',
          industry: 'Software / B2B',
          project_type: 'seo',
          start_date: new Date().toISOString().split('T')[0],
          status: 'active',
          progress: 13,
          data: template.data,
          user_id: userId
      }]).select();

      if (data && !error) {
          const newProject = { ...data[0], data: data[0].data };
          setProjects([newProject]);
          setOnboarding(false);
      }
  };

  const saveProjectToCloud = useCallback(async (projectToSave) => {
    if (!session) return;
    setSaving(true);
    
    const { id, created_at, ...updateData } = projectToSave;
    
    // Si el ID es un número grande (timestamp), es un proyecto local nuevo.
    // Si es un ID pequeño, es un ID de base de datos.
    const isLocalId = id > 10000000000;

    if (!isLocalId) {
        // ACTUALIZAR (UPDATE)
        await supabase.from('projects').update({
            name: updateData.name,
            client: updateData.client,
            progress: updateData.progress,
            data: updateData.data,
            updated_at: new Date()
        }).eq('id', id);
    } else {
        // CREAR NUEVO (INSERT)
        const { data } = await supabase.from('projects').insert([{
            name: updateData.name,
            client: updateData.client,
            industry: updateData.industry,
            project_type: updateData.projectType,
            start_date: updateData.startDate,
            status: 'active',
            progress: updateData.progress || 0,
            data: updateData.data,
            user_id: session.user.id
        }]).select();
        
        if (data && data[0]) {
            // Reemplazar el proyecto temporal con el real de la DB en el estado
            setProjects(prev => prev.map(p => p.id === id ? { ...data[0], data: data[0].data } : p));
            if (selectedProject && selectedProject.id === id) {
                setSelectedProject({ ...data[0], data: data[0].data });
            }
        }
    }
    setSaving(false);
  }, [session, selectedProject]);

  const updateProjectData = (newData) => {
    const updated = { ...selectedProject, data: newData };
    
    // Calcular progreso
    let total = 0, completed = 0;
    Object.values(newData).forEach(phase => {
        total += phase.length;
        completed += phase.filter(t => t.completed).length;
    });
    updated.progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));

    // Guardar en Nube
    saveProjectToCloud(updated);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
        alert('Error: ' + error.message);
    } else {
        setLoginMessage('¡Enlace mágico enviado! Revisa tu correo.');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProjects([]);
    setSelectedProject(null);
  };

  // --- LÓGICA DE NEGOCIO ---
  const createNewProject = async () => {
    const template = projectTemplates[newProjectData.projectType];
    const tempId = Date.now();
    const newProject = {
      id: tempId,
      ...newProjectData,
      status: 'active',
      progress: 0,
      data: JSON.parse(JSON.stringify(template.data))
    };
    
    setProjects([newProject, ...projects]);
    setShowNewProject(false);
    setNewProjectData({ name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0] });
    
    await saveProjectToCloud(newProject);
  };

  const toggleTask = (taskId) => {
    if (viewMode === 'client') return;
    const newData = { ...selectedProject.data };
    newData[activePhase] = newData[activePhase].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    updateProjectData(newData);
  };

  const addTask = () => {
    const newTask = { id: Date.now(), text: 'Nueva acción estratégica', completed: false, notes: '', link: '' };
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

  const generatePDF = () => {
    if (!selectedProject) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header Dark
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo & Titulo
    doc.setTextColor(245, 158, 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text('SOSTAC FLOW', 20, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('REPORTE EJECUTIVO DE ESTRATEGIA', 20, 30);

    // Info del Proyecto
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(selectedProject.name, 20, 55);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${selectedProject.client}`, 20, 62);
    doc.text(`Industria: ${selectedProject.industry}`, 20, 67);
    doc.text(`Fecha: ${selectedProject.startDate}`, 150, 62);
    doc.text(`Progreso: ${selectedProject.progress}%`, 150, 67);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, pageWidth - 20, 75);

    // Loop de Fases
    let yPos = 85;

    phases.forEach(phase => {
        const tasks = selectedProject.data[phase.id] || [];
        
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(20, yPos, 170, 8, 1, 1, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${phase.name.toUpperCase()} PHASE`, 25, yPos + 5.5);
        
        yPos += 15;

        if (tasks.length === 0) {
            doc.setTextColor(150, 150, 150);
            doc.setFont("helvetica", "italic");
            doc.text("Sin items registrados en esta fase.", 25, yPos);
            yPos += 10;
        } else {
            tasks.forEach(task => {
                doc.setDrawColor(0, 0, 0);
                if(task.completed) {
                    doc.setFillColor(34, 197, 94);
                    doc.rect(25, yPos - 3, 3, 3, 'F');
                } else {
                    doc.setFillColor(255, 255, 255);
                    doc.rect(25, yPos - 3, 3, 3, 'S');
                }

                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", task.completed ? "normal" : "bold");
                const splitText = doc.splitTextToSize(task.text, 150);
                doc.text(splitText, 32, yPos);
                
                yPos += (splitText.length * 5); 

                if(task.notes) {
                    doc.setTextColor(100, 100, 100);
                    doc.setFont("helvetica", "italic");
                    doc.setFontSize(9);
                    const splitNotes = doc.splitTextToSize(`Nota: ${task.notes}`, 140);
                    doc.text(splitNotes, 32, yPos);
                    yPos += (splitNotes.length * 4) + 2;
                    doc.setFontSize(10);
                } else {
                    yPos += 2;
                }

                if (yPos > pageHeight - 30) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        }
        yPos += 5;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(240, 240, 240);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text('Generado con SOSTAC FLOW | Jairo Amaya - Full Stack Marketer', 20, pageHeight - 10);
        doc.text(`jairoamaya.co`, pageWidth - 40, pageHeight - 10);
    }

    doc.save(`${selectedProject.client.replace(/\s+/g, '_')}_Strategy_Report.pdf`);
  };

  const handleHardReset = () => {
    if(confirm('⚠️ ¿REINICIAR SISTEMA? \n\nAtención: Esta acción borrará todos los proyectos guardados localmente. Úsala solo si necesitas restaurar la versión original.')) {
      localStorage.removeItem('ja_os_projects');
      window.location.reload();
    }
  };

  const isInternalTool = (url) => url && url.includes('jairoamaya.co');

  // --- CÁLCULOS DE MÉTRICAS (RESTAURADOS) ---
  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) : 0;
  
// --- PUERTA DE ACCESO A ANALYTICS ---
  if (showAnalytics && selectedProject) {
    return (
      <DashboardAnalytics 
        proyecto={selectedProject} 
        onClose={() => setShowAnalytics(false)} 
      />
    );
  }
  // --- RENDER: LOGIN SCREEN ---
  if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-bold animate-pulse">Cargando Sistema...</div>;

  if (!session) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center">
            <h1 className="text-3xl font-bold text-white mb-2 font-['Poppins']">SOSTAC <span className="text-amber-500">FLOW</span></h1>
            <p className="text-slate-400 mb-8 text-sm">Plataforma de Gestión Estratégica</p>
            
            {!loginMessage ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:border-amber-500 outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2">
                        <Zap size={20} /> ENVIAR ENLACE DE ACCESO
                    </button>
                </form>
            ) : (
                <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl text-green-400">
                    <CheckCircle className="mx-auto mb-2" size={32} />
                    {loginMessage}
                </div>
            )}
            <p className="mt-8 text-xs text-slate-600">v9.8.0 Cloud Edition (MASTER)</p>
        </div>
    </div>
  );

  // --- RENDER: DASHBOARD (HOME) ---
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      {/* FONDO ANIMADO TECH */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className={`text-5xl font-bold text-white tracking-tight ${styles.fontHeading}`}>
              SOSTAC <span className={styles.neonText}>FLOW</span>
            </h1>
            <p className={`text-slate-400 mt-2 ${styles.fontBody}`}>Gestión estratégica de proyectos de consultoría digital</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-500 font-mono hidden md:block flex items-center gap-1">{session.user.email}</span>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Cerrar Sesión">Salir</button>
            <button 
              onClick={() => setShowNewProject(true)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm ${styles.primaryBtn}`}
            >
              <Plus size={18} /> NUEVA ESTRATEGIA
            </button>
          </div>
        </header>

        {/* LOADING O BENTO GRID */}
       {/* CARGA O CONTENIDO PRINCIPAL */}
        {loadingProjects || onboarding ? (
            <div className="text-center py-20 animate-pulse">
                <div className="text-amber-500 font-bold text-xl mb-2">Inicializando Espacio de Trabajo...</div>
                <div className="text-slate-500 text-sm">Configurando base de datos segura y creando proyecto demo.</div>
            </div>
        ) : (
            <div className="w-full">
                {/* BENTO GRID SUPERIOR */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                        <Layers size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50 group-hover:opacity-100 group-hover:text-amber-500/10 transition-all" />
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Proyectos Activos</h3>
                        <div className="text-4xl font-bold text-white">{projects.length}</div>
                        <div className="flex items-center gap-2 text-xs text-green-400"><ArrowUpRight size={14} /> <span>Cloud Synced</span></div>
                    </div>
                    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                        <Activity size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50 group-hover:opacity-100 group-hover:text-amber-500/10 transition-all" />
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Eficiencia Global</h3>
                        <div className="text-4xl font-bold text-white">{avgProgress}%</div>
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2"><div className="bg-amber-500 h-full rounded-full" style={{width: `${avgProgress}%`}}></div></div>
                    </div>
                    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
                        <Target size={80} className="absolute -right-4 -top-4 text-slate-800 opacity-50 group-hover:opacity-100 group-hover:text-amber-500/10 transition-all" />
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Tareas en Radar</h3>
                        <div className="text-4xl font-bold text-white">{totalTasks}</div>
                        <div className="text-xs text-slate-500">Items estratégicos bajo gestión</div>
                    </div>
                </div>

                {/* CUERPO DEL DASHBOARD */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className={`text-xl font-bold text-white flex items-center gap-2 ${styles.fontHeading}`}><Briefcase size={20} className="text-amber-500" /> Proyectos en Curso</h2>
                        </div>
                        
                        {projects.length === 0 ? (
                            <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
                                <p className="text-slate-500">Tu espacio está listo. Crea tu primera estrategia.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {projects.map(project => (
                                    <div key={project.id} onClick={() => setSelectedProject(project)} className="group cursor-pointer rounded-xl p-6 transition-all border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-lg relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className={`text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors ${styles.fontHeading}`}>{project.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>{project.client}</span>
                                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                    <span className="text-amber-500 uppercase font-bold">{projectTemplates[project.projectType]?.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-xl font-bold text-slate-700 group-hover:text-white transition-colors">{project.progress}%</div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowAnalytics(true); }}
                                                    className="p-3 bg-amber-500 text-slate-900 rounded-xl font-bold text-[10px] z-[100] relative border-2 border-white shadow-xl hover:scale-105 transition-all"
                                                >
                                                    MÉTRICAS
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mt-4">
                                            {phases.map((ph, idx) => { 
                                                const pTasks = project.data[ph.id] || []; 
                                                const hasProgress = pTasks.some(t => t.completed); 
                                                return (<div key={idx} className={`h-1 flex-1 rounded-full ${hasProgress ? 'bg-amber-500' : 'bg-slate-800'}`}></div>) 
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* COLUMNA DERECHA: SIDEBAR DE ACCIONES (RESTAURADO) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className={`text-xl font-bold text-white flex items-center gap-2 ${styles.fontHeading}`}><Zap size={20} className="text-amber-500" /> Acciones Rápidas</h2>
                        </div>
                        <div className={`${styles.glassCard} p-6 rounded-2xl`}>
                            <div className="space-y-4">
                                <button onClick={() => setShowNewProject(true)} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center gap-3 group">
                                    <div className="p-2 bg-amber-500/10 rounded-md text-amber-500 group-hover:text-white group-hover:bg-amber-500 transition-colors"><Plus size={16} /></div>
                                    <div><div className="text-sm font-bold text-white">Nueva Estrategia</div><div className="text-xs text-slate-500">Crear desde template</div></div>
                                </button>
                                <button onClick={generatePDF} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center gap-3 group">
                                    <div className="p-2 bg-blue-500/10 rounded-md text-blue-500 group-hover:text-white group-hover:bg-blue-500 transition-colors"><Download size={16} /></div>
                                    <div><div className="text-sm font-bold text-white">Generar Reporte PDF</div><div className="text-xs text-slate-500">Descargar estado actual</div></div>
                                </button>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Integraciones</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs"><span className="text-slate-400">JairoAmaya.co</span><span className="text-green-400 font-mono flex items-center gap-1"><CheckCircle size={10} /> CONNECTED</span></div>
                               </div>
                </div>
            </div>
        )
      } 
    </div>
      
  
      
    {/* MODAL CREAR */}
    {showNewProject && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className={`max-w-4xl w-full ${styles.glassCard} p-8 rounded-2xl`}>
                <div className="flex justify-between mb-6"><h2 className="text-2xl text-white font-bold">Nuevo Proyecto</h2><button onClick={() => setShowNewProject(false)}><X className="text-slate-400 hover:text-white"/></button></div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <input className="w-full bg-slate-950 border border-slate-700 p-4 rounded-lg text-white" placeholder="Nombre del Proyecto" value={newProjectData.name} onChange={e => setNewProjectData({...newProjectData, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4"><input className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white" placeholder="Cliente" value={newProjectData.client} onChange={e => setNewProjectData({...newProjectData, client: e.target.value})} /><input className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white" placeholder="Industria" value={newProjectData.industry} onChange={e => setNewProjectData({...newProjectData, industry: e.target.value})} /></div>
                        <button onClick={createNewProject} disabled={!newProjectData.name} className={`w-full py-4 rounded-lg font-bold mt-4 ${styles.primaryBtn}`}>CREAR EN LA NUBE</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(projectTemplates).map(([key, tpl]) => (
                            <div key={key} onClick={() => setNewProjectData({...newProjectData, projectType: key})} className={`p-4 rounded-xl border mb-3 cursor-pointer flex justify-between group ${newProjectData.projectType === key ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800 border-slate-700'}`}>
                                <div><div className={`font-bold text-white group-hover:text-amber-400 transition-colors ${styles.fontHeading}`}>{tpl.name}</div><div className="text-xs text-slate-400">{tpl.description}</div></div>
                                {newProjectData.projectType === key && <CheckCircle size={18} className="text-amber-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md pt-12 pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2"><a href="https://jairoamaya.co" target="_blank" rel="noopener noreferrer" className="group block"><h4 className={`text-2xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors ${styles.fontHeading}`}>JAIRO AMAYA</h4><div className="flex items-center gap-2"><span className="h-0.5 w-8 bg-amber-500"></span><p className="text-amber-500 font-bold text-sm tracking-wider uppercase group-hover:text-white transition-colors">Full Stack Marketer</p></div></a><p className="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">Gestión estratégica de proyectos de consultoría digital.</p></div>
            <div><h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Recursos</h5><ul className="space-y-2 text-sm text-slate-500"><li><a href="https://jairoamaya.co/auditor-seo-interactivo/" target="_blank" className="hover:text-amber-500 transition-colors">Auditor SEO</a></li><li><a href="https://jairoamaya.co/matriz-de-prioridad-seo/" target="_blank" className="hover:text-amber-500 transition-colors">Matriz de Prioridad</a></li></ul></div>
            <div className="flex flex-col md:items-end"><h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Estado</h5><div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-4"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div><span className="text-xs text-green-500 font-mono font-bold">SYSTEM OPERATIONAL</span></div><div className="flex gap-4 mb-4"><a href="https://www.linkedin.com/in/jairoamayalaverde/" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Linkedin size={18} /></a><a href="https://twitter.com/JAIROAMAYA" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Twitter size={18} /></a><a href="https://jairoamaya.co" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Globe size={18} /></a></div></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600"><p>© 2026 Jairo Amaya Full Stack Marketer. All rights reserved.</p><p className="font-mono">v9.8.0 CLOUD EDITION (MASTER)</p></div>
      </footer>
    </div>
  );

  // --- RENDER: VISTA DE PROYECTO (COCKPIT) ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 flex flex-col justify-between">
      
      {/* HEADER STICKY (CON BOTÓN PDF Y SIN COMPARTIR) */}
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
            
            {/* BOTÓN PDF ACTIVO */}
            <button onClick={generatePDF} className="p-2 text-amber-500 hover:text-white transition-colors" title="Descargar Reporte PDF">
                <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        
        {/* PHASE NAVIGATOR (METRO LINE) */}
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

                                        {/* LINK / RECURSO (CON BOTÓN INTELIGENTE) */}
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

      {/* FOOTER (REPLICADO EN VISTA PROYECTO) */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md pt-12 pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
                <a href="https://jairoamaya.co" target="_blank" rel="noopener noreferrer" className="group block">
                    <h4 className={`text-2xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors ${styles.fontHeading}`}>JAIRO AMAYA</h4>
                    <div className="flex items-center gap-2">
                        <span className="h-0.5 w-8 bg-amber-500"></span>
                        <p className="text-amber-500 font-bold text-sm tracking-wider uppercase group-hover:text-white transition-colors">Full Stack Marketer</p>
                    </div>
                </a>
                <p className="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">
                   Gestión estratégica de proyectos de consultoría digital.
                </p>
            </div>
            
            <div>
                <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Recursos</h5>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="https://jairoamaya.co/auditor-seo-interactivo/" target="_blank" className="hover:text-amber-500 transition-colors">Auditor SEO</a></li>
                    <li><a href="https://jairoamaya.co/matriz-de-prioridad-seo/" target="_blank" className="hover:text-amber-500 transition-colors">Matriz de Prioridad</a></li>
                </ul>
            </div>

            <div className="flex flex-col md:items-end">
                 <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Estado</h5>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs text-green-500 font-mono font-bold">SYSTEM OPERATIONAL</span>
                 </div>
                 
                 <div className="flex gap-4 mb-4">
                    <a href="https://www.linkedin.com/in/jairoamayalaverde/" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Linkedin size={18} /></a>
                    <a href="https://twitter.com/JAIROAMAYA" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Twitter size={18} /></a>
                    <a href="https://jairoamaya.co" target="_blank" className="text-slate-500 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-600"><Globe size={18} /></a>
                </div>

                <button 
                    onClick={handleHardReset}
                    className="text-[10px] text-slate-700 hover:text-red-500 transition-colors flex items-center gap-1 font-mono uppercase"
                    title="Restaurar valores de fábrica"
                >
                    <RefreshCw size={10} /> [ DEV MODE: RESET DATA ]
                </button>
            </div>
        </div>
        
       <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>© 2026 Jairo Amaya Full Stack Marketer. All rights reserved.</p>
            <p className="font-mono">v10.0.0 CLOUD + ANALYTICS</p>
        </div>
      </footer>
    </div>
  );
}
