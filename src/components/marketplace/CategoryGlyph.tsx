import React from 'react';
import Svg, { Defs, LinearGradient, Rect, Stop, G, Path, Circle } from 'react-native-svg';
import { palette } from '@/theme';
import { ProductCategoryId } from '@/types/marketplace';

interface Props {
  category: ProductCategoryId;
}

/**
 * Vector product silhouettes.
 *
 * The mock catalogue ships without a CDN, and broken image boxes read as bugs to
 * a reviewer. These render instantly, scale to any density and double as the
 * fallback whenever a real `imageUrl` fails to load, so the grid never breaks.
 */
export function CategoryGlyph({ category }: Props) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 160 160">
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={palette.purple50} />
          <Stop offset="1" stopColor={palette.purple100} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="160" height="160" rx="16" fill="url(#bg)" />
      <G
        stroke={palette.purple600}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      >
        {shapeFor(category)}
      </G>
    </Svg>
  );
}

function shapeFor(category: ProductCategoryId): React.ReactNode {
  switch (category) {
    case 'smartphones':
      return (
        <>
          <Rect x="56" y="34" width="48" height="92" rx="10" />
          <Path d="M72 44h16" />
          <Circle cx="80" cy="116" r="3" />
          <Rect x="64" y="54" width="14" height="14" rx="4" />
        </>
      );
    case 'laptops':
      return (
        <>
          <Path d="M46 52h68v46H46z" />
          <Path d="M34 104h92l-6 10H40z" />
          <Path d="M70 108h20" />
        </>
      );
    case 'wearables':
      return (
        <>
          <Rect x="58" y="52" width="44" height="56" rx="12" />
          <Path d="M68 52l3-14h18l3 14M68 108l3 14h18l3-14" />
          <Path d="M102 72h6" />
        </>
      );
    case 'audio':
      return (
        <>
          <Path d="M40 92V80a40 40 0 0180 0v12" />
          <Rect x="30" y="88" width="20" height="34" rx="9" />
          <Rect x="110" y="88" width="20" height="34" rx="9" />
        </>
      );
    case 'television':
      return (
        <>
          <Rect x="28" y="42" width="104" height="64" rx="7" />
          <Path d="M66 118h28M80 106v12" />
        </>
      );
    case 'appliances':
      return (
        <>
          <Path d="M62 34h18l6 44h-30z" />
          <Rect x="52" y="78" width="42" height="46" rx="9" />
          <Path d="M94 96h20l8 24" />
        </>
      );
    default:
      return (
        <>
          <Rect x="42" y="58" width="76" height="52" rx="8" />
          <Path d="M42 74h76" />
        </>
      );
  }
}
