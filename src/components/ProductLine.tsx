import React from 'react';
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/products';

interface ProductLineProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenOrderModal: (productId?: string) => void;
}

export const ProductLine: React.FC<ProductLineProps> = ({
  products,
  onSelectProduct,
  onOpenOrderModal
}) => {
  // Ensure the 4 canonical products are ALWAYS present in exact order:
  // 1. Té Vital, 2. Granola Nativa, 3. Miel de Montaña, 4. Infusión Relax
  const displayProducts = PRODUCTS_DATA.map((canonical) => {
    const dynamicMatch = products.find(p => p.id === canonical.id);
    if (dynamicMatch && typeof dynamicMatch.price === 'number' && dynamicMatch.price > 0) {
      return {
        ...canonical,
        price: dynamicMatch.price
      };
    }
    return canonical;
  });

  return (
    <section
      id="nuestra-linea"
      className="py-16 lg:py-24 bg-white border-t border-[#e8ddca]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching wireframe */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#C97852] block mb-2">
            NUESTRA LÍNEA
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-montserrat text-[#285943] tracking-tight">
            Productos Naturales
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#285943]/80 font-montserrat">
            Cuatro creaciones esenciales inspiradas en la botánica y nutrición consciente colombiana.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="bg-[#FAF6F0] rounded-2xl border border-[#e8ddca] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 group"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative aspect-[4/3] bg-[#e8ddca] overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Weight Tag */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#285943] text-[11px] font-montserrat font-bold px-2.5 py-1 rounded-md shadow-xs border border-[#e8ddca]">
                    {product.weight.split(' ')[0]}
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#285943]/90 text-white text-[10px] font-montserrat font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#C97852] fill-[#C97852]" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-5 sm:p-6">
                  <span className="text-[11px] font-montserrat font-semibold uppercase tracking-wider text-[#6F9E73] block mb-1">
                    {product.tagline}
                  </span>
                  
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xl font-bold font-montserrat text-[#285943] mb-2 group-hover:text-[#C97852] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#285943]/80 font-montserrat leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Price and Action Buttons */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="pt-4 border-t border-[#e8ddca]/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat text-[#285943]/70 font-medium">Precio</span>
                    <span className="text-lg font-extrabold font-montserrat text-[#285943]">
                      ${product.price.toLocaleString('es-CO')} <span className="text-[10px] font-normal text-[#285943]/60">COP</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`view-details-${product.id}`}
                      onClick={() => onSelectProduct(product)}
                      className="py-2.5 px-3 bg-white hover:bg-[#F3EBDD] text-[#285943] border border-[#285943] font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Ver producto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </button>

                    <button
                      id={`order-product-${product.id}`}
                      onClick={() => onOpenOrderModal(product.id)}
                      className="py-2.5 px-3 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Pedir este producto"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Pedir</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
