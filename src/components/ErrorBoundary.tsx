import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NATIVA Uncaught UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F3EBDD] flex items-center justify-center p-6 font-montserrat text-[#285943]">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-[#e8ddca] text-center">
            <div className="w-16 h-16 bg-[#C97852]/15 text-[#C97852] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-montserrat text-[#285943] mb-2">
              NATIVA
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#6F9E73] font-semibold mb-4">
              Bienestar & Naturaleza
            </p>
            <p className="text-sm text-[#285943]/80 mb-6 font-lora italic">
              Hemos encontrado un inconveniente temporal al cargar esta sección. Tu experiencia es nuestra prioridad.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-[#285943] hover:bg-[#1e4533] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recargar Página</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = window.location.origin + window.location.pathname;
                }}
                className="px-5 py-2.5 bg-transparent border border-[#285943]/30 hover:border-[#285943] text-[#285943] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
