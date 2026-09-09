import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import RecruitmentSubscriberSection, { ALL_PART_FILTER } from '@mypage/admin/recruitment/RecruitmentSubscriberSection';
import RecruitmentTextSection from '@mypage/admin/recruitment/RecruitmentTextSection';
import RecruitmentComposeModal, { RecruitmentComposeForm } from '@mypage/admin/recruitment/RecruitmentComposeModal';
import RecruitmentTextDetailModal from '@mypage/admin/recruitment/RecruitmentTextDetailModal';
import RecruitmentResendModal from '@mypage/admin/recruitment/RecruitmentResendModal';
import { getUserProfile } from 'src/apis/account';
import {
  createRecruitmentText,
  getSubscriberInterestParts,
  getSubscribers,
  getRecruitmentTexts,
  resendRecruitmentText,
  updateRecruitmentText,
  cancelRecruitmentText,
  RecruitmentTextResponse,
} from 'src/apis/recruitment';
import useTokenStore from 'src/store/useTokenStore';
import { COMMON_PART_NAME } from '@utils/constant';
import { isAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MyPageAdminRecruitment = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const isAuthorized = !!userProfile && isAdminRole(userProfile.role);

  const [interestPartFilter, setInterestPartFilter] = useState(ALL_PART_FILTER);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: interestPartOptions } = useQuery({
    queryKey: ['recruitmentInterestParts'],
    queryFn: () => getSubscriberInterestParts(tokenState),
    // 신청 폼의 "공통" 노출 버그로 과거에 "공통"을 관심 파트로 신청한 기록이 남아있을 수 있어 방어적으로 제외
    select: (parts) => parts.filter((part) => part !== COMMON_PART_NAME),
    enabled: isAuthorized,
  });

  const {
    data: subscribers,
    isLoading: isSubscribersLoading,
    isError: isSubscribersError,
  } = useQuery({
    queryKey: ['recruitmentSubscribers', interestPartFilter],
    queryFn: () => getSubscribers(interestPartFilter === ALL_PART_FILTER ? undefined : interestPartFilter, tokenState),
    enabled: isAuthorized,
  });

  const {
    data: texts,
    isLoading: isTextsLoading,
    isError: isTextsError,
  } = useQuery({
    queryKey: ['recruitmentTexts'],
    queryFn: () => getRecruitmentTexts(tokenState),
    enabled: isAuthorized,
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // 관심 파트 드롭다운으로 좁혀진 현재 목록(subscribers) 전체를 수신자로 선택
  const handleSelectAll = () => {
    setSelectedIds(new Set((subscribers ?? []).map((subscriber) => subscriber.id)));
  };

  const [selectedText, setSelectedText] = useState<RecruitmentTextResponse | null>(null);
  const [isResendReviewOpen, setIsResendReviewOpen] = useState(false);
  const [editingText, setEditingText] = useState<RecruitmentTextResponse | null>(null);
  const [editRecipientIds, setEditRecipientIds] = useState<Set<number>>(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');

  const composeMutation = useMutation({
    mutationFn: (form: RecruitmentComposeForm) =>
      createRecruitmentText({ ...form, subscriberIds: Array.from(selectedIds) }, tokenState),
    onSuccess: (data, form) => {
      queryClient.invalidateQueries({ queryKey: ['recruitmentTexts'] });
      setSelectedIds(new Set());
      setIsComposeOpen(false);
      if (form.scheduledSendAt) {
        setToastVariant('positive');
        setToastMessage('메일이 예약 발송되었습니다.');
      } else {
        setSelectedText(data);
      }
    },
    onError: () => {
      setToastVariant('negative');
      setToastMessage('메일 예약 발송에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (id: number) => resendRecruitmentText(id, tokenState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitmentTexts'] });
      setIsResendReviewOpen(false);
      setSelectedText(null);
      setToastVariant('positive');
      setToastMessage('발송 실패건을 재발송했습니다.');
    },
    onError: () => {
      setToastVariant('negative');
      setToastMessage('재발송에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (form: RecruitmentComposeForm) =>
      updateRecruitmentText(editingText!.id, { ...form, subscriberIds: Array.from(editRecipientIds) }, tokenState),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recruitmentTexts'] });
      setEditingText(null);
      setSelectedText(data);
      setToastVariant('positive');
      setToastMessage('메일을 수정했습니다.');
    },
    onError: () => {
      setToastVariant('negative');
      setToastMessage('메일 수정에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const cancelSendMutation = useMutation({
    mutationFn: (id: number) => cancelRecruitmentText(id, tokenState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitmentTexts'] });
      setEditingText(null);
      setSelectedText(null);
      setToastVariant('positive');
      setToastMessage('발송을 취소했습니다.');
    },
    onError: () => {
      setToastVariant('negative');
      setToastMessage('발송 취소에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  return (
    <>
      <ToastWrapper>
        <Toast variant={toastVariant} text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {!isAuthorized ? (
        <PageLoadingGate isError={isUserProfileError} />
      ) : (
        <>
          <TitleRow>
            <PageTitle>리크루팅 사전 알림 발송</PageTitle>
            <Button size="small" color="assistive" onClick={() => setIsComposeOpen(true)}>
              메일 작성
            </Button>
          </TitleRow>
          <RecruitmentSubscriberSection
            subscribers={subscribers ?? []}
            isLoading={isSubscribersLoading}
            isError={isSubscribersError}
            interestPartOptions={interestPartOptions ?? []}
            interestPartFilter={interestPartFilter}
            onInterestPartFilterChange={setInterestPartFilter}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={handleSelectAll}
          />
          <RecruitmentTextSection
            texts={texts ?? []}
            isLoading={isTextsLoading}
            isError={isTextsError}
            onSelect={setSelectedText}
          />
        </>
      )}
      {isComposeOpen && (
        <RecruitmentComposeModal
          recipients={(subscribers ?? [])
            .filter((subscriber) => selectedIds.has(subscriber.id))
            .map((subscriber) => ({ id: subscriber.id, email: subscriber.email }))}
          onRemoveRecipient={toggleSelect}
          onClose={() => {
            setIsComposeOpen(false);
            setSelectedIds(new Set());
          }}
          onSubmit={(form) => composeMutation.mutateAsync(form)}
          isSubmitting={composeMutation.isPending}
        />
      )}
      {selectedText && !editingText && (
        <RecruitmentTextDetailModal
          text={selectedText}
          onClose={() => setSelectedText(null)}
          onEdit={() => {
            const matchedIds = (subscribers ?? [])
              .filter((subscriber) => selectedText.recipients.some((recipient) => recipient.email === subscriber.email))
              .map((subscriber) => subscriber.id);
            setEditRecipientIds(new Set(matchedIds));
            setEditingText(selectedText);
          }}
          onResend={() => setIsResendReviewOpen(true)}
          isResending={resendMutation.isPending}
        />
      )}
      {editingText && (
        <RecruitmentComposeModal
          mode="edit"
          submitLabel="저장하기"
          initialValues={{
            title: editingText.title,
            content: editingText.content,
            scheduledSendAt: editingText.scheduledSendAt,
          }}
          recipients={(subscribers ?? [])
            .filter((subscriber) => editRecipientIds.has(subscriber.id))
            .map((subscriber) => ({ id: subscriber.id, email: subscriber.email }))}
          onRemoveRecipient={(id) =>
            setEditRecipientIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            })
          }
          onClose={() => setEditingText(null)}
          onSubmit={(form) => updateMutation.mutateAsync(form)}
          isSubmitting={updateMutation.isPending}
          cancelSend={
            editingText.status === 'SCHEDULED'
              ? {
                  onConfirm: () => cancelSendMutation.mutate(editingText.id),
                  isSubmitting: cancelSendMutation.isPending,
                }
              : undefined
          }
        />
      )}
      {isResendReviewOpen && selectedText && (
        <RecruitmentResendModal
          title={selectedText.title}
          content={selectedText.content}
          recipients={selectedText.recipients
            .filter((recipient) => recipient.status === 'FAILED')
            .map((recipient) => recipient.email)}
          onClose={() => setIsResendReviewOpen(false)}
          onConfirm={() => resendMutation.mutate(selectedText.id)}
          isSubmitting={resendMutation.isPending}
        />
      )}
    </>
  );
};

MyPageAdminRecruitment.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="admin-recruit">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageAdminRecruitment;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PageTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;
