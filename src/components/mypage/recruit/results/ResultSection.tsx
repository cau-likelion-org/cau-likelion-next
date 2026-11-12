import { ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import { Black, Fill } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import StatCounts, { StatCountItem } from '../StatCounts';

export interface ResultSectionProps {
  title: string;
  counts?: StatCountItem[];
  saveLabel?: string;
  saveDisabled?: boolean;
  saving?: boolean;
  onSave?: () => void;
  children: ReactNode;
}

const ResultSection = forwardRef<HTMLElement, ResultSectionProps>(function ResultSection(
  { title, counts, saveLabel = '저장', saveDisabled = false, saving = false, onSave, children },
  ref,
) {
  return (
    <Root ref={ref}>
      <Header>
        <Title>{title}</Title>
        {counts && <StatCounts items={counts} />}
      </Header>
      {children}
      {onSave && (
        <Actions>
          <Button disabled={saveDisabled} loading={saving} onClick={onSave}>
            {saveLabel}
          </Button>
        </Actions>
      )}
    </Root>
  );
});

export default ResultSection;

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 14px;
  scroll-margin-top: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Title = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Inset = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 14px;
`;

export const BorderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 8px;
  /* Figma 값 그대로 (대응하는 색상 토큰 없음) */
  border: 1px solid #d9d9d9;
`;

export const GrayBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
`;
