import styled, { css } from 'styled-components';
import { HiCheck } from 'react-icons/hi2';

import { BackgroundColor, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type MenuVariant = 'normal' | 'radio' | 'checkbox';
type MenuCellPadding = 8 | 12;

export interface MenuItemData {
  label: string;
  caption?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface MenuActionAreaData {
  leadingPlaceholder?: string;
  leadingValue: string;
  onLeadingChange: (value: string) => void;
  trailingLabel: string;
  onTrailingClick: () => void;
}

export interface MenuProps {
  className?: string;
  variant?: MenuVariant;
  cellPadding?: MenuCellPadding;
  items: MenuItemData[];
  actionArea?: MenuActionAreaData;
}

const Menu = ({ className, variant = 'normal', cellPadding = 8, items, actionArea }: MenuProps) => {
  return (
    <Container className={className}>
      <Content>
        {items.map((item) => (
          <Cell
            key={item.label}
            type="button"
            cellPadding={cellPadding}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {variant === 'radio' && <Radio selected={!!item.selected} />}
            {variant === 'checkbox' && (
              <Checkbox selected={!!item.selected}>
                <HiCheck />
              </Checkbox>
            )}
            <TextGroup>
              <ItemLabel active={variant === 'normal' && !!item.selected} disabled={item.disabled}>
                {item.label}
              </ItemLabel>
              {item.caption && <ItemCaption>{item.caption}</ItemCaption>}
            </TextGroup>
          </Cell>
        ))}
      </Content>
      {actionArea && (
        <ActionArea>
          <LeadingInput
            type="text"
            placeholder={actionArea.leadingPlaceholder}
            aria-label={actionArea.leadingPlaceholder ?? '입력'}
            value={actionArea.leadingValue}
            onChange={(event) => actionArea.onLeadingChange(event.target.value)}
          />
          <TrailingButton type="button" onClick={actionArea.onTrailingClick}>
            {actionArea.trailingLabel}
          </TrailingButton>
        </ActionArea>
      )}
    </Container>
  );
};

export default Menu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  max-height: 400px;
  background-color: ${BackgroundColor};
  border: 1px solid ${Line.neutral};
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(23, 23, 23, 0.06),
    0 2px 4px -2px rgba(23, 23, 23, 0.06);
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 4px;
  padding: 8px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(112, 115, 124, 0.16) transparent;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(112, 115, 124, 0.16);
    border-radius: 1000px;
  }
`;

const Cell = styled.button<{ cellPadding: MenuCellPadding }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: ${(props) => props.cellPadding}px 12px;
  background: none;
  border: none;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: rgba(23, 23, 23, 0.04);
  }

  &:disabled {
    opacity: 0.43;
    cursor: default;
    pointer-events: none;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const ItemLabel = styled.p<{ active?: boolean; disabled?: boolean }>`
  margin: 0;
  min-height: 24px;
  color: ${(props) => (props.disabled ? Label.alternative : props.active ? Orange.o500 : Label.normal)};
  ${(props) => typographyCss(props.active ? Typography.body1Normal.medium : Typography.body1Normal.regular)}
`;

const ItemCaption = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

const Radio = styled.span<{ selected: boolean }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-sizing: border-box;

  ${(props) =>
    props.selected
      ? css`
          border: 1.5px solid ${Orange.o500};
          background-color: ${Orange.o500};
          display: flex;
          align-items: center;
          justify-content: center;

          &::after {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: ${BackgroundColor};
          }
        `
      : css`
          border: 1.5px solid ${Line.strong};
        `}
`;

const Checkbox = styled.span<{ selected: boolean }>`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.selected
      ? css`
          border: 1.5px solid ${Orange.o500};
          background-color: ${Orange.o500};
        `
      : css`
          border: 1.5px solid ${Line.strong};
        `}

  svg {
    width: 12px;
    height: 12px;
    color: ${BackgroundColor};
    visibility: ${(props) => (props.selected ? 'visible' : 'hidden')};
  }
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px;
  border-top: 1px solid ${Line.alternative};
`;

const LeadingInput = styled.input`
  flex: 1 0 0;
  min-width: 0;
  padding: 4px 8px;
  background: none;
  border: none;
  outline: none;
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.bold)}

  &::placeholder {
    color: ${Label.alternative};
  }
`;

const TrailingButton = styled.button`
  padding: 7px 14px;
  background-color: ${Orange.o500};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${BackgroundColor};
  ${typographyCss(Typography.label2.bold)}
`;
