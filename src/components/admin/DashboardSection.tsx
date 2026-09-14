import React from 'react';
import { 
  Tag, 
  ShoppingBag, 
  MousePointerClick, 
  Users, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Product, CustomerRequest, AdminUser, AdminSection } from '../../types';

interface DashboardSectionProps {
  products: Product[];
  requests: CustomerRequest[];
  admins: AdminUser[];
  totalClicks: number;
  totalVisits: number;
  onNavigate: (section: AdminSection) => void;
  onOpenProductModal: () => void;
  onSelectRequest: (req: CustomerRequest) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  products,
  requests,
  admins,
  totalClicks,
  totalVisits,
  onNavigate,
  onOpenProductModal,
  onSelectRequest
}) => {
  const pendingRequests = requests.filter(r => r.status === 'pendiente');
  const completedRequests = requests.filter(r => r.status === 'completada');

  const stats = [
    {
      title: 'Precios & Catálogo',
      value: 4,
      subtitle: '4 productos esenciales NATIVA',
      icon: <Tag className="w-5 h-5 text-[#285943]" />,
      bg: 'bg-[#285943]/10',
      action: () => onNavigate('prices')
    },
    {
      title: 'Solicitudes Recibidas',
      value: requests.length,
      subtitle: `${pendingRequests.length} pendientes de atención`,
      icon: <ShoppingBag className="w-5 h-5 text-[#C97852]" />,
      bg: 'bg-[#C97852]/10',
      badge: pendingRequests.length > 0 ? `${pendingRequests.length} nuevas` : undefined,
      action: () => onNavigate('requests')
    },
    {
      title: 'Interacciones CTA',
      value: totalClicks,
      subtitle: `${totalVisits} visitas registradas`,
      icon: <MousePointerClick className="w-5 h-5 text-[#6F9E73]" />,
      bg: 'bg-[#6F9E73]/10',
      action: () => onNavigate('analytics')
    },
    {
      title: 'Administradores',
      value: admins.filter(a => a.isActive !== false).length || 1,
      subtitle: 'Con permisos activos',
      icon: <Users className="w-5 h-5 text-[#285943]" />,
      bg: 'bg-[#285943]/10',
      action: () => onNavigate('admins')
    }
  ];

  return (
    <div className="space-y-8 font-montserrat">
      
      {/* Welcome Banner */}
      <div className="bg-[#285943] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#6F9E73]/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6F9E73]/20 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F3EBDD] block mb-2">
            PANEL DE CONTROL GENERAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Bienvenido al Gestor NATIVA
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Supervisa las solicitudes de compra directas, actualiza los precios de los 4 productos esenciales en tiempo real con Firebase y gestiona los contenidos de la Landing Page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('prices')}
              className="px-4 py-2.5 bg-[#C97852] hover:bg-[#b3633e] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Tag className="w-4 h-4" />
              <span>Modificar Precios</span>
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Solicitudes ({pendingRequests.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.action}
            className="bg-white rounded-2xl p-5 border border-[#e8ddca] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#285943]/40 group-hover:text-[#285943] transition-colors" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#285943]">
                  {stat.value}
                </span>
                {stat.badge && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#C97852] text-white">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-[#285943] mt-1">
                {stat.title}
              </p>
              <p className="text-[11px] text-[#285943]/60 font-medium mt-0.5">
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Requests & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Requests Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#e8ddca] shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-[#e8ddca] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#285943]">
                Últimas Solicitudes Recibidas
              </h3>
              <p className="text-xs text-[#285943]/70">
                Contactos generados a través de «QUIERO MI PRODUCTO»
              </p>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs font-bold text-[#C97852] hover:text-[#b3633e] transition-colors cursor-pointer"
            >
              Ver todas ({requests.length}) →
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-10 text-[#285943]/60 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No se han registrado solicitudes todavía.</p>
              <p className="text-[11px] text-[#285943]/40 mt-1">
                Aparecerán automáticamente aquí cuando los visitantes completen el formulario.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e8ddca] text-[#285943]/70 font-semibold">
                    <th className="pb-2.5">Cliente</th>
                    <th className="pb-2.5">Producto</th>
                    <th className="pb-2.5">Estado</th>
                    <th className="pb-2.5">Fecha</th>
                    <th className="pb-2.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddca]/60">
                  {requests.slice(0, 5).map((req) => (
                    <tr key={req.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 font-semibold text-[#285943]">
                        {req.customerName}
                        <span className="block text-[10px] text-[#285943]/60 font-normal">
                          {req.customerPhone}
                        </span>
                      </td>
                      <td className="py-3 text-[#285943]">
                        {req.productName}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'completada'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'contactada'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-[#C97852]/20 text-[#C97852]'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 text-[#285943]/60 text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectRequest(req)}
                          className="px-2.5 py-1 bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Summary / Firebase System Health */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-[#e8ddca]">
            <h3 className="text-sm font-bold text-[#285943] mb-3">
              Estado de la Plataforma
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e8ddca]">
                <span className="text-[#285943] font-medium">Firestore Database</span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> En línea
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e8ddca]">
                <span className="text-[#285943] font-medium">Firebase Auth</span>
                <span className="flex items-center gap-1 text-green-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#e8ddca]">
                <span className="text-[#285943] font-medium">Sincronización Landing</span>
                <span className="flex items-center gap-1 text-[#6F9E73] font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tiempo Real
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#e8ddca]">
            <h3 className="text-sm font-bold text-[#285943] mb-3">
              Atajos Rápidos
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('prices')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF6F0] text-xs font-semibold text-[#285943] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>🏷️ Modificar Precios (4 productos)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#285943]/50" />
              </button>
              <button
                onClick={() => onNavigate('content')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF6F0] text-xs font-semibold text-[#285943] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>✏️ Editar textos de la Landing</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#285943]/50" />
              </button>
              <button
                onClick={() => onNavigate('analytics')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF6F0] text-xs font-semibold text-[#285943] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📊 Ver estadísticas de clics</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#285943]/50" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
