import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  MessageSquare,
  Flame,
  Info
} from 'lucide-react';
import { SiteContent } from '../../types';
import { contentService, DEFAULT_SITE_CONTENT } from '../../services/contentService';
import { ConfirmDialog } from './ConfirmDialog';

interface ContentSectionProps {
  content: SiteContent;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  content,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'benefits' | 'featured' | 'about' | 'testimonial' | 'finalCta'>('hero');
  const [formData, setFormData] = useState<SiteContent>(content);
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync if prop changes externally
  React.useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contentService.saveContent(formData);
      onShowToast('Textos del sitio actualizados en Firebase y reflejados en vivo.', 'success');
    } catch (err) {
      console.error('Save content error:', err);
      onShowToast('Error al guardar el contenido en Firestore.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const def = await contentService.resetToDefault();
      setFormData(def);
      onShowToast('Textos restaurados a sus valores originales.', 'info');
      setShowResetConfirm(false);
    } catch (err) {
      console.error('Reset content error:', err);
      onShowToast('Error al restaurar los textos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-montserrat">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#285943]">
            Editor de Contenidos de la Landing Page
          </h2>
          <p className="text-xs text-[#285943]/70 mt-0.5">
            Modifica los textos principales de cada sección sin tocar una sola línea de código.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-lg border border-[#e8ddca] hover:bg-[#FAF6F0] text-[#285943] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Predeterminados</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-[#e8ddca]">
        {[
          { id: 'hero', label: '1. Hero Principal', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'benefits', label: '2. Beneficios (4 Pilares)', icon: <Layers className="w-4 h-4" /> },
          { id: 'featured', label: '3. Producto Destacado', icon: <Flame className="w-4 h-4" /> },
          { id: 'about', label: '4. Sobre NATIVA', icon: <Info className="w-4 h-4" /> },
          { id: 'testimonial', label: '5. Testimonio', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'finalCta', label: '6. CTA Final', icon: <CheckCircle2 className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#285943] text-white shadow-xs'
                : 'text-[#285943]/70 hover:text-[#285943] hover:bg-[#FAF6F0]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8ddca] shadow-xs">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Sección Hero (Encabezado Principal)
              </h3>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Insignia Superior / Badge</label>
                <input
                  type="text"
                  value={formData.hero.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, eyebrow: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Título Inicio</label>
                  <input
                    type="text"
                    value={formData.hero.headlineMain}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlineMain: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[#C97852] mb-1">Palabra Cursiva Destacada</label>
                  <input
                    type="text"
                    value={formData.hero.headlineAccent}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlineAccent: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#C97852] font-lora italic outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Título Final</label>
                  <input
                    type="text"
                    value={formData.hero.headlineEnd}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, headlineEnd: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Párrafo Descriptivo Hero</label>
                <textarea
                  rows={3}
                  value={formData.hero.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Texto Botón Primario (Terracota)</label>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, primaryCtaText: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Texto Botón Secundario (Borde Verde)</label>
                  <input
                    type="text"
                    value={formData.hero.secondaryCtaText}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, secondaryCtaText: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Cuatro Pilares / Beneficios de Marca
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.benefits.map((benefit, idx) => (
                  <div key={benefit.id} className="p-4 bg-[#FAF6F0] rounded-xl border border-[#e8ddca] space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F9E73]">
                      Pilar #{idx + 1} ({benefit.iconName})
                    </span>
                    <div>
                      <label className="block font-bold uppercase text-[#285943] mb-1">Título del Beneficio</label>
                      <input
                        type="text"
                        value={benefit.title}
                        onChange={(e) => {
                          const updated = [...formData.benefits];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, benefits: updated });
                        }}
                        className="w-full p-2 rounded-lg border border-[#e8ddca] bg-white text-sm text-[#285943] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-[#285943] mb-1">Descripción</label>
                      <textarea
                        rows={2}
                        value={benefit.description}
                        onChange={(e) => {
                          const updated = [...formData.benefits];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, benefits: updated });
                        }}
                        className="w-full p-2 rounded-lg border border-[#e8ddca] bg-white text-xs text-[#285943] outline-hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FEATURED */}
          {activeTab === 'featured' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Sección Producto Destacado
              </h3>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Etiqueta Superior</label>
                <input
                  type="text"
                  value={formData.featured.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    featured: { ...formData.featured, eyebrow: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Frase Destacada (Estilo Lora)</label>
                <input
                  type="text"
                  value={formData.featured.quote}
                  onChange={(e) => setFormData({
                    ...formData,
                    featured: { ...formData.featured, quote: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm font-lora italic text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Descripción de la Sección Destacada</label>
                <textarea
                  rows={3}
                  value={formData.featured.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    featured: { ...formData.featured, description: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Texto Botón</label>
                <input
                  type="text"
                  value={formData.featured.ctaText}
                  onChange={(e) => setFormData({
                    ...formData,
                    featured: { ...formData.featured, ctaText: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Sección Sobre NATIVA / Nuestra Esencia
              </h3>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={formData.about.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, eyebrow: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Título de la Sección</label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Párrafo de Historia / Manifiesto</label>
                <textarea
                  rows={4}
                  value={formData.about.paragraph}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, paragraph: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Cita / Frase de Cierre</label>
                <input
                  type="text"
                  value={formData.about.quote}
                  onChange={(e) => setFormData({
                    ...formData,
                    about: { ...formData.about, quote: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm font-lora italic text-[#285943] outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIAL */}
          {activeTab === 'testimonial' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Sección de Testimonio
              </h3>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Testimonio del Cliente</label>
                <textarea
                  rows={4}
                  value={formData.testimonial.quote}
                  onChange={(e) => setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, quote: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm font-lora italic text-[#285943] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Nombre o Título del Autor</label>
                  <input
                    type="text"
                    value={formData.testimonial.author}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, author: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Rol / Estado de Compra</label>
                  <input
                    type="text"
                    value={formData.testimonial.role}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, role: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINAL CTA */}
          {activeTab === 'finalCta' && (
            <div className="space-y-5">
              <h3 className="text-base font-bold text-[#285943] pb-2 border-b border-[#e8ddca]">
                Sección CTA Final (Llamado de Cierre)
              </h3>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Insignia Superior</label>
                <input
                  type="text"
                  value={formData.finalCta.eyebrow}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalCta: { ...formData.finalCta, eyebrow: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-[#285943] mb-1">Encabezado Principal</label>
                  <input
                    type="text"
                    value={formData.finalCta.headline}
                    onChange={(e) => setFormData({
                      ...formData,
                      finalCta: { ...formData.finalCta, headline: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#C97852] mb-1">Frase Resaltada (Terracota)</label>
                  <input
                    type="text"
                    value={formData.finalCta.headlineAccent}
                    onChange={(e) => setFormData({
                      ...formData,
                      finalCta: { ...formData.finalCta, headlineAccent: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm font-lora italic text-[#C97852] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Descripción Final</label>
                <textarea
                  rows={3}
                  value={formData.finalCta.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalCta: { ...formData.finalCta, description: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#285943] mb-1">Texto del Botón Final</label>
                <input
                  type="text"
                  value={formData.finalCta.buttonText}
                  onChange={(e) => setFormData({
                    ...formData,
                    finalCta: { ...formData.finalCta, buttonText: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-lg border border-[#e8ddca] bg-[#FAF6F0] text-sm text-[#285943] outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#e8ddca] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-[#285943] hover:bg-[#1e4533] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Guardando en Firebase...' : 'Guardar y Publicar Textos'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Restaurar Textos Predeterminados"
        message="¿Deseas restaurar todos los textos de la Landing Page a su versión original de fábrica de NATIVA? Se sobrescribirán los cambios no guardados."
        confirmText="Sí, Restaurar Textos"
        isDangerous={false}
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />

    </div>
  );
};
