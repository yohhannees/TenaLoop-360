"use client";

import { useState } from "react";

type Props = {
  slug: string;
  color: string;
  name: string;
  Fallback: React.ElementType;
  size?: number;
};

/**
 * Renders the real brand logo from the Simple Icons CDN.
 * Falls back to a lucide icon (in brand color) if the logo can't load.
 */
export default function BrandLogo({ slug, color, name, Fallback, size = 26 }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) return <Fallback size={size} style={{ color }} />;

  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      {!loaded && <Fallback size={size} style={{ color }} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="absolute inset-0 object-contain"
        style={{ width: size, height: size, opacity: loaded ? 1 : 0 }}
      />
    </span>
  );
}
