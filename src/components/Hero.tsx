import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import heroImg from '../assets/images/hero_nativa_1789389026948.jpg';
import { SiteHeroContent } from '../types';

interface HeroProps {
  onOpenOrderModal: () => void;
  content?: SiteHeroContent;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal, content }) => {
  const scrollToLine = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.querySelector('#nuestra-linea');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const eyebrow = content?.eyebrow || '100% Natural • Cosechado en Colombia';
  const headlineMain = content?.headlineMain || 'Lo natural también puede';
  const headlineAccent = content?.headlineAccent || 'transformar';
  const headlineEnd = content?.headlineEnd || 'tu día.';
  const description = content?.description || 'Descubre alimentos, infusiones y tés artesanales elaborados con amor y pureza en Colombia. Creados para reconectarte con la tierra y cultivar tu energía y bienestar diario.';
  const primaryCta = content?.primaryCtaText || 'QUIERO MI PRODUCTO';
  const secondaryCta = content?.secondaryCtaText || 'CONOCER LA LÍNEA';

  return (
    <section
      id="hero"
      className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#F3EBDD] w-full"
    >
      {/* Subtle organic background foliage shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#6F9E73]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-[#C97852]/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Organic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6F9E73]/20 border border-[#6F9E73]/40 text-[#285943] text-[11px] sm:text-xs font-montserrat font-semibold tracking-wider uppercase mb-4 sm:mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#285943] shrink-0" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline with Emotional Touch in Lora and strong Montserrat title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold font-montserrat text-[#285943] leading-[1.2] tracking-tight mb-4">
              {headlineMain}{' '}
              <span className="font-lora italic font-normal text-[#C97852] underline decoration-[#C97852]/40 underline-offset-4 sm:underline-offset-8">
                {headlineAccent}
              </span>{' '}
              {headlineEnd}
            </h1>

            {/* Supportive descriptive copy */}
            <p className="text-sm sm:text-base lg:text-lg text-[#285943]/85 font-montserrat leading-relaxed max-w-xl mb-6 sm:mb-8 font-normal">
              {description}
            </p>

            {/* CTAs matching wireframe requirements */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              <button
                id="hero-primary-cta"
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto min-h-[46px] px-7 py-3.5 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                id="hero-secondary-cta"
                href="#nuestra-linea"
                onClick={scrollToLine}
                className="w-full sm:w-auto min-h-[46px] px-7 py-3.5 bg-transparent hover:bg-[#285943]/10 text-[#285943] border-2 border-[#285943] font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase rounded-lg transition-all duration-200 text-center flex items-center justify-center cursor-pointer"
              >
                {secondaryCta}
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-5 sm:pt-6 border-t border-[#e5dac5] w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <span className="text-xs font-montserrat font-semibold text-[#285943]">Sin aditivos artificiales</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <span className="text-xs font-montserrat font-semibold text-[#285943]">Hecho a mano en Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <span className="text-xs font-montserrat font-semibold text-[#285943]">Envíos a todo el país</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual composition */}
          <div className="lg:col-span-5 relative w-full pt-4 sm:pt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Backing decorative frame */}
              <div className="hidden sm:block absolute inset-0 bg-[#285943] rounded-2xl transform rotate-2 translate-x-2 translate-y-2 opacity-15" />
              
              {/* Main Photo Card */}
              <div className="relative bg-white p-2.5 sm:p-4 rounded-2xl shadow-xl border border-[#FAF6F0] overflow-hidden">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#e8ddca]">
                  <img
                    src={heroImg}
                    alt="Colección botánica y bienestar natural NATIVA"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#285943]/60 via-transparent to-transparent opacity-70" />
                  
                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-sm p-2.5 sm:p-3.5 rounded-lg shadow-md border border-[#F3EBDD]/60 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-montserrat uppercase tracking-wider text-[#6F9E73] font-bold">Línea Bienestar</p>
                      <p className="text-xs sm:text-sm font-montserrat font-bold text-[#285943]">Botánica & Alimentos Puros</p>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#285943] text-white text-[10px] sm:text-[11px] font-montserrat font-semibold rounded-md">
                      Artesanal
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -top-3 left-2 sm:-top-6 sm:-left-6 bg-[#FFFFFF] py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl shadow-lg border border-[#e8ddca] flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6F9E73]/20 flex items-center justify-center text-[#285943]">
                  <span className="font-lora font-bold text-sm sm:text-base">🌿</span>
                </div>
                <div>
                  <div className="flex items-center text-[#C97852] text-[10px] sm:text-xs">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-montserrat font-bold text-[#285943]">100% Cosecha Pura</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
