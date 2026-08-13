import { UserProfile } from '@@types/request';
import { useQuery } from '@tanstack/react-query';
import { AccentTint, Label, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUserProfile } from 'src/apis/account';
import { PROJECT_CATEGORY_LABEL, ProjectResponseDto, getProjectDetail, getSortedProjectImages } from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import styled from 'styled-components';
import ProjectDetailCarousel from './ProjectDetailCarousel';
import ProjectDetailMetaPanel from './ProjectDetailMetaPanel';
import ProjectDetailTeamPanel from './ProjectDetailTeamPanel';

interface ProjectDetailModalProps {
  projectId: string;
  staticData?: ProjectResponseDto | null;
  onClose: () => void;
}

const ProjectDetailModal = ({ projectId, staticData, onClose }: ProjectDetailModalProps) => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const { data } = useQuery<ProjectResponseDto>({
    queryKey: ['projectDetail', projectId],
    queryFn: () => getProjectDetail(projectId),
    initialData: staticData && String(staticData.id) === projectId ? staticData : undefined,
  });

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const project = data ?? staticData ?? undefined;

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        {!project ? (
          <LoadingWrapper>불러오는 중...</LoadingWrapper>
        ) : (
          <>
            <Contents>
              <ProjectDetailCarousel images={getSortedProjectImages(project.images)} />
              <TextBlock>
                <Title>{project.title}</Title>
                {project.tagline && <Description>{project.tagline}</Description>}
                <BadgeRow>
                  <Badge>{project.generationNumber}기</Badge>
                  <Badge>{PROJECT_CATEGORY_LABEL[project.category]}</Badge>
                </BadgeRow>
                {project.summary && <Description>{project.summary.replace(/\\n/g, '\n')}</Description>}
              </TextBlock>
              <PanelRow>
                <ProjectDetailTeamPanel teamName={project.teamName} members={project.members} />
                <ProjectDetailMetaPanel
                  startDate={project.startDate}
                  endDate={project.endDate}
                  stack={project.stack}
                  links={project.links}
                />
              </PanelRow>
            </Contents>
            <Actions>
              {userProfile && isAdminRole(userProfile.role) && (
                <EditButton type="button" onClick={() => router.push(`/project/edit/${projectId}`)}>
                  수정
                </EditButton>
              )}
              <CloseButton type="button" onClick={onClose}>
                닫기
              </CloseButton>
            </Actions>
          </>
        )}
      </ModalCard>
    </Backdrop>
  );
};

export default ProjectDetailModal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: ${Material.dimmer};
`;

const ModalCard = styled.div`
  width: 1040px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  border-radius: 16px;
  background-color: #fff;
`;

const LoadingWrapper = styled.div`
  padding: 80px 28px;
  text-align: center;
  color: ${Label.alternative};
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 28px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const Description = styled.p`
  margin: 0;
  color: ${Label.normal};
  white-space: pre-line;
  ${typographyCss(Typography.heading2.medium)}
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 16px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 8px;
  background-color: ${AccentTint.background};
  color: ${Orange.o500};
  ${typographyCss(Typography.label2.regular)}
  font-weight: 500;
`;

const PanelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 22px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  padding: 4px 0;
  cursor: pointer;
  color: ${Orange.o500};
  ${typographyCss(Typography.body1Normal.bold)}
`;

const EditButton = styled.button`
  border: none;
  background: none;
  padding: 4px 0;
  cursor: pointer;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.bold)}
`;
