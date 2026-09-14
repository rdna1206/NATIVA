import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Product, SiteFeaturedContent } from '../types';

interface FeaturedProductProps {
  product: Product;
  content?: SiteFeaturedContent;
  onSelectProduct: (product: Product) => void;
  onOpenOrderModal: (productId?: string) => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({
  product,
  content,
  onSelectProduct,
  onOpenOrderModal
}) => {
  const eyebrow = content?.eyebrow || 'PRODUCTO DESTACADO';
  const quote = content?.quote || '“Una mezcla natural para comenzar el día con energía y bienestar.”';
  const description = content?.description || product.longDescription;
  const ctaText = content?.ctaText || 'CONOCER PRODUCTO';

  return (
    <section
      id="destacado"
      className="py-16 lg:py-24 bg-[#F3EBDD] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md border border-[#e8ddca] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e8ddca] bg-[#FAF6F0] group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-4 left-4 bg-[#285943] text-white px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#6F9E73]" />
                  <span>Producto Estrella</span>
                </div>

                {/* Grammage & Origin */}
                <div className="absolute bottom-4 right-4 bg-[#F3EBDD]/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#e8ddca] text-[#285943] text-xs font-montserrat font-semibold">
                  {product.weight}
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start text-left">
              
              <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#C97852] block mb-2">
                {eyebrow}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat text-[#285943] tracking-tight mb-3">
                {product.name}
              </h2>

              {/* Exact quote from user specifications / CMS */}
              <p className="font-lora text-lg sm:text-xl italic text-[#285943] font-medium leading-relaxed mb-4">
                {quote}
              </p>

              <p className="text-sm sm:text-base text-[#285943]/85 font-montserrat leading-relaxed mb-6">
                {description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
                {product.ingredients.slice(0, 4).map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#285943] font-montserrat font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#6F9E73] shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>

              {/* Price and CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full pt-4 border-t border-[#e8ddca]">
                <div className="flex flex-col">
                  <span className="text-xs font-montserrat text-[#285943]/70 font-medium">Precio</span>
                  <span className="text-2xl font-extrabold font-montserrat text-[#285943]">
                    ${product.price.toLocaleString('es-CO')} <span className="text-xs font-normal text-[#285943]/60">COP</span>
                  </span>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    id="featured-product-cta"
                    onClick={() => onSelectProduct(product)}
                    className="flex-1 px-6 py-3.5 bg-[#285943] hover:bg-[#1e4533] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="featured-buy-direct-btn"
                    onClick={() => onOpenOrderModal(product.id)}
                    className="px-5 py-3.5 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>PEDIR</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
