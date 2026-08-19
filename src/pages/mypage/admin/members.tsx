import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { AllowedUserEmailItem, GenerationCreateRequestDto, UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import MyPageShell from '@mypage/component/MyPageShell';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import MemberSection, { ALL_FILTER, MemberEditUpdate } from '@mypage/admin/MemberSection';
import AllowedMemberSection from '@mypage/admin/AllowedMemberSection';
import PartManageSection from '@mypage/admin/PartManageSection';
import GenerationCreateModal from '@mypage/admin/component/GenerationCreateModal';
import {
  createGeneration,
  deleteMember,
  getAllowedEmails,
  getGenerations,
  getMembers,
  getUserProfile,
  putAllowedEmails,
  putUserProfile,
  setCurrentGeneration,
} from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { canManageMemberRoles } from '@utils/index';
import { ROLE_LABEL, TRACK_OPTIONS } from '@utils/constant';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MyPageAdminMembers = () => {
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
    if (userProfile && !canManageMemberRoles(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const isAuthorized = !!userProfile && canManageMemberRoles(userProfile.role);

  const { data: generations } = useQuery({
    queryKey: ['adminGenerations'],
    queryFn: getGenerations,
    enabled: isAuthorized,
  });

  const membersQueryKey = ['adminMembers'];
  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: membersQueryKey,
    queryFn: () => getMembers({}, tokenState),
    enabled: isAuthorized,
  });

  const [nameQuery, setNameQuery] = useState('');
  const [generationValue, setGenerationValue] = useState(ALL_FILTER);
  const [partValue, setPartValue] = useState(ALL_FILTER);
  const [roleValue, setRoleValue] = useState(ALL_FILTER);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');

  // 예비 회원 관리는 별도 기수 선택 없이 현재 활동 중인 기수를 기준으로 조회한다 (Figma)
  const activeGeneration =
    generations?.find((generation) => generation.status === 'IN_ACTIVITY') ?? generations?.[generations.length - 1];

  const allowedEmailsQueryKey = ['adminAllowedEmails', activeGeneration?.id];
  const {
    data: allowedEmails,
    isLoading: isAllowedEmailsLoading,
    isError: isAllowedEmailsError,
  } = useQuery({
    queryKey: allowedEmailsQueryKey,
    queryFn: () => getAllowedEmails(activeGeneration!.id, tokenState),
    enabled: isAuthorized && !!activeGeneration,
  });

  const showToast = (variant: 'positive' | 'negative', message: string) => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  const saveAllowedEmailsMutation = useMutation({
    mutationFn: (allowedItems: AllowedUserEmailItem[]) =>
      putAllowedEmails(activeGeneration!.id, allowedItems, tokenState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allowedEmailsQueryKey });
      showToast('positive', '변경사항이 저장되었습니다.');
    },
    onError: () => showToast('negative', '예비 회원 목록 저장에 실패했습니다. 다시 시도해 주세요.'),
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createGenerationMutation = useMutation({
    mutationFn: (form: GenerationCreateRequestDto) => createGeneration(form, tokenState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGenerations'] });
      setIsCreateModalOpen(false);
      showToast('positive', '기수/파트가 생성되었습니다.');
    },
    onError: () => showToast('negative', '기수/파트 생성에 실패했습니다. 다시 시도해 주세요.'),
  });

  const setCurrentGenerationMutation = useMutation({
    mutationFn: (id: number) => setCurrentGeneration(id, tokenState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGenerations'] });
      showToast('positive', '현재 활동 기수가 변경되었습니다.');
    },
    onError: () => showToast('negative', '현재 활동 기수 전환에 실패했습니다. 다시 시도해 주세요.'),
  });

  const generationOptions = [...new Set((generations ?? []).map((generation) => generation.number))]
    .sort((a, b) => b - a)
    .map(String);
  const partOptions = TRACK_OPTIONS;
  const roleOptions = (['BABY_LION', 'ADULT_LION', 'STAFF', 'PRESIDENT', 'ADMIN'] as const).map(
    (role) => ROLE_LABEL[role],
  );

  const filteredMembers = (members ?? []).filter((member) => {
    if (nameQuery && !member.name.includes(nameQuery)) return false;
    if (generationValue !== ALL_FILTER && String(member.generationNumber) !== generationValue) return false;
    if (partValue !== ALL_FILTER && member.partName !== partValue) return false;
    if (roleValue !== ALL_FILTER && ROLE_LABEL[member.role] !== roleValue) return false;
    return true;
  });

  const saveMutation = useMutation({
    mutationFn: ({ updates, deleteIds }: { updates: MemberEditUpdate[]; deleteIds: number[] }) =>
      Promise.all([
        ...updates.map(({ id, form }) => putUserProfile({ id, form, tokenState })),
        ...deleteIds.map((id) => deleteMember(id, tokenState)),
      ]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membersQueryKey });
      showToast('positive', '변경사항이 저장되었습니다.');
    },
    onError: () => showToast('negative', '회원 정보 저장에 실패했습니다. 다시 시도해 주세요.'),
  });

  const handleSave = (updates: MemberEditUpdate[], deleteIds: number[]) => {
    if (updates.length === 0 && deleteIds.length === 0) return;
    setToastMessage('');
    return saveMutation.mutateAsync({ updates, deleteIds });
  };

  return (
    <>
      <ToastWrapper>
        <Toast variant={toastVariant} text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {!isAuthorized ? (
        <PageLoadingGate isError={isUserProfileError} />
      ) : (
        <>
          <PageTitle>전체 회원/파트 관리</PageTitle>
          <MemberSection
            members={filteredMembers}
            generations={generations ?? []}
            isLoading={isMembersLoading}
            isError={isMembersError}
            nameQuery={nameQuery}
            onNameQueryChange={setNameQuery}
            generationFilter={{ value: generationValue, options: generationOptions, onChange: setGenerationValue }}
            partFilter={{ value: partValue, options: partOptions, onChange: setPartValue }}
            roleFilter={{ value: roleValue, options: roleOptions, onChange: setRoleValue }}
            onSave={handleSave}
            isSaving={saveMutation.isPending}
          />
          <AllowedMemberSection
            items={allowedEmails ?? []}
            isLoading={isAllowedEmailsLoading}
            isError={isAllowedEmailsError}
            onSave={(allowedItems) => saveAllowedEmailsMutation.mutateAsync(allowedItems)}
            isSaving={saveAllowedEmailsMutation.isPending}
          />
          <PartManageSection
            generations={generations ?? []}
            onSelectCurrent={(id) => setCurrentGenerationMutation.mutate(id)}
            isUpdatingCurrent={setCurrentGenerationMutation.isPending}
            onCreate={() => setIsCreateModalOpen(true)}
          />
        </>
      )}
      {isCreateModalOpen && (
        <GenerationCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(form) => createGenerationMutation.mutateAsync(form)}
          isSubmitting={createGenerationMutation.isPending}
        />
      )}
    </>
  );
};

MyPageAdminMembers.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="admin-members">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageAdminMembers;

const PageTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
