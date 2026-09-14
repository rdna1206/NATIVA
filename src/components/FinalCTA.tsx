import React from 'react';
import { ArrowRight, Truck, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { SiteFinalCtaContent } from '../types';

interface FinalCTAProps {
  onOpenOrderModal: () => void;
  content?: SiteFinalCtaContent;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenOrderModal, content }) => {
  const eyebrow = content?.eyebrow || 'Comienza hoy tu transformación natural';
  const headline = content?.headline || 'Descubre el poder de lo artesanal y renueva tu';
  const headlineAccent = content?.headlineAccent || 'bienestar diario.';
  const description = content?.description || 'Haz tu pedido hoy mismo y recibe en la puerta de tu casa los mejores tés, granolas, mieles e infusiones cosechadas con amor en el campo colombiano.';
  const buttonText = content?.buttonText || 'QUIERO MI PRODUCTO';

  return (
    <section
      id="cta-final"
      className="py-16 lg:py-24 bg-[#285943] text-white relative overflow-hidden"
    >
      {/* Botanical background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#6F9E73]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C97852]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Subtitle / badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#F3EBDD] text-xs font-montserrat font-semibold tracking-wider uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#6F9E73]" />
          <span>{eyebrow}</span>
        </div>

        {/* Main callout with Lora accent */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-montserrat text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
          {headline}{' '}
          <span className="font-lora italic font-normal text-[#F3EBDD] underline decoration-[#C97852] underline-offset-8">
            {headlineAccent}
          </span>
        </h2>

        {/* Descriptive copy */}
        <p className="text-base sm:text-lg text-[#F3EBDD]/90 font-montserrat max-w-2xl mx-auto mb-10 leading-relaxed">
          {description}
        </p>

        {/* Prominent CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            id="final-cta-button"
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto px-9 py-4 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Service guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-10 border-t border-white/15">
          <div className="flex items-center justify-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#6F9E73]" />
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-white">Envíos Nacionales</p>
              <p className="text-[11px] font-montserrat text-[#F3EBDD]/80">A cualquier rincón de Colombia</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#6F9E73]" />
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-white">Compra Segura</p>
              <p className="text-[11px] font-montserrat text-[#F3EBDD]/80">Nequi, Daviplata, Tarjetas</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-[#6F9E73]" />
            </div>
            <div>
              <p className="text-xs font-montserrat font-bold text-white">Garantía Artesanal</p>
              <p className="text-[11px] font-montserrat text-[#F3EBDD]/80">100% Frescura garantizada</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
