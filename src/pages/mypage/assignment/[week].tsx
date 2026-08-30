import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import BackHeader from '@common/header/BackHeader';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import { WIDE_TOAST_WIDTH } from '@common/toast/toastLayout';
import AssignmentSubmitCard, {
  AssignmentSubmitItem,
  AssignmentSubmitValue,
} from '@mypage/component/assignment/AssignmentSubmitCard';
import {
  MyAssignmentHistoryWeekGroup,
  canSubmitAssignment,
  getMyAssignmentHistory,
  resolveAssignmentActionLabel,
  submitAssignment,
  uploadAssignmentFile,
} from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { getServerMessage } from '@utils/index';
import { Black, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss, media } from '@utils/constant/breakpoint';

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

  const isViewMode = router.query.mode === 'view';

  const [validityMap, setValidityMap] = useState<Record<string, boolean>>({});
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  // 입력값은 렌더에 쓰지 않고 제출 시점에만 읽으므로 ref에 모은다 (매 타이핑마다 리렌더 방지)
  const valueMapRef = useRef<Record<string, AssignmentSubmitValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 제출 실패 사유는 과제별로 해당 카드의 첨부 영역 아래에 표시한다
  const [submitErrors, setSubmitErrors] = useState<Record<string, string>>({});
  const [retryIds, setRetryIds] = useState<string[] | null>(null);
  const [toastMessage, setToastMessage] = useState('');

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

  const entries = cardAssignments
    .filter((assignment) => !retryIds || retryIds.includes(String(assignment.assignmentId)))
    .map((assignment) => {
      const latestSubmission = assignment.submissions[0];
      return {
        item: {
          id: String(assignment.assignmentId),
          name: assignment.title,
          description: assignment.detail,
          format: assignment.type === 'FILE' ? 'file' : 'link',
        } as AssignmentSubmitItem,
        submission: latestSubmission,
        canSubmit: canSubmitAssignment(latestSubmission?.displayStatus ?? 'BEFORE_SUBMISSION', assignment.endDate),
      };
    });

  const submittableEntries = entries.filter((entry) => entry.canSubmit);

  const dueDate = cardAssignments[0]?.endDate ?? null;

  const handleClose = () => router.push('/mypage/assignment');

  const handleValidityChange = useCallback((itemId: string, isValid: boolean) => {
    setValidityMap((prev) => (prev[itemId] === isValid ? prev : { ...prev, [itemId]: isValid }));
  }, []);

  const handleDirtyChange = useCallback((itemId: string, isDirty: boolean) => {
    setDirtyMap((prev) => (prev[itemId] === isDirty ? prev : { ...prev, [itemId]: isDirty }));
  }, []);

  const handleValueChange = useCallback((itemId: string, value: AssignmentSubmitValue) => {
    valueMapRef.current[itemId] = value;
  }, []);

  const actionLabel = resolveAssignmentActionLabel(
    submittableEntries.map((entry) => ({
      status: entry.submission?.displayStatus ?? 'BEFORE_SUBMISSION',
      submitted: !!entry.submission,
    })),
  );

  const isSubmitEnabled =
    submittableEntries.length > 0 &&
    submittableEntries.every((entry) => validityMap[entry.item.id]) &&
    submittableEntries.some((entry) => dirtyMap[entry.item.id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitErrors({});

    const failed: Record<string, string> = {};
    for (const { item } of submittableEntries) {
      const value = valueMapRef.current[item.id];
      if (!value) continue;
      try {
        const files =
          item.format === 'file'
            ? [
                ...value.keptFiles,
                ...(await Promise.all(
                  value.files.map(async (file) => ({
                    fileUrl: await uploadAssignmentFile(tokenState, file),
                    originalFilename: file.name,
                  })),
                )),
              ]
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

    const failedIds = Object.keys(failed);
    if (failedIds.length > 0) {
      setSubmitErrors(failed);
      setRetryIds(failedIds);
      return;
    }
    sessionStorage.setItem('assignmentSubmitted', actionLabel === '수정하기' ? 'edited' : '1');
    handleClose();
  };

  return (
    <Wrapper>
      <BackHeader label="과제 목록으로 돌아가기" onClick={handleClose} />
      <SubmitPageContent>
        <Content>
          <SessionRow>
            <SessionTitle>{week}주차 세션 과제</SessionTitle>
            {dueDate && (
              <DueDate>
                마감일 <span>ㅣ</span> {formatDueDate(dueDate)}
              </DueDate>
            )}
          </SessionRow>
          {entries.map(({ item, submission, canSubmit }) => (
            <AssignmentSubmitCard
              key={item.id}
              item={item}
              submission={submission}
              canSubmit={canSubmit}
              readOnly={isViewMode}
              errorMessage={submitErrors[item.id]}
              onValidityChange={handleValidityChange}
              onDirtyChange={handleDirtyChange}
              onValueChange={handleValueChange}
              onFileRejected={setToastMessage}
            />
          ))}
        </Content>

        {/* 제출 가능한 과제가 하나도 없으면(승인 대기·제출 완료) 제출 내역만 보여준다 */}
        {!isViewMode && submittableEntries.length > 0 && (
          <SubmitButtonWrapper>
            <Button size="large" disabled={!isSubmitEnabled || isSubmitting} onClick={handleSubmit}>
              {actionLabel ?? '제출하기'}
            </Button>
          </SubmitButtonWrapper>
        )}
      </SubmitPageContent>

      <ToastWrapper>
        <Toast
          variant="negative"
          width={WIDE_TOAST_WIDTH}
          text={toastMessage}
          show={!!toastMessage}
          onHidden={() => setToastMessage('')}
        />
      </ToastWrapper>
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
  ${containerCss}
  padding-bottom: 80px;
`;

const SubmitPageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  width: 100%;
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

  ${media.mobileDevice} {
    display: none;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
