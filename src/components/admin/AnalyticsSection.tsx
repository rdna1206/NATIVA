import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  ShoppingBag, 
  Users, 
  Target,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnalyticsEvent, CustomerRequest, Product } from '../../types';

interface AnalyticsSectionProps {
  events: AnalyticsEvent[];
  requests: CustomerRequest[];
  products: Product[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  events,
  requests,
  products
}) => {
  // Compute real metrics
  const pageVisits = events.filter(e => e.eventType === 'page_view');
  const ctaClicks = events.filter(e => e.eventType === 'cta_click');
  const totalVisits = pageVisits.length || 1;
  const totalClicks = ctaClicks.length;
  const totalRequests = requests.length;

  const conversionRate = totalVisits > 0 
    ? ((totalRequests / totalVisits) * 100).toFixed(1) 
    : '0.0';

  // Group events by day for trend chart
  const last7Days: Record<string, { date: string; visits: number; clicks: number; requests: number }> = {};
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
    last7Days[key] = { date: label, visits: 0, clicks: 0, requests: 0 };
  }

  events.forEach(e => {
    const key = e.timestamp.split('T')[0];
    if (last7Days[key]) {
      if (e.eventType === 'page_view') last7Days[key].visits += 1;
      if (e.eventType === 'cta_click') last7Days[key].clicks += 1;
    }
  });

  requests.forEach(r => {
    const key = r.createdAt.split('T')[0];
    if (last7Days[key]) {
      last7Days[key].requests += 1;
    }
  });

  const trendData = Object.values(last7Days);

  // Group CTA clicks by target
  const ctaCounts: Record<string, number> = {};
  ctaClicks.forEach(c => {
    const targetName = c.target || 'General';
    ctaCounts[targetName] = (ctaCounts[targetName] || 0) + 1;
  });

  const ctaBreakdown = Object.entries(ctaCounts).map(([name, value]) => ({
    name: name.replace(/-/g, ' ').toUpperCase(),
    value
  }));

  // Group requests by product
  const productRequests: Record<string, number> = {};
  requests.forEach(r => {
    const pName = r.productName || 'Otros';
    productRequests[pName] = (productRequests[pName] || 0) + 1;
  });

  const topProductsData = Object.entries(productRequests).map(([name, count]) => ({
    name,
    solicitudes: count
  }));

  const COLORS = ['#285943', '#C97852', '#6F9E73', '#d97706', '#0284c7', '#8b5cf6'];

  return (
    <div className="space-y-6 font-montserrat">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs">
        <h2 className="text-xl font-bold text-[#285943]">
          Estadísticas & Métricas Reales
        </h2>
        <p className="text-xs text-[#285943]/70 mt-0.5">
          Datos medidos en tiempo real a partir de visitas, interacciones con botones de compra y solicitudes enviadas.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#285943]/70 uppercase tracking-wider">Visitas Medidas</span>
            <Users className="w-5 h-5 text-[#285943]" />
          </div>
          <p className="text-3xl font-extrabold text-[#285943]">{totalVisits}</p>
          <p className="text-[11px] text-[#285943]/60 mt-1">Sesiones registradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#285943]/70 uppercase tracking-wider">Clics en CTA</span>
            <MousePointerClick className="w-5 h-5 text-[#C97852]" />
          </div>
          <p className="text-3xl font-extrabold text-[#285943]">{totalClicks}</p>
          <p className="text-[11px] text-[#285943]/60 mt-1">Interacciones de compra</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#285943]/70 uppercase tracking-wider">Solicitudes</span>
            <ShoppingBag className="w-5 h-5 text-[#6F9E73]" />
          </div>
          <p className="text-3xl font-extrabold text-[#285943]">{totalRequests}</p>
          <p className="text-[11px] text-[#285943]/60 mt-1">Formularios completados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e8ddca] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#285943]/70 uppercase tracking-wider">Conversión</span>
            <Target className="w-5 h-5 text-[#285943]" />
          </div>
          <p className="text-3xl font-extrabold text-[#285943]">{conversionRate}%</p>
          <p className="text-[11px] text-[#285943]/60 mt-1">Visitas a pedidos</p>
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8ddca] shadow-xs">
        <h3 className="text-base font-bold text-[#285943] mb-1">
          Tendencia de Actividad en los Últimos 7 Días
        </h3>
        <p className="text-xs text-[#285943]/60 mb-6">
          Comportamiento diario de visitas, clics en llamados a la acción y solicitudes.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#285943" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#285943" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C97852" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#C97852" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e9dc" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#285943' }} />
              <YAxis tick={{ fontSize: 11, fill: '#285943' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF6F0',
                  borderRadius: '12px',
                  border: '1px solid #e8ddca',
                  fontSize: '12px',
                  fontFamily: 'Montserrat'
                }}
              />
              <Area type="monotone" dataKey="visits" name="Visitas" stroke="#285943" fillOpacity={1} fill="url(#colorVisits)" />
              <Area type="monotone" dataKey="clicks" name="Clics CTA" stroke="#C97852" fillOpacity={1} fill="url(#colorClicks)" />
              <Area type="monotone" dataKey="requests" name="Pedidos" stroke="#6F9E73" strokeWidth={2} fill="#6F9E73" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts: Products & CTA Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Products bar chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8ddca] shadow-xs">
          <h3 className="text-base font-bold text-[#285943] mb-1">
            Productos Más Solicitados
          </h3>
          <p className="text-xs text-[#285943]/60 mb-4">
            Distribución de demanda por producto en las solicitudes recibidas.
          </p>

          {topProductsData.length === 0 ? (
            <div className="text-center py-12 text-[#285943]/60 text-xs">
              Aún no hay solicitudes registradas para graficar productos.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e9dc" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#285943' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#285943' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF6F0',
                      borderRadius: '12px',
                      border: '1px solid #e8ddca',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="solicitudes" name="Solicitudes" fill="#285943" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CTA Breakdown Pie */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8ddca] shadow-xs">
          <h3 className="text-base font-bold text-[#285943] mb-1">
            Interacción por Botón / CTA
          </h3>
          <p className="text-xs text-[#285943]/60 mb-4">
            Origen de los clics hacia el formulario «QUIERO MI PRODUCTO».
          </p>

          {ctaBreakdown.length === 0 ? (
            <div className="text-center py-12 text-[#285943]/60 text-xs">
              Aún no hay interacciones registradas.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ctaBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {ctaBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
