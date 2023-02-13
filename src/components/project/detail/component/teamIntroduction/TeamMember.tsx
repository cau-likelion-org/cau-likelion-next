import { IProjectDetail, MemberStack } from '@@types/request';
import styled from 'styled-components';

const TeamMember = ({ teamMember }: { teamMember: IProjectDetail['team_member'] }) => {
  return (
    <>
      {Object.entries(teamMember).map(([stack, members], index) => (
        <TeamMembers key={stack + index}>
          {stack} ·
          {members.map((member) => (
            <Member key={member}>{member}</Member>
          ))}
        </TeamMembers>
      ))}
    </>
  );
};

export default TeamMember;
const TeamMembers = styled.div`
  margin-bottom: 10px;
  display: flex;
`;
const Member = styled.div`
  margin-left: 5px;
`;
