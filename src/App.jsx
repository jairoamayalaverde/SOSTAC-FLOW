import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, Calendar, 
  Briefcase, LayoutDashboard, ArrowUpRight, 
  BarChart3, FileText, Zap, Target, Download, 
  LogOut, Activity, ExternalLink 
} from 'lucide-react';
import jsPDF from 'jspdf';
import { createClient } from '@supabase/supabase-js';

// 👇 1. IMPORTACIÓN NUEVA
import ProjectAnalytics from './components/ProjectAnalytics';

// --- CONFIGURACIÓN SUPABASE ---
// (Si tus claves no están en .env, pégalas aquí directamente entre comillas)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 2. ESTADO NUEVO PARA LA NAVEGACIÓN
  const [selectedProject, setSelectedProject] = useState(null);

  // Estados para formularios
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    client: '', 
    description: '',
    sostac_data: {} 
  });
  
  // Auth state
  const [authMode, setAuthMode] = useState('magic_link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjects();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    }
  }

  // --- HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      alert('¡Revisa tu correo para el Magic Link!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('projects')
        .insert([{
          name: formData.name,
          client: formData.client,
          description: formData.description,
          user_id: user.id,
          sostac_data: initializeSOSTAC() // Estructura vacía inicial
        }]);

      if (error) throw error;
      setShowModal(false);
      setFormData({ name: '', client: '', description: '', sostac_data: {} });
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
      alert('Error creando proyecto');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProjects([]);
    setSelectedProject(null);
  };

  // Helper para inicializar datos vacíos
  const initializeSOSTAC = () => ({
    situation: [], objectives: [], strategy: [], tactics: [], action: [], control: []
  });

  // Generador PDF simple
  const generatePDF = (project) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Plan Estratégico: ${project.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${project.client}`, 20, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.save(`SOSTAC_${project.name}.pdf`);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando...</div>;

  // Pantalla de Login
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">SOSTAC FLOW</h1>
            <p className="text-slate-400">Acceso Corporativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="correo@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
              required 
            />
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-lg transition-colors">
              Enviar Magic Link
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 👇 3. AQUÍ ESTÁ EL INTERRUPTOR MÁGICO
  // Si hay un proyecto seleccionado, mostramos la vista "Ferrari"
  if (selectedProject) {
    return (
      <ProjectAnalytics 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  // Vista Principal (Dashboard)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">SF</div>
            <span className="font-bold text-xl tracking-tight text-white">SOSTAC FLOW</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Proyectos Activos</h1>
            <p className="text-slate-400">Gestiona tus estrategias de marketing</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus size={20} /> Nuevo Proyecto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No hay proyectos aún</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Comienza creando tu primera estrategia SOSTAC para visualizar métricas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-xl p-6 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-800 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(project.id)} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">{project.name}</h3>
                <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                  <Briefcase size={14} /> {project.client}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* 👇 4. EL BOTÓN QUE ABRE EL FERRARI */}
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="col-span-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <LayoutDashboard size={16} className="text-amber-500" /> 
                    Ver Dashboard
                  </button>

                  <button 
                    onClick={() => generatePDF(project)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <Download size={14} /> PDF
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-slate-700">
                    <ExternalLink size={14} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL CREAR PROYECTO */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Nuevo Plan Estratégico</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 outline-none"
                  placeholder="Ej: Lanzamiento Q1"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cliente / Marca</label>
                <input 
                  type="text" 
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 outline-none"
                  placeholder="Ej: Tesla Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-amber-500 outline-none h-24 resize-none"
                  placeholder="Objetivos principales..."
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 font-bold">Crear Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
