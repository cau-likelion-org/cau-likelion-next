import { IProjectDetail } from '@@types/request';
import { useQuery } from '@tanstack/react-query';
import { AccentTint, Label, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { useEffect } from 'react';
import { getProjectDetail } from 'src/apis/project';
import styled from 'styled-components';
import ProjectDetailCarousel from './ProjectDetailCarousel';
import ProjectDetailMetaPanel from './ProjectDetailMetaPanel';
import ProjectDetailTeamPanel from './ProjectDetailTeamPanel';

interface ProjectDetailModalProps {
  projectId: string;
  staticData?: IProjectDetail | null;
  onClose: () => void;
}

const ProjectDetailModal = ({ projectId, staticData, onClose }: ProjectDetailModalProps) => {
  const { data } = useQuery<IProjectDetail>({
    queryKey: ['projectDetail', projectId],
    queryFn: () => getProjectDetail(projectId),
    initialData: staticData && String(staticData.id) === projectId ? staticData : undefined,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
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
              <ProjectDetailCarousel images={project.image} />
              <TextBlock>
                <Title>{project.title}</Title>
                {project.subtitle && <Description>{project.subtitle}</Description>}
                <BadgeRow>
                  <Badge>{project.generation}기</Badge>
                  <Badge>{project.category}</Badge>
                </BadgeRow>
                {project.description && <Description>{project.description.replace(/\\n/g, '\n')}</Description>}
              </TextBlock>
              <PanelRow>
                <ProjectDetailTeamPanel teamName={project.team_name} teamMember={project.team_member} />
                <ProjectDetailMetaPanel date={project.date} devStack={project.dev_stack} link={project.link} />
              </PanelRow>
            </Contents>
            <Actions>
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
  z-index: 1000;
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
`;

const PanelRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 22px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
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
