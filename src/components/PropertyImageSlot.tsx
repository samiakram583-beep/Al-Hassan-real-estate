import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface PropertyImageSlotProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export const PropertyImageSlot: React.FC<PropertyImageSlotProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-[#102A43] via-[#1B3A57] to-[#071B2D] flex flex-col items-center justify-center p-6 text-center text-white/80"
        role="img"
        aria-label={alt}
      >
        <Building2 className="w-8 h-8 mb-2 text-[#23845B]" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-white/90 line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
