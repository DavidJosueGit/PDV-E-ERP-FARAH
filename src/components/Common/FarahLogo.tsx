import React from 'react';

interface FarahLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const FarahLogo: React.FC<FarahLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'dark',
}) => {
  // Dimension definitions
  const dimensions = {
    sm: { badge: 32, textTitle: 'text-sm', textSub: 'text-[9px]' },
    md: { badge: 42, textTitle: 'text-base', textSub: 'text-[10px]' },
    lg: { badge: 56, textTitle: 'text-xl', textSub: 'text-xs' },
    xl: { badge: 80, textTitle: 'text-2xl', textSub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblema Circular Oficial Farah */}
      <div
        className="relative shrink-0 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
        style={{
          width: dimensions.badge,
          height: dimensions.badge,
          backgroundColor: '#FFCC33',
          border: '2px solid #242424',
        }}
        title="Farah Esfiharia & Pizzaria"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-0.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Círculo base amarelo */}
          <circle cx="50" cy="50" r="47" fill="#FFCC33" stroke="#242424" strokeWidth="3" />

          {/* Dunas do Deserto em tom dourado/carvão */}
          <path
            d="M 6 68 Q 30 62 55 69 T 94 65 L 94 92 L 6 92 Z"
            fill="#E5B21E"
          />
          <path
            d="M 6 74 Q 28 69 50 75 T 94 72 L 94 94 L 6 94 Z"
            fill="#242424"
          />

          {/* Silhueta dos camelos em preto #242424 */}
          {/* Camelo principal */}
          <g fill="#242424">
            {/* Camelo 1 (Líder) */}
            <path d="M 52 50 C 51 46 53 43 55 42 C 57 41 59 43 59 45 C 60 48 59 52 61 54 C 64 54 66 52 68 53 C 70 54 71 58 70 60 C 69 61 67 62 66 63 L 67 72 L 65 72 L 64 64 L 61 64 L 60 72 L 58 72 L 59 62 C 57 61 56 59 55 58 L 54 72 L 52 72 L 53 58 C 51 57 51 53 52 50 Z" />
            {/* Camelo 2 (Seguidor menor) */}
            <path d="M 36 54 C 35 51 37 48 38 47 C 40 46 41 48 41 50 C 42 52 41 55 43 56 C 45 56 46 54 48 55 C 49 56 50 59 49 61 C 48 62 47 63 46 64 L 47 71 L 45 71 L 44 64 L 42 64 L 41 71 L 39 71 L 40 63 C 38 62 37 60 37 59 L 36 71 L 34 71 L 35 59 C 34 58 34 56 36 54 Z" />
          </g>

          {/* Lettering Farah Curvo Superior em Vermelho Oficial #CF1020 */}
          <path
            id={`textPath-${size}`}
            d="M 16 48 A 38 38 0 0 1 84 48"
            fill="none"
          />
          <text fill="#CF1020" fontSize="18" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
            <textPath href={`#textPath-${size}`} startOffset="50%" textAnchor="middle">
              FARAH
            </textPath>
          </text>

          {/* Detalhe estelar sutil */}
          <circle cx="50" cy="22" r="1.5" fill="#CF1020" />
        </svg>
      </div>

      {/* Typography Block */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-wider uppercase ${dimensions.textTitle}`}
              style={{ color: '#CF1020' }}
            >
              FARAH
            </span>
            <span
              className={`font-semibold tracking-wide uppercase ${
                variant === 'light' ? 'text-stone-800' : 'text-stone-200'
              } ${dimensions.textSub}`}
            >
              Esfiharia & Pizzaria
            </span>
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 ${
              variant === 'light' ? 'text-stone-500' : 'text-stone-400'
            }`}
          >
            Tradição & Qualidade Árabe
          </span>
        </div>
      )}
    </div>
  );
};
