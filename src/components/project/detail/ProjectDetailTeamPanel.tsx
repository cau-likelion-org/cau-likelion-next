import { IProjectDetail, MemberStack } from '@@types/request';
import Chip from '@common/chip/Chip';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

const MEMBER_STACK_LABEL: Record<MemberStack, string> = {
  pm_design: '기획디자인',
  frontend: '프론트엔드',
  backend: '백엔드',
};

interface ProjectDetailTeamPanelProps {
  teamName: string;
  teamMember: IProjectDetail['team_member'];
}

const ProjectDetailTeamPanel = ({ teamName, teamMember }: ProjectDetailTeamPanelProps) => {
  return (
    <Panel>
      <Row>
        <RowLabel>팀명</RowLabel>
        <TeamName>{teamName}</TeamName>
      </Row>
      {(Object.keys(MEMBER_STACK_LABEL) as MemberStack[]).map((stack) => {
        const members = teamMember[stack];
        if (!members || members.length === 0) return null;
        return (
          <Row key={stack}>
            <RowLabel>{MEMBER_STACK_LABEL[stack]}</RowLabel>
            <ChipRow>
              {members.map((member) => (
                <Chip key={member} size="small">
                  {member}
                </Chip>
              ))}
            </ChipRow>
          </Row>
        );
      })}
    </Panel>
  );
};

export default ProjectDetailTeamPanel;

const Panel = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  gap: 22px;
  padding: 22px;
  border-radius: 16px;
  background-color: #f5f7f9;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const RowLabel = styled.span`
  flex-shrink: 0;
  color: #000;
  ${typographyCss(Typography.heading1.bold)}
`;

const TeamName = styled.span`
  color: #000;
  ${typographyCss(Typography.title3.bold)}
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
`;
