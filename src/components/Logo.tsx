import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = ''
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : '#285943';
  const leafColor = isLight ? '#6F9E73' : '#6F9E73';

  const sizeClasses = {
    sm: {
      text: 'text-xl tracking-[0.2em]',
      leaf: 20,
    },
    md: {
      text: 'text-2xl sm:text-3xl tracking-[0.22em]',
      leaf: 24,
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-[0.25em]',
      leaf: 30,
    },
  }[size];

  return (
    <a
      href="#"
      id="brand-logo-link"
      className={`inline-flex items-center gap-2 group transition-opacity hover:opacity-90 ${className}`}
      aria-label="NATIVA - Inicio"
    >
      {/* Botanical Leaf Mark integrated with NATIVA brand */}
      <span
        className={`${sizeClasses.text} font-black font-montserrat uppercase leading-none`}
        style={{ color: textColor }}
      >
        NATIV<span className="relative inline-block">
          A
          <svg
            className="absolute -top-1 -right-2 text-[#6F9E73]"
            width={sizeClasses.leaf}
            height={sizeClasses.leaf}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill={leafColor} fillOpacity="0.25" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </span>
      </span>
    </a>
  );
};
