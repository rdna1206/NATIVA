import React from 'react';
import { Leaf, HandMetal, Heart, MapPin } from 'lucide-react';
import { BENEFITS_DATA } from '../data/products';
import { Benefit } from '../types';

interface BenefitsProps {
  benefits?: Benefit[];
}

export const Benefits: React.FC<BenefitsProps> = ({ benefits = BENEFITS_DATA }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf':
        return <Leaf className="w-7 h-7 text-[#285943]" />;
      case 'hand':
        return <HandMetal className="w-7 h-7 text-[#285943]" />;
      case 'heart':
        return <Heart className="w-7 h-7 text-[#285943]" />;
      case 'map':
        return <MapPin className="w-7 h-7 text-[#285943]" />;
      default:
        return <Leaf className="w-7 h-7 text-[#285943]" />;
    }
  };

  const list = benefits && benefits.length > 0 ? benefits : BENEFITS_DATA;

  return (
    <section
      id="beneficios"
      className="py-12 sm:py-16 lg:py-20 bg-white border-y border-[#e8ddca] w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <span className="text-[11px] sm:text-xs font-montserrat font-bold uppercase tracking-widest text-[#6F9E73] block mb-1.5 sm:mb-2">
            Nuestros Pilares
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-montserrat text-[#285943] tracking-tight">
            ¿Por qué elegir NATIVA?
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-[#285943]/80 font-montserrat">
            Cada uno de nuestros productos está guiado por cuatro principios esenciales que honran tu salud y la naturaleza.
          </p>
        </div>

        {/* 4 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {list.map((benefit) => (
            <div
              key={benefit.id}
              id={`benefit-card-${benefit.id}`}
              className="bg-[#FAF6F0] rounded-xl p-5 sm:p-7 border border-[#e8ddca]/80 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6F9E73]/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#6F9E73]/30 transition-colors duration-200">
                {getIcon(benefit.iconName)}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg lg:text-xl font-bold font-montserrat text-[#285943] mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#285943]/85 font-montserrat leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
