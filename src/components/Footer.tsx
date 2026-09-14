import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const navLinks = [
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Producto Destacado', href: '#destacado' },
    { name: 'Nuestra Línea', href: '#nuestra-linea' },
    { name: 'Sobre NATIVA', href: '#sobre-nativa' },
    { name: 'Testimonios', href: '#testimonios' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="main-footer" className="bg-[#1e4533] text-white border-t border-[#285943] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Brand and Mission */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="text-xs sm:text-sm text-[#F3EBDD]/80 font-montserrat leading-relaxed max-w-sm mb-4 sm:mb-6">
              Empresa colombiana dedicada a la elaboración y comercialización artesanal de productos naturales, infusiones botánicas y alimentos saludables.
            </p>
            <p className="font-lora italic text-xs text-[#6F9E73]">
              “Lo natural también puede transformar tu día.”
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#6F9E73] mb-3 sm:mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-montserrat font-medium text-[#F3EBDD]/80">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-white transition-colors duration-150 inline-flex items-center gap-2 py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C97852]" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#6F9E73] mb-3 sm:mb-4">
              Contacto & Atención
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-montserrat text-[#F3EBDD]/80">
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <a
                  href="https://wa.me/573124567890?text=Hola%20NATIVA,%20quiero%20informaci%C3%B3n%20sobre%20sus%20productos%20naturales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +57 312 456 7890 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6F9E73] shrink-0" />
                <a
                  href="mailto:contacto@nativacolombia.com"
                  className="hover:text-white transition-colors"
                >
                  contacto@nativacolombia.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6F9E73] shrink-0 mt-0.5" />
                <span>Bogotá D.C. & Cundinamarca, Colombia</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Badges */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#6F9E73] mb-3 sm:mb-4">
              Síguenos
            </h4>
            <p className="text-xs text-[#F3EBDD]/70 font-montserrat mb-4">
              Acompáñanos en redes y descubre recetas botánicas.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C97852] text-white flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram NATIVA"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#C97852] text-white flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook NATIVA"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/573124567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#6F9E73] text-white flex items-center justify-center transition-colors duration-200"
                aria-label="WhatsApp NATIVA"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar / Copyright & Admin Access */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-montserrat text-[#F3EBDD]/60 text-center sm:text-left">
          <p>© 2026 NATIVA – Productos naturales y bienestar. Todos los derechos reservados.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#admin"
              id="footer-admin-login-link"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'admin';
              }}
              className="text-[#F3EBDD]/70 hover:text-white transition-colors underline-offset-4 hover:underline py-1"
            >
              Acceso Administrador
            </a>

            <div className="flex items-center gap-1.5 text-[#F3EBDD]/70">
              <span>Hecho con amor artesanal en Colombia</span>
              <Heart className="w-3.5 h-3.5 text-[#C97852] fill-[#C97852]" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
