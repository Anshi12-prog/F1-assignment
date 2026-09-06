import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '@/theme';
import type { ColorToken } from '@/theme';

export type IconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'search'
  | 'check'
  | 'star'
  | 'shield'
  | 'info'
  | 'alert'
  | 'refresh'
  | 'close'
  | 'store'
  | 'tag'
  | 'truck'
  | 'sliders';

const PATHS: Record<IconName, React.ReactNode> = {
  'chevron-left': <Path d="M15 18l-6-6 6-6" />,
  'chevron-right': <Path d="M9 18l6-6-6-6" />,
  search: (
    <>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M20 20l-3.5-3.5" />
    </>
  ),
  check: <Path d="M20 6L9 17l-5-5" />,
  star: <Path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8L6.6 19.7l1-6L3.2 9.4l6.1-.9L12 3z" />,
  shield: <Path d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" />,
  info: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 11v5M12 8h.01" />
    </>
  ),
  alert: (
    <>
      <Path d="M12 4l9 16H3l9-16z" />
      <Path d="M12 10v4M12 17h.01" />
    </>
  ),
  refresh: <Path d="M20 12a8 8 0 11-2.3-5.6M20 4v4h-4" />,
  close: <Path d="M18 6L6 18M6 6l12 12" />,
  store: <Path d="M4 9h16v10H4V9zM3 9l1.5-5h15L21 9M9 19v-5h6v5" />,
  tag: (
    <>
      <Path d="M20 12l-8 8-8-8V4h8l8 8z" />
      <Path d="M8 8h.01" />
    </>
  ),
  truck: (
    <>
      <Path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <Circle cx="7" cy="18" r="1.6" />
      <Circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  sliders: <Path d="M4 8h10M18 8h2M4 16h4M12 16h8M14 5v6M8 13v6" />,
};

interface Props {
  name: IconName;
  size?: number;
  color?: ColorToken;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = 'textPrimary', strokeWidth = 1.9 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors[color]}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </Svg>
  );
}
