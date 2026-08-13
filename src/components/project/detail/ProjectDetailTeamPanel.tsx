import Chip from '@common/chip/Chip';
import { ProjectMemberDto } from 'src/apis/project';
import { Typography, typographyCss } from '@utils/constant/typography';
import styled from 'styled-components';

interface ProjectDetailTeamPanelProps {
  teamName: string;
  members: ProjectMemberDto[];
}

const ProjectDetailTeamPanel = ({ teamName, members }: ProjectDetailTeamPanelProps) => {
  const membersByPart = members.reduce<Array<[string, string[]]>>((acc, member) => {
    const group = acc.find(([part]) => part === member.part);
    if (group) group[1].push(member.name);
    else acc.push([member.part, [member.name]]);
    return acc;
  }, []);

  return (
    <Panel>
      <Row>
        <RowLabel>팀명</RowLabel>
        <TeamName>{teamName}</TeamName>
      </Row>
      {membersByPart.map(([part, names]) => (
        <Row key={part}>
          <RowLabel>{part}</RowLabel>
          <ChipRow>
            {names.map((name) => (
              <Chip key={name} size="small">
                {name}
              </Chip>
            ))}
          </ChipRow>
        </Row>
      ))}
    </Panel>
  );
};

export default ProjectDetailTeamPanel;

const Panel = styled.div`
  display: flex;
  flex: 1 0 0;
  align-self: stretch;
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
