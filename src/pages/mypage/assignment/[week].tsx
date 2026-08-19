import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import AssignmentSubmitCard, {
  AssignmentSubmitItem,
  AssignmentSubmitValue,
} from '@mypage/component/AssignmentSubmitCard';
import { IcChevronLeft } from '@assets/svg';
import {
  MyAssignmentHistoryWeekGroup,
  canSubmitAssignment,
  getMyAssignmentHistory,
  submitAssignment,
  uploadAssignmentFile,
} from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss } from '@utils/constant/breakpoint';

const formatDueDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};

// 파일 업로드·제출 실패 사유(예: 허용되지 않는 파일 형식)는 서버 메시지를 그대로 보여준다
const getServerMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  if (typeof data === 'string') return data.trim() || undefined;
  const message = (data as { message?: unknown } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
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
  // 제출 실패 사유는 과제별로 해당 카드의 첨부 영역 아래에 표시한다
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: weekGroups } = useQuery<MyAssignmentHistoryWeekGroup[]>({
    queryKey: ['myAssignmentHistory', week],
    queryFn: () => getMyAssignmentHistory(tokenState, week),
    enabled: !!tokenState.access && Number.isFinite(week),
  });
  const weekGroup = weekGroups?.find((group) => group.week === week);

  // 목록에서 마감일이 같은 과제끼리 묶어 넘어오므로 그 카드에 속한 과제만 다룬다 (ids가 없으면 주차 전체)
  const idsParam = typeof router.query.ids === 'string' ? router.query.ids.split(',') : null;
  const cardAssignments = (weekGroup?.assignments ?? []).filter(
    (assignment) => !idsParam || idsParam.includes(String(assignment.assignmentId)),
  );

  const submittableAssignments = cardAssignments.filter((assignment) =>
    canSubmitAssignment(assignment.submissions[0]?.displayStatus ?? 'BEFORE_SUBMISSION', assignment.endDate),
  );

  const dueDates = submittableAssignments.map((assignment) => formatDueDate(assignment.endDate));
  const sharedDueDate = dueDates.length > 0 && dueDates.every((date) => date === dueDates[0]) ? dueDates[0] : null;

  const items: AssignmentSubmitItem[] = submittableAssignments.map((assignment, index) => ({
    id: String(assignment.assignmentId),
    name: assignment.title,
    description: assignment.detail,
    format: assignment.type === 'FILE' ? 'file' : 'link',
    // 개별 마감일 변경으로 과제마다 마감일이 다르면 주차 마감일 대신 과제별로 보여준다
    dueDate: sharedDueDate ? undefined : dueDates[index],
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
    setSubmitErrors({});

    // 되돌리는 API가 없어 일부만 성공할 수 있다. 실패한 과제만 사용자에게 알린다
    const failed: Record<string, string> = {};
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
      } catch (error) {
        failed[item.id] = getServerMessage(error) ?? '제출에 실패했습니다. 다시 시도해 주세요.';
      }
    }

    setIsSubmitting(false);
    queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
    queryClient.invalidateQueries({ queryKey: ['myAssignmentHistory'] });

    if (Object.keys(failed).length > 0) {
      setSubmitErrors(failed);
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
          {sharedDueDate && (
            <DueDate>
              마감일 <span>ㅣ</span> {sharedDueDate}
            </DueDate>
          )}
        </SessionRow>
        {items.map((item) => (
          <AssignmentSubmitCard
            key={item.id}
            item={item}
            errorMessage={submitErrors[item.id]}
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
  ${containerCss}
  padding-top: 40px;
  padding-bottom: 80px;
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
