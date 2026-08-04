import { UserProfile } from '@@types/request';
import ContentBadge from '@common/badge/ContentBadge';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { TRACK_NAME } from '@utils/constant';
import { checkGeneration } from '@utils/index';
import styled from 'styled-components';
import { Typography, typographyCss } from '@utils/constant/typography';

const ProfileCard = ({ user }: { user: UserProfile }) => {
  const role = checkGeneration(user.generation) ? '아기사자' : '어른사자';

  return (
    <Wrapper>
      <Name>{user.name}</Name>
      <BadgeRow>
        <ContentBadge color="accent" size="medium" text={`${user.generation}기`} />
        <ContentBadge color="accent" size="medium" text={TRACK_NAME[user.track]} />
        <ContentBadge color="accent" size="medium" text={role} />
      </BadgeRow>
      {user.email && <Email>{user.email}</Email>}
    </Wrapper>
  );
};

export default ProfileCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  gap: 14px;
  width: 340px;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const Name = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Email = styled.p`
  margin: 0;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Normal.medium)}
`;
