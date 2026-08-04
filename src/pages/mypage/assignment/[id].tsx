import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import AssignmentSubmitCard, { AssignmentSubmitItem } from '@mypage/component/AssignmentSubmitCard';
import { IcChevronLeft } from '@assets/svg';
import useTokenStore from 'src/store/useTokenStore';
import { Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 백엔드 API 준비 전까지 사용하는 목 데이터
const MOCK_WEEK = 18;
const MOCK_DUE_DATE = '2026/09/35';
const MOCK_ITEMS: AssignmentSubmitItem[] = [
  {
    id: '1',
    name: '연구 프로젝트 1',
    description: '노션에 세션 회고를 작성하고, 작성 완료한 내용을 캡쳐해서 이미지를 첨부해주세요',
    format: 'file',
  },
  {
    id: '2',
    name: '연구 프로젝트 2',
    description: '오늘 배운 내용에 대한 과제 코드를 github에 작성하고, 작업한 github 링크를 첨부해주세요',
    format: 'link',
  },
];

const AssignmentSubmit = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const [validityMap, setValidityMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const handleClose = () => router.push('/mypage/assignment');

  const handleValidityChange = useCallback((itemId: string, isValid: boolean) => {
    setValidityMap((prev) => (prev[itemId] === isValid ? prev : { ...prev, [itemId]: isValid }));
  }, []);

  const canSubmit = MOCK_ITEMS.every((item) => validityMap[item.id]);

  return (
    <Wrapper>
      <TopRow>
        <Button
          variant="outlined"
          color="assistive"
          leadingIcon={<IcChevronLeft width={18} height={18} />}
          onClick={handleClose}
        >
          닫기
        </Button>
        <PageTitle>과제 제출하기</PageTitle>
      </TopRow>

      <Content>
        <SessionRow>
          <SessionTitle>{MOCK_WEEK}주차 세션 과제</SessionTitle>
          <DueDate>
            마감일 <span>ㅣ</span> {MOCK_DUE_DATE}
          </DueDate>
        </SessionRow>
        {MOCK_ITEMS.map((item) => (
          <AssignmentSubmitCard key={item.id} item={item} onValidityChange={handleValidityChange} />
        ))}
      </Content>

      <SubmitButtonWrapper>
        <Button size="large" disabled={!canSubmit} onClick={handleClose}>
          제출하기
        </Button>
      </SubmitButtonWrapper>
    </Wrapper>
  );
};

AssignmentSubmit.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default AssignmentSubmit;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.display2.bold)}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
  width: 100%;
`;

const SessionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SessionTitle = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.display3.bold)}
`;

const DueDate = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const SubmitButtonWrapper = styled.div`
  width: 360px;

  button {
    width: 100%;
  }
`;
