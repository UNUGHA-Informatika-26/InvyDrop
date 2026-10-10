import logo from '@/assets/logo-blackarch.png';

interface HeroBannerProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  /** Extra classes on the outer container (height, radius, flex-shrink, etc.) */
  className?: string;
  /** Extra classes on the content wrapper (alignment, padding, etc.) */
  contentClassName?: string;
}

export function HeroBanner({
  imageSrc,
  title,
  subtitle,
  className = '',
  contentClassName = '',
}: HeroBannerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 1 · Background image */}
      <img
        src={imageSrc}
        alt="Warehouse"
        className="w-full h-full object-cover"
      />

      {/* 2 · Light-blue colour overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ background: 'var(--hero-overlay)' }}
      />

      {/* 3 · Bottom scrim for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: 'linear-gradient(to top, var(--hero-scrim), transparent 60%)',
        }}
      />

      {/* 4 · Content */}
      <div className={`absolute inset-0 flex items-end pb-10 z-10 ${contentClassName}`}>
        {/* Logo kiri + kolom teks kanan */}
        <div className="flex items-center gap-0 min-w-0">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo WarehouseFlow"
            draggable={false}
            className="size-14 shrink-0 object-contain select-none drop-shadow-[0_2px_8px_rgba(20,20,19,0.45)]"
          />
          {/* Judul + subtitle ditumpuk di kanan logo */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="whitespace-nowrap font-bold leading-none tracking-tight text-white text-[clamp(1.25rem,6vw,1.75rem)] [text-shadow:0_1px_8px_rgba(20,20,19,0.35)]">
              {title}
            </h1>
            <p className="text-white/90 text-xs leading-snug [text-shadow:0_1px_8px_rgba(20,20,19,0.35)]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
