import React from 'react';
import { ArrowRight, MapPin, Sparkles, HeartHandshake, Leaf } from 'lucide-react';
import { BRAND_STORY } from '../data/products';
import { SiteAboutContent } from '../types';

interface AboutUsProps {
  onOpenProcessModal: () => void;
  content?: SiteAboutContent;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenProcessModal, content }) => {
  const eyebrow = content?.eyebrow || BRAND_STORY.eyebrow;
  const title = content?.title || BRAND_STORY.title;
  const paragraph = content?.paragraph || BRAND_STORY.paragraph;
  const quote = content?.quote || '“Creemos en la sabiduría de la tierra y en el poder transformador de los hábitos simples y naturales.”';

  return (
    <section
      id="sobre-nativa"
      className="py-16 lg:py-24 bg-[#F3EBDD] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Authentic Brand Image & Craftsmanship badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Offset decorative border */}
              <div className="absolute -inset-3 rounded-2xl border-2 border-[#285943]/20 transform -rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2 sm:p-3 border border-[#e8ddca]">
                <img
                  src={BRAND_STORY.image}
                  alt="Manos artesanas con ingredientes botánicos de NATIVA"
                  className="w-full h-80 sm:h-96 lg:h-[450px] object-cover object-center rounded-xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#285943]/95 backdrop-blur-xs text-white p-4 rounded-xl border border-white/10 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6F9E73] flex items-center justify-center text-white shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-montserrat font-bold tracking-wider text-[#F3EBDD]">
                        Orgullo Colombiano
                      </p>
                      <p className="text-xs font-montserrat text-white/90">
                        Cosechado de forma ética con comunidades locales.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Philosophy */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#C97852] block mb-2">
              {eyebrow}
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat text-[#285943] tracking-tight mb-5">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-[#285943]/90 font-montserrat leading-relaxed mb-6">
              {paragraph}
            </p>

            <p className="font-lora text-base sm:text-lg italic text-[#C97852] font-normal leading-relaxed mb-8">
              {quote}
            </p>

            {/* Values summary pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-8">
              <div className="bg-white/80 p-3 rounded-lg border border-[#e8ddca] flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <span className="text-xs font-montserrat font-bold text-[#285943]">100% Botánico</span>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-[#e8ddca] flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#C97852] shrink-0" />
                <span className="text-xs font-montserrat font-bold text-[#285943]">Comercio Justo</span>
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-[#e8ddca] flex items-center gap-2 col-span-2 sm:col-span-1">
                <Sparkles className="w-4 h-4 text-[#285943] shrink-0" />
                <span className="text-xs font-montserrat font-bold text-[#285943]">Lotes Pequeños</span>
              </div>
            </div>

            {/* CTA matching wireframe */}
            <button
              id="about-process-cta"
              onClick={onOpenProcessModal}
              className="px-7 py-3.5 bg-[#285943] hover:bg-[#1e4533] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
            >
              <span>CONOCE NUESTRO PROCESO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
