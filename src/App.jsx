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

// --- 0. CONFIGURACIÓN SUPABASE ---
const SUPABASE_URL = 'https://hompawsonronlgrvujjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbXBhd3NvbnJvbmxncnZ1ampiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODI0MTMsImV4cCI6MjA4MzU1ODQxM30.UicwlthUkU9Ey5KltrZwdK7ZkTxHcYr4hr5foDUCW0A';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

const projectTemplates = {
  seo: {
    name: 'Consultoría SEO',
    description: 'Diagnóstico + Estrategia + Priorización',
    data: {
      situation: [{ id: 's1', text: 'Auditoría Técnica', completed: true, notes: '', link: '' }],
      objectives: [], strategy: [], tactics: [], action: [], control: []
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [newProjectData, setNewProjectData] = useState({
    name: '', client: '', industry: '', projectType: 'seo', startDate: new Date().toISOString().split('T')[0]
  });

  const initializedRef = useRef(false);

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

  const fetchProjects = async (userId) => {
    setLoadingProjects(true);
    const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
    if (!error && data) {
        setProjects(data.map(p => ({ ...p, data: p.data })));
    }
    setLoadingProjects(false);
  };

  const saveProjectToCloud = useCallback(async (projectToSave) => {
    if (!session) return;
    setSaving(true);
    const { id, created_at, ...updateData } = projectToSave;
    if (id < 10000000000) {
        await supabase.from('projects').update({
            name: updateData.name, progress: updateData.progress, data: updateData.data, updated_at: new Date()
        }).eq('id', id);
    }
    setSaving(false);
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else setLoginMessage('Enlace enviado. Revisa tu email.');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setProjects([]); setSelectedProject(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("SOSTAC Report", 10, 10);
    doc.save("report.pdf");
  };

  const totalTasks = projects.reduce((acc, p) => {
      let count = 0;
      Object.values(p.data).forEach(arr => count += arr.length);
      return acc + count;
  }, 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length) : 0;

  if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500">Cargando...</div>;

  if (!session) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800">
            <h1 className="text-3xl font-bold text-white mb-6">SOSTAC <span className="text-amber-500">FLOW</span></h1>
            {!loginMessage ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="tu@email.com" className="w-full bg-slate-950 p-4 rounded-lg text-white border border-slate-700" value={email} onChange={e => setEmail(e.target.value)} required />
                    <button className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-lg">ACCEDER</button>
                </form>
            ) : <div className="text-green-400">{loginMessage}</div>}
        </div>
    </div>
  );

  if (showAnalytics && selectedProject) {
    return <DashboardAnalytics proyecto={selectedProject} onClose={() => setShowAnalytics(false)} />;
  }

  if (!selectedProject) return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold">SOSTAC <span className={styles.neonText}>FLOW</span></h1>
        <button onClick={handleLogout} className="text-slate-500 hover:text-white">Salir</button>
      </header>
      <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {projects.map(project => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="p-6 border border-slate-800 bg-slate-900/40 rounded-xl cursor-pointer hover:border-amber-500/50 transition-all relative overflow-hidden">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">{project.name}</h3>
                        <p className="text-xs text-slate-500">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-bold">{project.progress}%</div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setShowAnalytics(true); }}
                            className="p-3 bg-amber-500 text-slate-900 rounded-xl font-bold text-[10px] z-[50]"
                        >
                            MÉTRICAS
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="mt-20 text-center text-xs text-slate-600">
        <p>© 2026 Jairo Amaya - v10.0.0 CLOUD</p>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <nav className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 sticky top-0 z-50">
        <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-400 hover:text-white"><ArrowLeft size={18}/> Volver</button>
        <div className="flex gap-4">
          <button onClick={() => setViewMode(viewMode === 'admin' ? 'client' : 'admin')} className="text-xs font-bold px-3 py-1 bg-slate-800 rounded">{viewMode === 'admin' ? 'EDITOR' : 'CLIENTE'}</button>
          <button onClick={generatePDF} className="text-amber-500"><Download size={20}/></button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-8 w-full">
        <div className="flex gap-2 overflow-x-auto pb-6">
            {phases.map(p => (
                <button key={p.id} onClick={() => setActivePhase(p.id)} className={`flex-1 min-w-[120px] p-4 rounded-xl border ${activePhase === p.id ? 'border-amber-500 bg-slate-900' : 'border-slate-800 bg-slate-900/40'}`}>
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="text-[10px] uppercase font-bold">{p.name}</div>
                </button>
            ))}
        </div>
        <div className="p-10 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
            <h2 className="text-xl font-bold">Fase: {activePhase.toUpperCase()}</h2>
            <p className="text-slate-500 mt-2">Contenido de la estrategia cargado.</p>
        </div>
      </main>
    </div>
  );
}
