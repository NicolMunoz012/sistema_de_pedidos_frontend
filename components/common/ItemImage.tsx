'use client';

import { useState } from 'react';

interface ItemImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ItemImage({ src, alt, className = '' }: ItemImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Si no hay src o hubo error, mostrar placeholder
  const showPlaceholder = !src || error;

  if (showPlaceholder) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center ${className}`}>
        <span className="text-6xl opacity-50">🍽️</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
          <span className="text-4xl opacity-30 animate-pulse">⏳</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
}
