import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types';

export interface ToastProps {
  toasts?: ToastMessage[];
  onRemove?: (id: string) => void;
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  toasts, 
  onRemove,
  message,
  type = 'success',
  onClose
}) => {
  // If single toast mode is used
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  // If array toast mode is used
  useEffect(() => {
    if (toasts && toasts.length > 0 && onRemove) {
      const timer = setTimeout(() => {
        onRemove(toasts[0].id);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onRemove]);

  if (!message && (!toasts || toasts.length === 0)) return null;

  const items = toasts && toasts.length > 0
    ? toasts
    : message 
      ? [{ id: 'single-toast', message, type }] 
      : [];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {items.map((item) => {
        const isSuccess = item.type === 'success';
        const isError = item.type === 'error';

        return (
          <div
            key={item.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 transition-all duration-300 animate-slideUp ${
              isSuccess
                ? 'bg-[#285943] text-white border-[#6F9E73]'
                : isError
                ? 'bg-[#b91c1c] text-white border-red-400'
                : 'bg-[#FAF6F0] text-[#285943] border-[#e8ddca]'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#6F9E73] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-red-200 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-[#C97852] shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs sm:text-sm font-montserrat font-medium">
              {item.message}
            </div>

            <button
              onClick={() => {
                if (onClose) onClose();
                if (onRemove) onRemove(item.id);
              }}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
