import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  FileText, 
  BarChart3, 
  Users, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Sparkles,
  Shield,
  Bell
} from 'lucide-react';
import { AdminSection, AdminUser, Product, CustomerRequest, SiteContent, AnalyticsEvent } from '../../types';
import { DashboardSection } from './DashboardSection';
import { PricesSection } from './PricesSection';
import { RequestsSection } from './RequestsSection';
import { ContentSection } from './ContentSection';
import { AnalyticsSection } from './AnalyticsSection';
import { AdminsSection } from './AdminsSection';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  onViewPublicStore: () => void;
  products: Product[];
  requests: CustomerRequest[];
  siteContent: SiteContent;
  admins: AdminUser[];
  analyticsEvents: AnalyticsEvent[];
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onRefreshAdmins: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onNavigate,
  currentUser,
  onLogout,
  onViewPublicStore,
  products,
  requests,
  siteContent,
  admins,
  analyticsEvents,
  onShowToast,
  onRefreshAdmins
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<CustomerRequest | null>(null);

  const pendingRequestsCount = requests.filter(r => r.status === 'pendiente').length;

  const navItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'prices' as AdminSection, label: 'Precios', icon: <Tag className="w-5 h-5" />, count: 4 },
    { id: 'requests' as AdminSection, label: 'Solicitudes', icon: <ShoppingBag className="w-5 h-5" />, count: pendingRequestsCount, highlight: pendingRequestsCount > 0 },
    { id: 'content' as AdminSection, label: 'Contenido', icon: <FileText className="w-5 h-5" /> },
    { id: 'analytics' as AdminSection, label: 'Estadísticas', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'admins' as AdminSection, label: 'Administradores', icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col lg:flex-row font-montserrat">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#285943] text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-lora font-bold text-lg">
            N
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider">NATIVA</h1>
            <p className="text-[10px] text-[#6F9E73] font-bold uppercase">Panel Administrador</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingRequestsCount > 0 && (
            <button
              onClick={() => onNavigate('requests')}
              className="p-2 bg-[#C97852] text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Bell className="w-4 h-4" />
              <span>{pendingRequestsCount}</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#285943] text-white flex flex-col justify-between p-6 shadow-2xl lg:static lg:z-auto transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo & Slogan */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#285943] flex items-center justify-center shadow-md">
                <span className="font-lora text-xl font-extrabold">N</span>
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-wider text-white">
                  NATIVA
                </h2>
                <p className="text-[10px] text-[#6F9E73] font-bold uppercase tracking-widest">
                  Gestión Natural
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-[#6F9E73] text-[#285943] flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white">
                  {currentUser?.displayName || 'Administrador'}
                </p>
                <p className="text-[10px] text-[#F3EBDD]/70 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#C97852] text-white shrink-0">
              {currentUser?.role === 'superadmin' ? 'Super' : 'Admin'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#285943] shadow-md font-extrabold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#285943] text-white'
                        : item.highlight
                        ? 'bg-[#C97852] text-white animate-pulse'
                        : 'bg-white/20 text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button
            onClick={onViewPublicStore}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#6F9E73]" />
              <span>Ver Tienda Pública</span>
            </div>
          </button>

          <button
            id="admin-logout-btn"
            onClick={onLogout}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:text-white hover:bg-red-900/40 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex bg-white border-b border-[#e8ddca] px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-lg font-extrabold text-[#285943] uppercase tracking-wider">
              {navItems.find(n => n.id === currentSection)?.label || 'Panel de Administración'}
            </h1>
            <p className="text-xs text-[#285943]/60">
              NATIVA • Productos Naturales & Bienestar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicStore}
              className="px-3.5 py-2 bg-[#FAF6F0] hover:bg-[#e8ddca] text-[#285943] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#e8ddca] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ir a la Landing Page</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cerrar sesión segura"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* Section View Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardSection
              products={products}
              requests={requests}
              admins={admins}
              totalClicks={analyticsEvents.filter(e => e.eventType === 'cta_click').length}
              totalVisits={analyticsEvents.filter(e => e.eventType === 'page_view').length || 1}
              onNavigate={onNavigate}
              onOpenProductModal={() => onNavigate('prices')}
              onSelectRequest={(req) => {
                setSelectedRequestForDetail(req);
                onNavigate('requests');
              }}
            />
          )}

          {(currentSection === 'prices' || currentSection === 'products') && (
            <PricesSection
              products={products}
              onShowToast={onShowToast}
            />
          )}

          {currentSection === 'requests' && (
            <RequestsSection
              requests={requests}
              selectedRequest={selectedRequestForDetail}
              onSelectRequest={setSelectedRequestForDetail}
              onShowToast={onShowToast}
            />
          )}

          {currentSection === 'content' && (
            <ContentSection
              content={siteContent}
              onShowToast={onShowToast}
            />
          )}

          {currentSection === 'analytics' && (
            <AnalyticsSection
              events={analyticsEvents}
              requests={requests}
              products={products}
            />
          )}

          {currentSection === 'admins' && (
            <AdminsSection
              admins={admins}
              currentUid={currentUser?.uid}
              onShowToast={onShowToast}
              onRefreshAdmins={onRefreshAdmins}
            />
          )}
        </div>
      </main>

    </div>
  );
};
