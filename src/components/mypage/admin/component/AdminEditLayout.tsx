import { ReactNode, Ref } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import LoadingArea from '@common/loading/LoadingArea';
import EmptyState from '@common/emptyState/EmptyState';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import EditButton from '@mypage/admin/component/EditButton';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

interface AdminEditLayoutProps {
  title: string;
  isAuthorized: boolean;
  isUserProfileError: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  isDataError: boolean;
  isDataLoaded: boolean;
  loadingIndicator: ReactNode;
  contentRef: Ref<HTMLDivElement>;
  children: ReactNode;
}

const AdminEditLayout = ({
  title,
  isAuthorized,
  isUserProfileError,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  isDataError,
  isDataLoaded,
  loadingIndicator,
  contentRef,
  children,
}: AdminEditLayoutProps) => {
  if (!isAuthorized) return <PageLoadingGate isError={isUserProfileError} />;

  return (
    <>
      <TitleRow>
        <PageTitle>{title}</PageTitle>
        <ButtonRow>
          {isEditing ? (
            <>
              <Button variant="outlined" color="assistive" size="small" onClick={onCancel}>
                취소
              </Button>
              <Button size="small" onClick={onSave} loading={isSaving}>
                저장
              </Button>
            </>
          ) : (
            <EditButton onClick={onEdit} />
          )}
        </ButtonRow>
      </TitleRow>
      {isDataError ? (
        <EmptyState variant="error" />
      ) : !isDataLoaded ? (
        <LoadingArea minHeight={300}>{loadingIndicator}</LoadingArea>
      ) : (
        <ContentWrapper ref={contentRef}>{children}</ContentWrapper>
      )}
    </>
  );
};

export default AdminEditLayout;

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

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 40px;

  ${media.xs} {
    gap: 32px;
  }
`;
