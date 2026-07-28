import type { ReactNode } from 'react';
import styled from 'styled-components';
import { MdCheck, MdChevronRight } from 'react-icons/md';

import { Label as LabelColor, Line, System } from '@utils/constant/color';

export interface ListCellProps {
  className?: string;
  label: string;
  description?: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
  chevron?: boolean;
  selected?: boolean;
  disabled?: boolean;
  divider?: boolean;
  interaction?: boolean;
  verticalPadding?: 'none' | 'small' | 'medium' | 'large';
  verticalAlign?: 'top' | 'center';
  textEllipsis?: boolean;
  onClick?: () => void;
}

const PADDING_Y = { none: 0, small: 8, medium: 12, large: 16 } as const;

const ListCell = ({
  className,
  label,
  description,
  leadingContent,
  trailingContent,
  chevron = false,
  selected = false,
  disabled = false,
  divider = false,
  interaction = true,
  verticalPadding = 'medium',
  verticalAlign = 'top',
  textEllipsis = false,
  onClick,
}: ListCellProps) => {
  const hasTrailing = selected || !!trailingContent || chevron;

  return (
    <Wrapper className={className} divider={divider}>
      <Container
        as={onClick ? 'button' : 'div'}
        type={onClick ? 'button' : undefined}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        interactive={interaction && !!onClick}
        paddingY={PADDING_Y[verticalPadding]}
        align={verticalAlign}
      >
        {leadingContent && <Leading align={verticalAlign}>{leadingContent}</Leading>}
        <Content align={verticalAlign}>
          <TextGroup>
            <LabelText selected={selected} ellipsis={textEllipsis}>
              {label}
            </LabelText>
            {description && <Description ellipsis={textEllipsis}>{description}</Description>}
          </TextGroup>
          {hasTrailing && (
            <Trailing>
              {selected ? (
                <MdCheck size={20} color={System.blue} />
              ) : (
                trailingContent && <TrailingValue>{trailingContent}</TrailingValue>
              )}
              {!selected && chevron && <MdChevronRight size={16} color={LabelColor.alternative} />}
            </Trailing>
          )}
        </Content>
      </Container>
    </Wrapper>
  );
};

export default ListCell;

const Wrapper = styled.div<{ divider: boolean }>`
  width: 100%;
  border-bottom: ${(props) => (props.divider ? `1px solid ${Line.subtle}` : 'none')};
`;

const Container = styled.div<{ disabled: boolean; interactive: boolean; paddingY: number; align: 'top' | 'center' }>`
  position: relative;
  display: flex;
  align-items: ${(props) => (props.align === 'center' ? 'center' : 'flex-start')};
  gap: 8px;
  width: 100%;
  padding: ${(props) => props.paddingY}px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: ${(props) => (props.interactive ? 'pointer' : 'default')};
  opacity: ${(props) => (props.disabled ? 0.43 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &::before {
    content: '';
    position: absolute;
    inset: 0 -20px;
    border-radius: 12px;
    background-color: ${LabelColor.normal};
    opacity: 0;
    pointer-events: none;
  }

  ${(props) =>
    props.interactive &&
    `
    &:hover::before {
      opacity: 0.08;
    }
  `}
`;

const Leading = styled.div<{ align: 'top' | 'center' }>`
  display: flex;
  align-items: ${(props) => (props.align === 'center' ? 'center' : 'flex-start')};
  flex-shrink: 0;
`;

const Content = styled.div<{ align: 'top' | 'center' }>`
  display: flex;
  align-items: ${(props) => (props.align === 'center' ? 'center' : 'flex-start')};
  flex: 1 0 0;
  min-width: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const LabelText = styled.p<{ selected: boolean; ellipsis: boolean }>`
  margin: 0;
  min-height: 24px;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.0912px;
  color: ${(props) => (props.selected ? System.blue : LabelColor.normal)};
  font-weight: ${(props) => (props.selected ? 500 : 400)};

  ${(props) =>
    props.ellipsis &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

const Description = styled.p<{ ellipsis: boolean }>`
  margin: 0;
  width: 100%;
  font-size: 13px;
  line-height: 1.385;
  letter-spacing: 0.2522px;
  color: ${LabelColor.alternative};

  ${(props) =>
    props.ellipsis &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

const Trailing = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-left: 8px;
`;

const TrailingValue = styled.span`
  overflow: hidden;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.0912px;
  color: ${LabelColor.alternative};
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
