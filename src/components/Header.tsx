import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ShoppingBag, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenOrderModal: (productId?: string) => void;
  cartCount?: number;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenOrderModal, 
  cartCount = 0,
  onOpenAdmin,
  isAdminLoggedIn = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Producto Destacado', href: '#destacado' },
    { name: 'Nuestra Línea', href: '#nuestra-linea' },
    { name: 'Sobre NATIVA', href: '#sobre-nativa' },
    { name: 'Testimonios', href: '#testimonios' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F3EBDD]/95 backdrop-blur-md shadow-sm py-3.5 border-b border-[#e5dac5]'
          : 'bg-[#F3EBDD] py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo variant="dark" size="md" />

        {/* Desktop Navigation */}
        <nav
          id="desktop-navigation"
          className="hidden lg:flex items-center space-x-7 font-montserrat text-sm font-semibold tracking-wide text-[#285943]"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative py-1 text-[#285943] hover:text-[#C97852] transition-colors duration-200 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C97852] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Button & Cart */}
        <div className="hidden sm:flex items-center space-x-3.5">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'bg-[#285943] text-white border-[#285943]'
                  : 'bg-transparent text-[#285943]/70 hover:text-[#285943] border-[#e8ddca] hover:bg-[#FAF6F0]'
              }`}
              title={isAdminLoggedIn ? 'Ir al Panel Administrador' : 'Acceso Administrador'}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">{isAdminLoggedIn ? 'Panel' : 'Admin'}</span>
            </button>
          )}

          <button
            id="header-cta-button"
            onClick={() => onOpenOrderModal()}
            className="px-5 py-2.5 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>QUIERO MI PRODUCTO</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-[#285943] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Actions: Admin, Cart, Menu Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 lg:hidden">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                isAdminLoggedIn
                  ? 'bg-[#285943] text-white border-[#285943]'
                  : 'bg-transparent text-[#285943]/80 hover:text-[#285943] border-[#e8ddca] hover:bg-[#FAF6F0]'
              }`}
              title={isAdminLoggedIn ? 'Panel de Administración' : 'Acceso Administrador'}
              aria-label="Panel Administrador"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}

          <button
            id="mobile-cart-btn"
            onClick={() => onOpenOrderModal()}
            className="p-2 text-[#285943] hover:text-[#C97852] transition-colors relative flex items-center justify-center rounded-lg border border-[#e8ddca] bg-[#FAF6F0]"
            aria-label="Abrir pedido"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C97852] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#285943] hover:text-[#C97852] rounded-lg transition-colors focus:outline-none border border-[#e8ddca] bg-[#FAF6F0]"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu-drawer"
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-[32rem] opacity-100 border-b border-[#e5dac5] bg-[#F3EBDD]/98 backdrop-blur-md shadow-lg' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="flex items-center min-h-[44px] px-3 py-2.5 text-sm font-bold font-montserrat text-[#285943] hover:text-[#C97852] hover:bg-[#FAF6F0] rounded-lg transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C97852] mr-2.5" />
              {link.name}
            </a>
          ))}

          <div className="pt-3 border-t border-[#e5dac5] space-y-2">
            <button
              id="mobile-drawer-cta-button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full min-h-[44px] py-3 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>QUIERO MI PRODUCTO</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full min-h-[40px] py-2 text-center text-xs font-semibold text-[#285943]/75 hover:text-[#285943] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Ir al Panel Administrador' : 'Acceso Administrador'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
