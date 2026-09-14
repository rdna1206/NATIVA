import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';

interface AdminLoginProps {
  onLoginSuccess: (user?: any) => void;
  onBackToPublic?: () => void;
  onBackToStore?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic, onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoBack = () => {
    if (onBackToPublic) {
      onBackToPublic();
    } else if (onBackToStore) {
      onBackToStore();
    } else {
      window.location.hash = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await authService.login(email, password);
      onLoginSuccess(loggedUser);
    } catch (err: unknown) {
      console.error('Auth error:', err);
      let message = 'Ocurrió un error al intentar autenticar.';
      if (err instanceof Error) {
        if (
          err.message.includes('user-not-found') ||
          err.message.includes('wrong-password') ||
          err.message.includes('invalid-credential')
        ) {
          message = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else if (err.message.includes('invalid-email')) {
          message = 'El formato del correo electrónico no es válido.';
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-montserrat">
      {/* Background organic glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6F9E73]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C97852]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#285943] text-white shadow-lg mb-4">
            <span className="font-lora text-2xl font-bold">N</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#285943] tracking-tight">
            NATIVA
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#6F9E73] font-bold mt-1">
            Panel de Administración
          </p>
          <p className="font-lora italic text-sm text-[#285943]/70 mt-2">
            “Lo natural también puede transformar tu día.”
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-[#e8ddca]">
          <div className="mb-6 flex items-center justify-between border-b border-[#e8ddca] pb-3">
            <h3 className="text-lg font-bold text-[#285943]">
              Iniciar Sesión
            </h3>
            <span className="text-[11px] font-semibold text-[#C97852] bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#e8ddca]">
              Acceso Seguro
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#285943] mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#285943]/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@nativa.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#e8ddca] focus:border-[#285943] focus:ring-1 focus:ring-[#285943] text-sm text-[#285943] outline-hidden bg-[#FAF6F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#285943] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#285943]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#e8ddca] focus:border-[#285943] focus:ring-1 focus:ring-[#285943] text-sm text-[#285943] outline-hidden bg-[#FAF6F0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#285943]/60 hover:text-[#285943] cursor-pointer"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#285943] hover:bg-[#1e4533] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>INGRESAR AL PANEL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back to public store */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGoBack}
            className="text-xs font-semibold text-[#285943] hover:text-[#C97852] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>← Volver a la Landing Page de NATIVA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
