import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import AssignmentSubmitCard, {
  AssignmentSubmitItem,
  AssignmentSubmitValue,
} from '@mypage/component/AssignmentSubmitCard';
import { IcChevronLeft } from '@assets/svg';
import {
  MyAssignmentHistoryWeekGroup,
  getMyAssignmentHistory,
  submitAssignment,
  uploadAssignmentFile,
} from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const formatDueDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};

const AssignmentSubmit = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();
  const week = Number(router.query.week);

  const [validityMap, setValidityMap] = useState<Record<string, boolean>>({});
  // 입력값은 렌더에 쓰지 않고 제출 시점에만 읽으므로 ref에 모은다 (매 타이핑마다 리렌더 방지)
  const valueMapRef = useRef<Record<string, AssignmentSubmitValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: weekGroups } = useQuery<MyAssignmentHistoryWeekGroup[]>({
    queryKey: ['myAssignmentHistory', week],
    queryFn: () => getMyAssignmentHistory(tokenState, week),
    enabled: !!tokenState.access && Number.isFinite(week),
  });
  const weekGroup = weekGroups?.find((group) => group.week === week);

  const items: AssignmentSubmitItem[] = (weekGroup?.assignments ?? []).map((assignment) => ({
    id: String(assignment.assignmentId),
    name: assignment.title,
    description: assignment.detail,
    format: assignment.type === 'FILE' ? 'file' : 'link',
  }));

  const handleClose = () => router.push('/mypage/assignment');

  const handleValidityChange = useCallback((itemId: string, isValid: boolean) => {
    setValidityMap((prev) => (prev[itemId] === isValid ? prev : { ...prev, [itemId]: isValid }));
  }, []);

  const handleValueChange = useCallback((itemId: string, value: AssignmentSubmitValue) => {
    valueMapRef.current[itemId] = value;
  }, []);

  const canSubmit = items.length > 0 && items.every((item) => validityMap[item.id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    // 되돌리는 API가 없어 일부만 성공할 수 있다. 실패한 과제만 사용자에게 알린다
    const failed: string[] = [];
    for (const item of items) {
      const value = valueMapRef.current[item.id];
      if (!value) continue;
      try {
        const files =
          item.format === 'file'
            ? await Promise.all(
                value.files.map(async (file) => ({
                  fileUrl: await uploadAssignmentFile(tokenState, file),
                  originalFilename: file.name,
                })),
              )
            : undefined;
        await submitAssignment(tokenState, Number(item.id), {
          content: value.description.trim() || undefined,
          url: item.format === 'link' ? value.link.trim() : undefined,
          files,
        });
      } catch {
        failed.push(item.name);
      }
    }

    setIsSubmitting(false);
    queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
    queryClient.invalidateQueries({ queryKey: ['myAssignmentHistory'] });

    if (failed.length > 0) {
      setErrorMessage(`${failed.join(', ')} 제출에 실패했습니다. 다시 시도해 주세요.`);
      return;
    }
    handleClose();
  };

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
          <SessionTitle>{week}주차 세션 과제</SessionTitle>
          {weekGroup && weekGroup.assignments.length > 0 && (
            <DueDate>
              마감일 <span>ㅣ</span> {formatDueDate(weekGroup.assignments[0].endDate)}
            </DueDate>
          )}
        </SessionRow>
        {items.map((item) => (
          <AssignmentSubmitCard
            key={item.id}
            item={item}
            onValidityChange={handleValidityChange}
            onValueChange={handleValueChange}
          />
        ))}
      </Content>

      <SubmitButtonWrapper>
        <Button size="large" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>
          제출하기
        </Button>
      </SubmitButtonWrapper>

      <ToastWrapper>
        <Toast variant="negative" text={errorMessage} show={!!errorMessage} onHidden={() => setErrorMessage('')} />
      </ToastWrapper>
    </Wrapper>
  );
};

AssignmentSubmit.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default AssignmentSubmit;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

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
