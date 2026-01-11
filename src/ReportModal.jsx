import React, { useState, useEffect } from 'react';
import { X, FileText, Download, User, Mail, Globe, Briefcase, Image as ImageIcon, Check } from 'lucide-react';

export default function ReportModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  proyecto 
}) {
  const [config, setConfig] = useState(() => {
    // Cargar preferencias guardadas
    const saved = localStorage.getItem('sostac_report_config');
    if (saved) {
      try {
        return {
          ...JSON.parse(saved),
          reportType: 'executive',
          includeSections: {
            metrics: true,
            sostacPhases: true,
            tasks: true,
            insights: true,
            timeline: true,
            recommendations: true
          }
        };
      } catch (e) {
        console.error('Error loading saved config:', e);
      }
    }
    
    return {
      consultantName: '',
      consultantTitle: '',
      consultantEmail: '',
      consultantWebsite: '',
      consultantServices: 'Consultoría Estratégica SOSTAC',
      logo: null,
      reportType: 'executive',
      includeSections: {
        metrics: true,
        sostacPhases: true,
        tasks: true,
        insights: true,
        timeline: true,
        recommendations: true
      }
    };
  });

  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset logo preview cuando se cierra
      if (!config.logo) {
        setLogoPreview(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El logo no debe superar 2MB');
        return;
      }
      
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Por favor sube una imagen válida');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setConfig({ ...config, logo: base64 });
        setLogoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setConfig({ ...config, logo: null });
    setLogoPreview(null);
  };

  const handleGenerate = () => {
    // Validaciones básicas
    if (!config.consultantName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    
    if (!config.consultantEmail.trim()) {
      alert('Por favor ingresa tu email');
      return;
    }

    // Guardar preferencias (sin el reportType ni includeSections)
    const toSave = {
      consultantName: config.consultantName,
      consultantTitle: config.consultantTitle,
      consultantEmail: config.consultantEmail,
      consultantWebsite: config.consultantWebsite,
      consultantServices: config.consultantServices,
      logo: config.logo
    };
    localStorage.setItem('sostac_report_config', JSON.stringify(toSave));

    // Generar reporte
    onGenerate(config);
    onClose();
  };

  const reportTypes = [
    { 
      value: 'executive', 
      label: 'Ejecutivo', 
      desc: 'Resumen de alto nivel para stakeholders',
      icon: '📊'
    },
    { 
      value: 'progress', 
      label: 'Progreso', 
      desc: 'Detalle completo del avance',
      icon: '📈'
    },
    { 
      value: 'technical', 
      label: 'Técnico', 
      desc: 'Análisis exhaustivo y recomendaciones',
      icon: '🔧'
    }
  ];

  const sections = [
    { key: 'metrics', label: 'Métricas Principales', icon: '📊' },
    { key: 'sostacPhases', label: 'Distribución SOSTAC', icon: '🎯' },
    { key: 'tasks', label: 'Tabla de Tareas', icon: '✅' },
    { key: 'insights', label: 'Insights de IA', icon: '💡' },
    { key: 'timeline', label: 'Timeline del Proyecto', icon: '📅' },
    { key: 'recommendations', label: 'Recomendaciones', icon: '🎯' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <FileText className="text-amber-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Generar Reporte</h2>
              <p className="text-slate-400 text-sm">{proyecto.name} • {proyecto.client}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          
          {/* Tipo de Reporte */}
          <div>
            <label className="block text-white font-semibold mb-4 flex items-center gap-2">
              <span>Tipo de Reporte</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {reportTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setConfig({ ...config, reportType: type.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    config.reportType === type.value
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-white mb-1">{type.label}</div>
                  <div className="text-xs text-slate-400 leading-snug">{type.desc}</div>
                  {config.reportType === type.value && (
                    <div className="mt-3 flex justify-center">
                      <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check size={12} />
                        Seleccionado
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Información del Consultor */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <label className="block text-white font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-amber-500" />
              <span>Tu Información (Aparecerá en el reporte)</span>
            </label>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                    <User size={14} />
                    <span>Nombre Completo *</span>
                  </div>
                  <input
                    type="text"
                    value={config.consultantName}
                    onChange={(e) => setConfig({ ...config, consultantName: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                    <Briefcase size={14} />
                    <span>Título/Cargo</span>
                  </div>
                  <input
                    type="text"
                    value={config.consultantTitle}
                    onChange={(e) => setConfig({ ...config, consultantTitle: e.target.value })}
                    placeholder="Ej: Consultor de Marketing Estratégico"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                    <Mail size={14} />
                    <span>Email *</span>
                  </div>
                  <input
                    type="email"
                    value={config.consultantEmail}
                    onChange={(e) => setConfig({ ...config, consultantEmail: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                    <Globe size={14} />
                    <span>Sitio Web</span>
                  </div>
                  <input
                    type="url"
                    value={config.consultantWebsite}
                    onChange={(e) => setConfig({ ...config, consultantWebsite: e.target.value })}
                    placeholder="https://tuwebsite.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                  <Briefcase size={14} />
                  <span>Servicios que Ofreces</span>
                </div>
                <input
                  type="text"
                  value={config.consultantServices}
                  onChange={(e) => setConfig({ ...config, consultantServices: e.target.value })}
                  placeholder="Ej: Consultoría Estratégica • Marketing Digital • Branding"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              {/* Upload Logo */}
              <div>
                <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                  <ImageIcon size={14} />
                  <span>Tu Logo (Opcional)</span>
                </div>
                {!logoPreview ? (
                  <label className="block">
                    <div className="w-full px-4 py-8 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg text-center cursor-pointer hover:border-amber-500 hover:bg-slate-800 transition-all">
                      <ImageIcon size={32} className="mx-auto text-slate-500 mb-2" />
                      <span className="text-slate-400 text-sm">Click para subir tu logo</span>
                      <span className="text-slate-500 text-xs block mt-1">PNG, JPG o SVG (Max 2MB)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="h-16 object-contain"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secciones a Incluir */}
          <div>
            <label className="block text-white font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-amber-500" />
              <span>Secciones a Incluir</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {sections.map(section => (
                <label 
                  key={section.key}
                  className="flex items-center gap-3 p-4 rounded-lg bg-slate-800 hover:bg-slate-750 cursor-pointer transition-all border-2 border-transparent has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10"
                >
                  <input
                    type="checkbox"
                    checked={config.includeSections[section.key]}
                    onChange={(e) => setConfig({
                      ...config,
                      includeSections: {
                        ...config.includeSections,
                        [section.key]: e.target.checked
                      }
                    })}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-2xl">{section.icon}</span>
                  <span className="text-white font-medium">{section.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Download size={18} />
            Generar Reporte HTML
          </button>
        </div>

      </div>
    </div>
  );
}
