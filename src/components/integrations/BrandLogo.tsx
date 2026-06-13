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

  if (failed) return <Fallback size={size} style={{ color }} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}
