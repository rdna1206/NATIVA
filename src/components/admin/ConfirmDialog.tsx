import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e8ddca] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isDangerous ? 'bg-red-100 text-red-600' : 'bg-[#FAF6F0] text-[#C97852]'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-montserrat text-[#285943]">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-sm font-montserrat text-[#285943]/80 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-[#e8ddca] hover:bg-[#FAF6F0] text-[#285943] font-montserrat font-semibold text-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-white font-montserrat font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#285943] hover:bg-[#1e4533]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
