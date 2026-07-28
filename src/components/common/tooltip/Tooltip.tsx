import { useId } from 'react';
import styled, { css } from 'styled-components';

import { Inverse, System } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type TooltipSize = 'medium' | 'small';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  className?: string;
  size?: TooltipSize;
  position?: TooltipPosition;
  align?: TooltipAlign;
  text: string;
  shortcut?: string;
}

const Tooltip = ({
  className,
  size = 'medium',
  position = 'bottom',
  align = 'start',
  text,
  shortcut,
}: TooltipProps) => {
  const isVertical = position === 'top' || position === 'bottom';
  const arrowFirst = position === 'bottom' || position === 'right';

  return (
    <Wrapper className={className} isVertical={isVertical}>
      <Bubble size={size}>
        <Text size={size}>{text}</Text>
        {shortcut && <Shortcut size={size}>{shortcut}</Shortcut>}
      </Bubble>
      <Arrow size={size} position={position} align={align} arrowFirst={arrowFirst} />
    </Wrapper>
  );
};

const arrowShapes: Record<TooltipPosition, { viewBox: string; path: string }> = {
  top: {
    viewBox: '0 0 20 7',
    path: 'M7.5704 4.1654L5.9157 2.2349C5.2111 1.4129 4.8587 1.0019 4.4304 0.7066C4.0509 0.445 3.629 0.251 3.1834 0.1331C2.6805 0 2.1391 0 1.0564 0L18.9436 0C17.8609 0 17.3195 0 16.8166 0.1331C16.371 0.251 15.9491 0.445 15.5696 0.7066C15.1413 1.0019 14.789 1.4129 14.0843 2.2349L14.0843 2.2349L12.4296 4.1654L12.4296 4.1654C11.5926 5.1419 11.1741 5.6302 10.6761 5.8091C10.2391 5.9661 9.7609 5.9661 9.3239 5.8091C8.8259 5.6302 8.4074 5.1419 7.5704 4.1654L7.5704 4.1654Z',
  },
  bottom: {
    viewBox: '0 0 20 7',
    path: 'M12.4296 2.8346L14.0843 4.7651C14.7889 5.5871 15.1413 5.9981 15.5696 6.2934C15.9491 6.555 16.371 6.749 16.8166 6.8669C17.3195 7 17.8609 7 18.9436 7L1.0564 7C2.1391 7 2.6805 7 3.1834 6.8669C3.629 6.749 4.0509 6.555 4.4304 6.2934C4.8587 5.9981 5.211 5.5871 5.9157 4.7651L5.9157 4.7651L7.5704 2.8346L7.5704 2.8346C8.4074 1.8581 8.8259 1.3698 9.3239 1.1909C9.7609 1.0339 10.2391 1.0339 10.6761 1.1909C11.1741 1.3698 11.5926 1.8581 12.4296 2.8346L12.4296 2.8346Z',
  },
  left: {
    viewBox: '0 0 7 20',
    path: 'M4.1654 12.4296L2.2349 14.0843C1.4129 14.7889 1.0019 15.1413 0.7066 15.5696C0.445 15.9491 0.251 16.371 0.1331 16.8166C0 17.3195 0 17.8609 0 18.9436L0 1.0564C0 2.1391 0 2.6805 0.1331 3.1834C0.251 3.629 0.445 4.0509 0.7066 4.4304C1.0019 4.8587 1.4129 5.211 2.2349 5.9157L2.2349 5.9157L4.1654 7.5704L4.1655 7.5704C5.1419 8.4074 5.6302 8.8259 5.8091 9.3239C5.9661 9.7609 5.9661 10.2391 5.8091 10.6761C5.6302 11.1741 5.1419 11.5926 4.1655 12.4296L4.1654 12.4296Z',
  },
  right: {
    viewBox: '0 0 7 20',
    path: 'M2.8346 7.5704L4.7651 5.9157C5.5871 5.2111 5.9981 4.8587 6.2934 4.4304C6.555 4.0509 6.749 3.629 6.8669 3.1834C7 2.6805 7 2.1391 7 1.0564L7 18.9436C7 17.8609 7 17.3195 6.8669 16.8166C6.749 16.371 6.555 15.9491 6.2934 15.5696C5.9981 15.1413 5.5871 14.789 4.7651 14.0843L4.7651 14.0843L2.8346 12.4296L2.8346 12.4296C1.8581 11.5926 1.3698 11.1741 1.1909 10.6761C1.0339 10.2391 1.0339 9.7609 1.1909 9.3239C1.3698 8.8259 1.8581 8.4074 2.8346 7.5704L2.8346 7.5704Z',
  },
};

// width/height express each direction's shape in its "top" (20x7) orientation; swapped for left/right below
const arrowTipSize = {
  medium: { width: 20, height: 7 },
  small: { width: 14, height: 6 },
};

const arrowSlot = {
  medium: { inset: 8 },
  small: { inset: 5 },
};

const ArrowGraphic = ({ position, width, height }: { position: TooltipPosition; width: number; height: number }) => {
  const maskId = useId();
  const { viewBox, path } = arrowShapes[position];
  const [, , boxWidth, boxHeight] = viewBox.split(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <mask
        id={maskId}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={boxWidth}
        height={boxHeight}
      >
        <path d={path} fill="#FF0000" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect width={boxWidth} height={boxHeight} fill={Inverse.background} opacity="0.88" />
        <rect width={boxWidth} height={boxHeight} fill={System.blue} opacity="0.05" />
      </g>
    </svg>
  );
};

const Arrow = ({
  size,
  position,
  align,
  arrowFirst,
}: {
  size: TooltipSize;
  position: TooltipPosition;
  align: TooltipAlign;
  arrowFirst: boolean;
}) => {
  const isVertical = position === 'top' || position === 'bottom';
  const { width, height } = arrowTipSize[size];

  return (
    <ArrowSlot size={size} position={position} align={align} arrowFirst={arrowFirst}>
      <ArrowGraphic position={position} width={isVertical ? width : height} height={isVertical ? height : width} />
    </ArrowSlot>
  );
};

export default Tooltip;

const Wrapper = styled.div<{ isVertical: boolean }>`
  display: inline-flex;
  flex-direction: ${(props) => (props.isVertical ? 'column' : 'row')};
  align-items: stretch;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
`;

const bubbleSize = {
  medium: css`
    gap: 6px;
    min-width: 64px;
    max-width: 280px;
    padding: 8px 12px;
    border-radius: 8px;
  `,
  small: css`
    gap: 2px;
    min-width: 36px;
    max-width: 280px;
    padding: 5px 8px;
    border-radius: 6px;
  `,
};

const Bubble = styled.div<{ size: TooltipSize }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  ${(props) => bubbleSize[props.size]}

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  &::before {
    background-color: ${Inverse.background};
    opacity: 0.88;
  }

  &::after {
    background-color: ${System.blue};
    opacity: 0.05;
  }
`;

const Text = styled.p<{ size: TooltipSize }>`
  position: relative;
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  word-break: break-word;
  color: ${Inverse.label};

  ${(props) => typographyCss(props.size === 'medium' ? Typography.label1Normal.medium : Typography.caption2.medium)}
`;

const Shortcut = styled.span<{ size: TooltipSize }>`
  position: relative;
  flex-shrink: 0;
  white-space: nowrap;
  color: ${Inverse.label};
  opacity: 0.61;

  ${(props) => typographyCss(props.size === 'medium' ? Typography.label1Normal.medium : Typography.caption2.medium)}
`;

const flexAlign: Record<TooltipAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
};

const ArrowSlot = styled.div<{
  size: TooltipSize;
  position: TooltipPosition;
  align: TooltipAlign;
  arrowFirst: boolean;
}>`
  position: relative;
  display: flex;
  flex-shrink: 0;
  order: ${(props) => (props.arrowFirst ? -1 : 0)};
  ${(props) => {
    const { inset } = arrowSlot[props.size];
    const thickness = arrowTipSize[props.size].height;
    const isVertical = props.position === 'top' || props.position === 'bottom';
    const align = flexAlign[props.align];
    return isVertical
      ? css`
          height: ${thickness}px;
          padding-left: ${inset}px;
          padding-right: ${inset}px;
          justify-content: ${align};
        `
      : css`
          width: ${thickness}px;
          padding-top: ${inset}px;
          padding-bottom: ${inset}px;
          align-items: ${align};
        `;
  }}
`;
