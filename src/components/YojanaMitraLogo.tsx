import React from 'react';

interface YojanaMitraLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
}

export const YojanaMitraLogo: React.FC<YojanaMitraLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  showSubtext = true,
}) => {
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textScaleMap = {
    sm: { title: 'text-sm', sub: 'text-[8px]' },
    md: { title: 'text-base sm:text-lg', sub: 'text-[9px] sm:text-[10px]' },
    lg: { title: 'text-xl sm:text-2xl', sub: 'text-[11px]' },
    xl: { title: 'text-2xl sm:text-3xl', sub: 'text-[12px]' },
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Tricolor Lotus Mandala & Ashoka Chakra Logo Icon */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizeMap[size]} shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <defs>
          {/* Saffron Gradient Top */}
          <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#FF7700" />
          </linearGradient>

          {/* Green Gradient Bottom */}
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Teal Accent Gradient */}
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Lotus Petals - Saffron Top */}
        <path d="M100 20 C110 35, 125 45, 135 60 C115 65, 105 55, 100 20Z" fill="url(#saffronGrad)" />
        <path d="M100 20 C90 35, 75 45, 65 60 C85 65, 95 55, 100 20Z" fill="url(#saffronGrad)" />
        
        <path d="M135 60 C150 50, 165 55, 180 70 C165 85, 150 75, 135 60Z" fill="url(#saffronGrad)" />
        <path d="M65 60 C50 50, 35 55, 20 70 C35 85, 50 75, 65 60Z" fill="url(#saffronGrad)" />

        {/* Outer Lotus Petals - Green Bottom */}
        <path d="M180 70 C185 90, 175 110, 165 130 C145 120, 155 100, 180 70Z" fill="url(#greenGrad)" />
        <path d="M20 70 C15 90, 25 110, 35 130 C55 120, 45 100, 20 70Z" fill="url(#greenGrad)" />

        <path d="M165 130 C150 150, 130 165, 100 180 C100 155, 130 145, 165 130Z" fill="url(#greenGrad)" />
        <path d="M35 130 C50 150, 70 165, 100 180 C100 155, 70 145, 35 130Z" fill="url(#greenGrad)" />

        {/* Inner Petal Layers with Tech Nodes */}
        <circle cx="100" cy="35" r="3.5" fill="#FFFFFF" />
        <circle cx="155" cy="55" r="3.5" fill="#FFFFFF" />
        <circle cx="45" cy="55" r="3.5" fill="#FFFFFF" />
        <circle cx="165" cy="145" r="3.5" fill="#FFFFFF" />
        <circle cx="35" cy="145" r="3.5" fill="#FFFFFF" />
        <circle cx="100" cy="165" r="3.5" fill="#FFFFFF" />

        {/* Constellation Circuit Lines */}
        <path d="M100 100 L100 35 M100 100 L155 55 M100 100 L45 55 M100 100 L165 145 M100 100 L35 145 M100 100 L100 165" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

        {/* Central White Aura Circle */}
        <circle cx="100" cy="100" r="36" fill="#FFFFFF" shadow-lg="true" />
        <circle cx="100" cy="100" r="32" stroke="#1E40AF" strokeWidth="3" fill="#FFFFFF" />

        {/* Ashoka Chakra 24 Spokes */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x2 = 100 + 28 * Math.cos(rad);
          const y2 = 100 + 28 * Math.sin(rad);
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="#1E40AF"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Center Hub */}
        <circle cx="100" cy="100" r="5" fill="#1E40AF" />
      </svg>

      {/* Brand Typography matching official logo */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textScaleMap[size].title}`}>
              Yojana Mithra
            </span>
          </div>
          {showSubtext && (
            <span className={`font-extrabold tracking-[0.2em] text-[#6C5CE7] dark:text-[#818cf8] uppercase mt-1 ${textScaleMap[size].sub}`}>
              AI • GOVERNMENT SCHEMES
            </span>
          )}
        </div>
      )}
    </div>
  );
};

