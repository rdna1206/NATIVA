import React, { useState } from 'react';
import { 
  Tag, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';

interface PricesSectionProps {
  products: Product[];
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PricesSection: React.FC<PricesSectionProps> = ({
  products,
  onShowToast
}) => {
  // Local state for the price inputs for each of the 4 products
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize input value if not yet typed by user
  const getInputValue = (product: Product): string => {
    if (priceInputs[product.id] !== undefined) {
      return priceInputs[product.id];
    }
    return product.price.toString();
  };

  const handleInputChange = (productId: string, value: string) => {
    // Only allow digits
    const cleanVal = value.replace(/[^0-9]/g, '');
    setPriceInputs(prev => ({
      ...prev,
      [productId]: cleanVal
    }));
    setErrorMessage(null);
  };

  const handleSavePrice = async (product: Product) => {
    const rawVal = getInputValue(product).trim();
    const numericValue = Number(rawVal);

    // Validation: Only valid numeric values > 0
    if (!rawVal || isNaN(numericValue) || !Number.isFinite(numericValue) || numericValue <= 0) {
      setErrorMessage(`El precio de "${product.name}" debe ser un valor numérico válido mayor a 0.`);
      onShowToast('Ingresa un valor numérico válido mayor a 0', 'error');
      return;
    }

    setSavingProductId(product.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await productService.updateProductPrice(product.id, numericValue);
      const formattedPrice = `$${numericValue.toLocaleString('es-CO')} COP`;
      const msg = `¡Precio de "${product.name}" actualizado a ${formattedPrice} correctamente! Se ha sincronizado en Firebase y la Landing Page.`;
      
      setSuccessMessage(msg);
      onShowToast(`Precio de ${product.name} actualizado a ${formattedPrice}`, 'success');

      // Clear input state so it aligns with saved product.price
      setPriceInputs(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } catch (err: unknown) {
      console.error('Error saving price:', err);
      const errMsg = err instanceof Error ? err.message : 'Error al guardar el precio en Firebase.';
      setErrorMessage(errMsg);
      onShowToast(errMsg, 'error');
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <div className="space-y-8 font-montserrat">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8ddca] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-[#285943]/10 text-[#285943] flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#285943] tracking-tight">
                Gestión de Precios NATIVA
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#285943]/80">
              Modifica únicamente el precio de los 4 productos esenciales. Los cambios se guardan en Firebase y se reflejan al instante en la Landing Page pública.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#e8ddca] text-[11px] font-semibold text-[#285943]">
            <ShieldCheck className="w-4 h-4 text-[#6F9E73]" />
            <span>4 Productos Originales Protegidos</span>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {successMessage && (
          <div className="mt-5 p-4 bg-[#6F9E73]/15 border border-[#6F9E73]/40 rounded-xl flex items-start gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#285943] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-semibold text-[#285943]">
              {successMessage}
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-[#285943]/60 hover:text-[#285943] text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-semibold text-red-800">
              {errorMessage}
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-red-600/60 hover:text-red-800 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4 Products Simultaneous Price Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          const isSaving = savingProductId === product.id;
          const currentInputVal = getInputValue(product);
          const hasChanged = currentInputVal.trim() !== product.price.toString();

          return (
            <div
              key={product.id}
              id={`admin-price-card-${product.id}`}
              className="bg-white rounded-2xl border border-[#e8ddca] p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Product Header: Photo + Info (Locked / Protected) */}
                <div className="flex items-start gap-4 pb-5 border-b border-[#e8ddca]/80">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#e8ddca] shrink-0 shadow-2xs">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF6F0] text-[#6F9E73] border border-[#e8ddca] mb-1">
                      {product.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#285943] truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#285943]/70 truncate mt-0.5">
                      {product.tagline}
                    </p>
                    <p className="text-[11px] text-[#285943]/60 mt-1 font-medium">
                      Presentación: {product.weight}
                    </p>
                  </div>
                </div>

                {/* Price Display & Form */}
                <div className="py-5 space-y-4">
                  {/* Current Price */}
                  <div className="flex items-center justify-between bg-[#FAF6F0] p-3.5 rounded-xl border border-[#e8ddca]/70">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#285943]/70 block">
                        Precio Actual
                      </span>
                      <span className="text-xs text-[#285943]/60">
                        Visible en Landing Page
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-[#285943]">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                      <span className="text-xs font-bold text-[#285943]/60 ml-1">COP</span>
                    </div>
                  </div>

                  {/* Edit Price Field */}
                  <div>
                    <label 
                      htmlFor={`price-input-${product.id}`}
                      className="block text-xs font-bold text-[#285943] uppercase tracking-wider mb-2"
                    >
                      Editar Precio (COP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#285943]/50">
                        $
                      </span>
                      <input
                        id={`price-input-${product.id}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={currentInputVal}
                        onChange={(e) => handleInputChange(product.id, e.target.value)}
                        placeholder="Ej. 28000"
                        className="w-full pl-8 pr-16 py-3 bg-white border border-[#285943]/30 focus:border-[#285943] focus:ring-2 focus:ring-[#285943]/15 rounded-xl text-base font-bold text-[#285943] transition-all outline-none"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#285943]/60 uppercase">
                        COP
                      </span>
                    </div>
                    <p className="text-[10px] text-[#285943]/60 mt-1.5 pl-1">
                      Solo valores numéricos en pesos colombianos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Action Button */}
              <div className="pt-4 border-t border-[#e8ddca]/80">
                <button
                  id={`save-price-btn-${product.id}`}
                  onClick={() => handleSavePrice(product)}
                  disabled={isSaving}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    hasChanged
                      ? 'bg-[#C97852] hover:bg-[#b3633e] text-white shadow-md'
                      : 'bg-[#285943] hover:bg-[#1e4533] text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Guardando en Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{hasChanged ? 'Guardar Nuevo Precio' : 'Guardar Precio'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Security & Integrity Note */}
      <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#e8ddca] flex items-center gap-3 text-xs text-[#285943]/80">
        <ShieldCheck className="w-5 h-5 text-[#6F9E73] shrink-0" />
        <span>
          <strong>Protección de catálogo activa:</strong> Los nombres, fotografías originales, ingredientes y descripciones de los 4 productos se conservan de forma permanente e inmutable.
        </span>
      </div>

    </div>
  );
};
