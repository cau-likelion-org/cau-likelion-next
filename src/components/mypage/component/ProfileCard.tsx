import { UserProfile } from '@@types/request';
import ContentBadge from '@common/badge/ContentBadge';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { ROLE_LABEL } from '@utils/constant';
import styled from 'styled-components';
import { Typography, typographyCss } from '@utils/constant/typography';

const ProfileCard = ({ user }: { user: UserProfile }) => {
  return (
    <Wrapper>
      <Name>{user.name}</Name>
      <BadgeRow>
        <ContentBadge color="accent" size="medium" text={user.partName} />
        <ContentBadge color="accent" size="medium" text={ROLE_LABEL[user.role]} />
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

  @media (max-width: 900px) {
    width: 100%;
  }
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
