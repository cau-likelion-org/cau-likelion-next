import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { BackgroundColor, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type ActionAreaVariant = 'strong' | 'neutral' | 'compact' | 'cancel';

export interface ActionAreaProps {
  className?: string;
  variant?: ActionAreaVariant;
  mainAction: ReactNode;
  alternativeAction?: ReactNode;
  subAction?: ReactNode;
  compactContent?: boolean;
  extra?: ReactNode;
  divider?: boolean;
  caption?: string;
  sticky?: boolean;
}

const ActionArea = ({
  className,
  variant = 'strong',
  mainAction,
  alternativeAction,
  subAction,
  compactContent = false,
  extra,
  divider = false,
  caption,
  sticky = false,
}: ActionAreaProps) => {
  const showSubAction = Boolean(subAction) && !(variant === 'compact' && compactContent);

  return (
    <Root className={className} $divider={divider} $sticky={sticky}>
      {divider && <Divider />}
      {extra && <Extra>{extra}</Extra>}
      <Container>
        {caption && <Caption>{caption}</Caption>}

        {variant === 'strong' && (
          <ColumnContents>
            <RowSlots $direction="column" $gap={8}>
              <Slot $grow="full">{mainAction}</Slot>
              {alternativeAction && <Slot $grow="full">{alternativeAction}</Slot>}
            </RowSlots>
            {showSubAction && <SubActionSlot>{subAction}</SubActionSlot>}
          </ColumnContents>
        )}

        {variant === 'neutral' && (
          <RowSlots $direction="row" $gap={12} $justify="center">
            {showSubAction && <Slot $grow="auto">{subAction}</Slot>}
            {alternativeAction && <Slot $grow="flex">{alternativeAction}</Slot>}
            <Slot $grow="flex">{mainAction}</Slot>
          </RowSlots>
        )}

        {variant === 'compact' && (
          <RowSlots $direction="row" $gap={12} $justify="end">
            {showSubAction && <Slot $grow="auto">{subAction}</Slot>}
            {alternativeAction && <Slot $grow="auto">{alternativeAction}</Slot>}
            <Slot $grow="auto">{mainAction}</Slot>
          </RowSlots>
        )}

        {variant === 'cancel' && (
          <ColumnContents>
            <Slot $grow="full">{mainAction}</Slot>
          </ColumnContents>
        )}
      </Container>
      <SafeArea />
    </Root>
  );
};

export default ActionArea;

const Root = styled.div<{ $divider: boolean; $sticky: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  ${(props) =>
    props.$divider &&
    css`
      background-color: ${BackgroundColor};
    `}

  ${(props) =>
    props.$sticky &&
    css`
      position: sticky;
      bottom: 0;
    `}
`;

const Divider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-top: 1px solid ${Line.normal};
`;

const Extra = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 20px 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px;
`;

const Caption = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

const ColumnContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const RowSlots = styled.div<{ $direction: 'row' | 'column'; $gap: number; $justify?: 'center' | 'end' }>`
  display: flex;
  flex-direction: ${(props) => props.$direction};
  align-items: center;
  justify-content: ${(props) => (props.$direction === 'row' ? (props.$justify ?? 'center') : 'center')};
  gap: ${(props) => props.$gap}px;
  width: 100%;
`;

const Slot = styled.div<{ $grow: 'full' | 'flex' | 'auto' }>`
  display: flex;

  ${(props) =>
    props.$grow === 'full' &&
    css`
      width: 100%;

      > * {
        width: 100%;
      }
    `}

  ${(props) =>
    props.$grow === 'flex' &&
    css`
      flex: 1 1 0;
      min-width: 0;

      > * {
        width: 100%;
      }
    `}
`;

const SubActionSlot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
`;

const SafeArea = styled.div`
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;
