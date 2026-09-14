import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { FeaturedProduct } from './components/FeaturedProduct';
import { ProductLine } from './components/ProductLine';
import { AboutUs } from './components/AboutUs';
import { Testimonial } from './components/Testimonial';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ProcessModal } from './components/ProcessModal';
import { OrderModal } from './components/OrderModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { Toast } from './components/admin/Toast';

import { PRODUCTS_DATA } from './data/products';
import { Product, CustomerRequest, SiteContent, AdminUser, AdminSection, AnalyticsEvent } from './types';
import { productService } from './services/productService';
import { contentService, DEFAULT_SITE_CONTENT } from './services/contentService';
import { requestService } from './services/requestService';
import { authService } from './services/authService';
import { analyticsService } from './services/analyticsService';
import { MessageCircle } from 'lucide-react';

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  return (
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.includes('admin') ||
    search.includes('admin') ||
    pathname.endsWith('/admin') ||
    pathname.endsWith('/admin/')
  );
};

export default function App() {
  // Navigation & View Mode
  const [view, setView] = useState<'public' | 'admin'>(() => {
    return checkIsAdminRoute() ? 'admin' : 'public';
  });
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Firestore Live Data
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // Public Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderInitialProductId, setOrderInitialProductId] = useState<string | undefined>(undefined);

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Sync Hash and Navigation changes
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setView('admin');
      } else {
        setView('public');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = authService.onAuthStateChanged((admin) => {
      setCurrentUser(admin);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to real-time Firestore Products & Content
  useEffect(() => {
    const unsubProducts = productService.subscribeProducts((items) => {
      if (items.length > 0) {
        setProducts(items);
      }
    });

    const unsubContent = contentService.subscribeContent((content) => {
      setSiteContent(content);
    });

    // Log public page view
    analyticsService.logPageView();

    // Listen to real-time analytics events
    const unsubAnalytics = analyticsService.subscribeEvents((evts) => {
      setAnalyticsEvents(evts);
    });

    return () => {
      unsubProducts();
      unsubContent();
      unsubAnalytics();
    };
  }, []);

  // Subscribe to Requests and Admins when user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const unsubRequests = requestService.subscribeRequests((reqs) => {
      setRequests(reqs);
    });

    refreshAdminsList();

    return () => {
      unsubRequests();
    };
  }, [currentUser]);

  const refreshAdminsList = async () => {
    try {
      const list = await authService.getAdmins();
      setAdmins(list);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      showToast('Has cerrado sesión correctamente.', 'info');
      setView('public');
      window.location.hash = '';
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Error al cerrar sesión.', 'error');
    }
  };

  const handleNavigateToAdmin = () => {
    setView('admin');
    window.location.hash = 'admin';
  };

  const handleNavigateToPublic = () => {
    setView('public');
    window.location.hash = '';
  };

  const handleOpenOrderModal = (productId?: string) => {
    setOrderInitialProductId(productId);
    setIsOrderModalOpen(true);
    analyticsService.logEvent('cta_click', 'order-modal-open', { productId });
  };

  // Find Featured Product (customized in Firestore or default Té Vital)
  const featuredProduct = products.find(p => p.isFeatured && p.isActive !== false) ||
    products.find(p => p.id === 'te-vital') ||
    products[0] ||
    PRODUCTS_DATA[0];

  // --------------------------------------------------------------------------
  // ADMIN VIEW ROUTING
  // --------------------------------------------------------------------------
  if (view === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center font-montserrat text-[#285943]">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#6F9E73] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#285943]">
              Verificando credenciales de NATIVA...
            </p>
          </div>
        </div>
      );
    }

    // Unauthenticated user -> Show Login Form
    if (!currentUser) {
      return (
        <>
          <AdminLogin
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Bienvenido(a), ${user.displayName || user.email}`, 'success');
            }}
            onBackToPublic={handleNavigateToPublic}
          />
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </>
      );
    }

    // Authenticated user -> Show Full Admin Panel
    return (
      <>
        <AdminLayout
          currentSection={adminSection}
          onNavigate={(sec) => setAdminSection(sec)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onViewPublicStore={handleNavigateToPublic}
          products={products}
          requests={requests}
          siteContent={siteContent}
          admins={admins}
          analyticsEvents={analyticsEvents}
          onShowToast={showToast}
          onRefreshAdmins={refreshAdminsList}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC LANDING PAGE (Kept 100% intact, fast and beautiful)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#F3EBDD] font-montserrat text-[#285943] selection:bg-[#6F9E73] selection:text-white">
      
      {/* 1. Header with Logo, smooth navigation, admin button & "QUIERO MI PRODUCTO" CTA */}
      <Header
        onOpenOrderModal={handleOpenOrderModal}
        onOpenAdmin={handleNavigateToAdmin}
        isAdminLoggedIn={!!currentUser}
      />

      <main className="flex-1">
        {/* 2. Hero with primary message, image, descriptive copy & dual CTAs */}
        <Hero
          onOpenOrderModal={() => handleOpenOrderModal()}
          content={siteContent.hero}
        />

        {/* 3. Benefits with Natural, Artesanal, Saludable, Local */}
        <Benefits benefits={siteContent.benefits} />

        {/* 4. Featured Product: Té Vital with exact text and CTA */}
        <FeaturedProduct
          product={featuredProduct}
          content={siteContent.featured}
          onSelectProduct={setSelectedProduct}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* 5. Nuestra Línea: Dynamic & Active products from Firestore */}
        <ProductLine
          products={products}
          onSelectProduct={setSelectedProduct}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* 6. Sobre NATIVA: Colombian artisanal story and philosophy with CTA */}
        <AboutUs
          onOpenProcessModal={() => setIsProcessModalOpen(true)}
          content={siteContent.about}
        />

        {/* 7. Testimonial: Customer quote in Lora font & verified review */}
        <Testimonial content={siteContent.testimonial} />

        {/* 8. Final CTA: Inspiring message and prominent "QUIERO MI PRODUCTO" CTA */}
        <FinalCTA
          onOpenOrderModal={() => handleOpenOrderModal()}
          content={siteContent.finalCta}
        />
      </main>

      {/* 9. Footer: Logo, navigation, contact, social media, admin access and copyright */}
      <Footer />

      {/* Interactive Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOrderProduct={(productId) => {
          setSelectedProduct(null);
          handleOpenOrderModal(productId);
        }}
      />

      <ProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        onOpenOrderModal={() => {
          setIsProcessModalOpen(false);
          handleOpenOrderModal();
        }}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        initialProductId={orderInitialProductId}
        products={products}
        onClose={() => setIsOrderModalOpen(false)}
      />

      {/* Floating Colombian WhatsApp Concierge */}
      <a
        href="https://wa.me/573124567890?text=Hola%20NATIVA,%20quiero%20hacer%20un%20pedido%20de%20sus%20productos%20naturales"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#285943] hover:bg-[#1e4533] text-white p-3.5 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 group cursor-pointer border-2 border-white"
        aria-label="Atención por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-[#6F9E73] group-hover:text-white transition-colors" />
        <span className="hidden sm:inline text-xs font-montserrat font-bold tracking-wide pr-1">
          Asesoría NATIVA
        </span>
      </a>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
