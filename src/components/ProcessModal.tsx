import React from 'react';
import { X, Sprout, Sun, Sparkles, PackageCheck } from 'lucide-react';

interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal: () => void;
}

export const ProcessModal: React.FC<ProcessModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <Sprout className="w-6 h-6 text-[#285943]" />,
      number: '01',
      title: 'Cultivo Agroecológico',
      desc: 'Seleccionamos parcelas campesinas en las montañas colombianas con suelos fértiles y riego de agua pura de manantial, sin uso de pesticidas ni fertilizantes sintéticos.'
    },
    {
      icon: <Sun className="w-6 h-6 text-[#C97852]" />,
      number: '02',
      title: 'Cosecha Manual y Secado Lento',
      desc: 'Las hojas, flores y semillas se recolectan a mano en su punto óptimo de madurez y se deshidratan a temperatura controlada para conservar intactos sus aceites esenciales y polifenoles.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#6F9E73]" />,
      number: '03',
      title: 'Elaboración en Pequeños Lotes',
      desc: 'Mezclamos y tostamos en tandas reducidas de forma 100% artesanal, garantizando una frescura inigualable y una proporción botánica equilibrada en cada paquete.'
    },
    {
      icon: <PackageCheck className="w-6 h-6 text-[#285943]" />,
      number: '04',
      title: 'Empaque Responsable y Entrega',
      desc: 'Empacamos en materiales reciclables y frascos de vidrio reutilizables para cuidar el planeta y conservar la frescura hasta que llega a tu mesa.'
    }
  ];

  return (
    <div
      id="process-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="process-modal-card"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8ddca] p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left mb-6">
          <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#6F9E73] block mb-1">
            Transparencia & Origen
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-montserrat text-[#285943]">
            El Proceso Artesanal NATIVA
          </h3>
          <p className="text-xs sm:text-sm text-[#285943]/80 font-montserrat mt-2">
            De la tierra colombiana a tu taza: cuatro pasos guiados por el respeto a la naturaleza.
          </p>
        </div>

        <div className="space-y-4 my-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6F0] p-4 sm:p-5 rounded-xl border border-[#e8ddca] flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[#e8ddca] shadow-xs">
                {step.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#C97852] font-montserrat">{step.number}</span>
                  <h4 className="text-base font-bold font-montserrat text-[#285943]">{step.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#285943]/85 font-montserrat leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenOrderModal();
            }}
            className="w-full py-3.5 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors text-center cursor-pointer"
          >
            QUIERO PROBAR LOS PRODUCTOS NATIVA
          </button>
        </div>
      </div>
    </div>
  );
};
