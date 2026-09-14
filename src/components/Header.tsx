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

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            id="mobile-cart-btn"
            onClick={() => onOpenOrderModal()}
            className="p-2 text-[#285943] hover:text-[#C97852] transition-colors relative"
            aria-label="Abrir pedido"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C97852] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#285943] hover:text-[#C97852] rounded-lg transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu-drawer"
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100 border-b border-[#e5dac5] bg-[#F3EBDD]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2 text-base font-semibold font-montserrat text-[#285943] hover:text-[#C97852] hover:bg-[#FAF6F0] rounded-md transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              id="mobile-drawer-cta-button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full py-3 bg-[#C97852] hover:bg-[#b3633e] text-white font-montserrat font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>QUIERO MI PRODUCTO</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
