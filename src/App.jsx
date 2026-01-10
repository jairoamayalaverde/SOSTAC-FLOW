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
import DashboardAnalytics from './DashboardAnalytics'; // ← NUEVO IMPORT

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
  const [showAnalytics, setShowAnalytics] = useState(false); // ← NUEVO ESTADO
  
  const [newProjectData, setNewProjectData] = useState({
    name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0]
  });

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
        const parsedProjects = data.map(p => ({
            ...p,
            data: p.data
        }));
        setProjects(parsedProjects);

        if (parsedProjects.length === 0 && !initializedRef.current) {
            initializedRef.current = true;
            setOnboarding(true);
            setTimeout(() => {
                autoGenerateDemo(userId);
            }, 1500);
        }
    }
    setLoadingProjects(false);
  };

  const autoGenerateDemo = async (userId) => {
      const template = projectTemplates['seo'];
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
    const isLocalId = id > 10000000000;

    if (!isLocalId) {
        await supabase.from('projects').update({
            name: updateData.name,
            client: updateData.client,
            progress: updateData.progress,
            data: updateData.data,
            updated_at: new Date()
        }).eq('id', id);
    } else {
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
    
    let total = 0, completed = 0;
    Object.values(newData).forEach(phase => {
        total += phase.length;
        completed += phase.filter(t => t.completed).length;
    });
    updated.progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));

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
    
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(245, 158, 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text('SOSTAC FLOW', 20, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('REPORTE EJECUTIVO DE ESTRATEGIA', 20, 30);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(selectedProject.name, 20, 55);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${selectedProject.client}`, 20, 62);
    doc.text(`Industria: ${selectedProject.industry}`, 20, 67);
    doc.text(`Fecha: ${selectedProject.startDate || selectedProject.start_date}`, 150, 62);
    doc.text(`Progreso: ${selectedProject.progress}%`, 150, 67);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, pageWidth - 20, 75);

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

  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) : 0;

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
            <p className="mt-8 text-xs text-slate-600">v10.0.0 Cloud Edition + Analytics</p>
        </div>
    </div>
  );

  // --- RENDER: DASHBOARD (HOME) ---
  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');`}</style>
      
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1">
        
        <header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className={`text-5xl font-bold text-white tracking-tight ${styles.fontHeading}`}>
              SOSTAC <span className={styles.neonText}>FLOW</span>
            </h1>
            <p className={`text-slate-400 mt-2 ${styles.fontBody}`}>Gestión estratégica de proyectos de consultoría digital</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-slate-500 font-mono hidden md:block flex items-center gap-1">{session.user.email}
