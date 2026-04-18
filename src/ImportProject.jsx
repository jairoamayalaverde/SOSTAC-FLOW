import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

function ImportProject({ supabase, session }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Importando tu plan SOSTAC...');
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (!session) {
      setStatus('error');
      setMessage('Debes iniciar sesión para importar un proyecto');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const payload = urlParams.get('payload');

    if (!payload) {
      setStatus('error');
      setMessage('No se encontró información del proyecto');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    importFromEjecuta(payload);
  }, [session]);

  async function importFromEjecuta(encodedPayload) {
    try {
      // Decodificar payload
      const payload = JSON.parse(atob(encodedPayload));
      
      // Validar estructura
      if (!validatePayload(payload)) {
        throw new Error('Datos del proyecto inválidos');
      }

      // Verificar rate limit (máximo 10 imports por día)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', oneDayAgo);

      if (count >= 10) {
        throw new Error('Has alcanzado el límite de 10 imports por día');
      }

      // Mapear datos de ejecuta.seo a formato SOSTAC Flow
      const sostacData = mapEjecutaToSOSTAC(payload.sostacData);
      const initialProgress = calculateInitialProgress(sostacData);

      // Crear proyecto en Supabase
      const { data, error } = await supabase.from('projects').insert([{
        name: `SEO Plan - ${payload.domain}`,
        client: payload.domain,
        industry: 'SEO / Marketing Digital',
        project_type: 'seo',
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: initialProgress,
        data: sostacData,
        user_id: session.user.id,
        metadata: {
          source: 'ejecuta.seo',
          seoScore: payload.seoScore,
          aiScore: payload.aiScore,
          analyzedAt: payload.analyzedAt,
          originalDomain: payload.domain
        }
      }]).select();

      if (error) throw error;

      if (data && data[0]) {
        setProjectId(data[0].id);
        setStatus('success');
        setMessage('¡Proyecto creado exitosamente!');
        
        // Redirect al proyecto después de 2 segundos
        setTimeout(() => {
          navigate('/', { state: { newProjectId: data[0].id, showWelcome: true } });
        }, 2000);
      }

    } catch (error) {
      console.error('Error importing project:', error);
      setStatus('error');
      setMessage(error.message || 'Error al importar el proyecto');
      setTimeout(() => navigate('/'), 5000);
    }
  }

  function validatePayload(data) {
    const required = ['source', 'domain', 'sostacData'];
    if (!required.every(field => data.hasOwnProperty(field))) {
      return false;
    }
    
    if (data.source !== 'ejecuta.seo') {
      return false;
    }

    const requiredPhases = ['situation', 'objectives', 'strategy', 'tactics', 'action', 'control'];
    return requiredPhases.every(phase => 
      data.sostacData.hasOwnProperty(phase) && Array.isArray(data.sostacData[phase])
    );
  }

  function mapEjecutaToSOSTAC(ejecutaData) {
    // Sanitize function
    const sanitize = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .trim()
        .substring(0, 2000);
    };

    const generateId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 9)}`;

    return {
      situation: (ejecutaData.situation || []).map(item => ({
        id: generateId('s'),
        text: sanitize(item.title),
        completed: Boolean(item.completed),
        notes: sanitize(item.note),
        link: ''
      })),

      objectives: (ejecutaData.objectives || []).map(item => ({
        id: generateId('o'),
        text: sanitize(item.title),
        completed: Boolean(item.completed),
        notes: sanitize(item.note),
        link: ''
      })),

      strategy: (ejecutaData.strategy || []).map(item => ({
        id: generateId('st'),
        text: sanitize(item.title),
        completed: Boolean(item.completed),
        notes: sanitize(item.note),
        link: ''
      })),

      tactics: (ejecutaData.tactics || []).map(task => {
        const priorityLabel = task.prioridad === 0 ? 'P0' : task.prioridad === 1 ? 'P1' : 'P2';
        const title = `[${priorityLabel}] ${sanitize(task.gap)}`;
        
        const notes = [
          `👤 Responsable: ${task.responsable?.toUpperCase() || 'Por asignar'}`,
          `⏱️ Esfuerzo: ${task.esfuerzo || 'Por estimar'}`,
          `📅 Timeline: ${task.timeline?.semana ? `Semana ${task.timeline.semana}` : 'Por definir'}`,
          `📊 Score estimado: +${task.gananciaScore || 0} pts`,
          '',
          '📋 Subtareas:',
          ...(task.subtasks || []).map((st, i) => `  ${i + 1}. ${sanitize(st)}`),
          '',
          '✓ Criterios de Aceptación:',
          ...(task.criteriosAceptacion || []).map(c => `  • ${sanitize(c)}`)
        ].join('\n');

        return {
          id: generateId('t'),
          text: title,
          completed: false,
          notes: sanitize(notes),
          link: task.recursos?.[0] || ''
        };
      }),

      action: (ejecutaData.action || []).map(week => {
        const weekTasks = (week.tasks || []).map(taskId => {
          const task = ejecutaData.tactics?.find(t => t.id === taskId);
          return task ? sanitize(task.gap) : 'Task';
        }).join(', ');
        
        const title = `Semana ${week.semana}: ${weekTasks}`;
        const notes = `Score proyectado: ${week.scoreEstimado || 0}/100\n\n${week.blockers?.length > 0 ? '🔴 Blockers: ' + week.blockers.join(', ') : ''}`;

        return {
          id: generateId('a'),
          text: sanitize(title),
          completed: false,
          notes: sanitize(notes),
          link: ''
        };
      }),

      control: (ejecutaData.control || []).map(item => ({
        id: generateId('c'),
        text: sanitize(item.title),
        completed: Boolean(item.completed),
        notes: sanitize(item.note),
        link: ''
      }))
    };
  }

  function calculateInitialProgress(data) {
    let total = 0;
    let completed = 0;

    Object.values(data).forEach(phase => {
      if (Array.isArray(phase)) {
        total += phase.length;
        completed += phase.filter(item => item.completed).length;
      }
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'loading' && (
              <Loader className="w-16 h-16 text-amber-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-center mb-4 text-white font-['Poppins',sans-serif]">
            {status === 'loading' && 'Importando proyecto...'}
            {status === 'success' && '¡Proyecto creado!'}
            {status === 'error' && 'Error al importar'}
          </h2>

          <p className="text-center text-slate-400 mb-6 font-['Raleway',sans-serif]">
            {message}
          </p>

          {/* Progress indicator */}
          {status === 'loading' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Validando datos...</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-100"></div>
                <span>Creando estructura SOSTAC...</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-200"></div>
                <span>Guardando proyecto...</span>
              </div>
            </div>
          )}

          {/* Success info */}
          {status === 'success' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
              <p className="text-emerald-400 text-sm font-['Raleway',sans-serif]">
                Redirigiendo a tu proyecto...
              </p>
            </div>
          )}

          {/* Error info */}
          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-red-400 text-sm font-['Raleway',sans-serif]">
                Redirigiendo al dashboard...
              </p>
            </div>
          )}

          {/* Source badge */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
              <span className="text-xs text-slate-400 font-['Raleway',sans-serif]">
                Importado desde ejecuta.seo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportProject;
