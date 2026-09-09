import { UserProfile } from '@@types/request';
import ContentBadge from '@common/badge/ContentBadge';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { ROLE_LABEL } from '@utils/constant';
import styled from 'styled-components';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

const ProfileCard = ({ user }: { user: UserProfile }) => {
  return (
    <Wrapper>
      <Name>{user.name}</Name>
      <BadgeRow>
        {user.generationNumber != null && <Badge color="accent" size="medium" text={`${user.generationNumber}기`} />}
        {/* 관리자처럼 소속 파트가 없는 계정은 빈 뱃지가 남지 않도록 생략 */}
        {user.partName && <Badge color="accent" size="medium" text={user.partName} />}
        <Badge color="accent" size="medium" text={ROLE_LABEL[user.role]} />
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
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};

  ${media.lg} {
    width: 340px;
  }

  ${media.xl} {
    flex-grow: 1;
  }
`;

// Figma: 프로필 뱃지는 Orange/O75 솔리드 배경 (과제표의 8% 틴트 뱃지와 다름)
const Badge = styled(ContentBadge)`
  background-color: ${Orange.o75};
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
