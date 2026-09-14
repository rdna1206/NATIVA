import React from 'react';
import { X, CheckCircle2, Clock, MapPin, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderProduct: (productId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOrderProduct
}) => {
  if (!product) return null;

  return (
    <div
      id="product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="product-modal-card"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8ddca] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-[#F3EBDD] text-[#285943] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Header */}
        <div className="relative aspect-[16/9] w-full bg-[#FAF6F0] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#F3EBDD] bg-[#285943]/90 px-2.5 py-1 rounded-md mb-2 inline-block">
              {product.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-montserrat">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Subtitle & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#e8ddca]">
            <div>
              <p className="text-sm font-montserrat font-bold text-[#6F9E73] uppercase tracking-wide">
                {product.tagline}
              </p>
              <p className="text-xs font-montserrat text-[#285943]/70">
                Presentación: {product.weight}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-2xl font-extrabold font-montserrat text-[#285943]">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="text-xs font-normal text-[#285943]/60 ml-1">COP</span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div>
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#285943] mb-2">
              Descripción & Historia
            </h4>
            <p className="text-sm text-[#285943]/85 font-montserrat leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Ingredients list */}
          <div>
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#285943] mb-2.5">
              Ingredientes 100% Puros
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#FAF6F0] text-[#285943] text-xs font-montserrat font-medium rounded-full border border-[#e8ddca]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#285943] mb-2.5">
              Beneficios Clave
            </h4>
            <ul className="space-y-2">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#285943]/85 font-montserrat">
                  <CheckCircle2 className="w-4 h-4 text-[#6F9E73] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Origin & Usage instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#e8ddca]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C97852] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-montserrat font-bold text-[#285943]">Origen</p>
                <p className="text-xs text-[#285943]/80 font-montserrat">{product.origin}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#6F9E73] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-montserrat font-bold text-[#285943]">Modo de Preparación</p>
                <p className="text-xs text-[#285943]/80 font-montserrat">{product.usageInstructions}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOrderProduct(product.id);
              }}
              className="w-full py-4 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>AÑADIR A MI PEDIDO (${product.price.toLocaleString('es-CO')} COP)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
