import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitInfo } from './mock';

export interface RecruitHeroSectionProps {
  recruit: RecruitInfo;
}

const RecruitHeroSection = ({ recruit }: RecruitHeroSectionProps) => {
  const router = useRouter();

  return (
    <>
      <Banner />
      <Wrapper>
        <Content>
          <Summary>
            <BadgeRow>
              <StatusBadge text={recruit.stageLabel} color="accent" size="medium" />
              <StatusBadge
                text={recruit.statusLabel}
                color="accent"
                variant={recruit.isApplyOpen ? 'solid' : 'outlined'}
                size="medium"
              />
            </BadgeRow>
            <TitleGroup>
              <Title>{recruit.title}</Title>
              <ApplyPeriod>{recruit.applyPeriod}</ApplyPeriod>
            </TitleGroup>
            {recruit.isApplyOpen ? (
              <ButtonRow>
                <ApplyButton size="medium" onClick={() => router.push('/recruit/apply')}>
                  지원하기
                </ApplyButton>
                <Button size="medium" variant="outlined" onClick={() => router.push('/recruit/history')}>
                  지원 내역 확인하기
                </Button>
              </ButtonRow>
            ) : (
              <Button size="medium" disabled>
                {recruit.applyButtonLabel}
              </Button>
            )}
          </Summary>
          <ScheduleGroup>
            <ScheduleTitle>모집 일정</ScheduleTitle>
            <ScheduleCard>
              {recruit.schedules.map(({ label, period }) => (
                <ScheduleRow key={label}>
                  <ScheduleLabel>{label}</ScheduleLabel>
                  <SchedulePeriod>{period}</SchedulePeriod>
                </ScheduleRow>
              ))}
            </ScheduleCard>
          </ScheduleGroup>
        </Content>
      </Wrapper>
    </>
  );
};

export default RecruitHeroSection;

const Banner = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${Orange.o500};

  ${media.xs} {
    height: 180px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 52px 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 52px;
  width: 100%;
  max-width: 1060px;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 712px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

// 리쿠르팅 뱃지는 공통 accent 배경(AccentTint) 대신 O75를 사용
const StatusBadge = styled(ContentBadge)`
  ${(props) => props.variant !== 'outlined' && `background-color: ${Orange.o75};`}
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ApplyButton = styled(Button)`
  width: 80px;
  white-space: nowrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  color: ${Black.b900};
`;

const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
  ${typographyCss(Typography.display2.bold)}

  ${media.xs} {
    ${typographyCss(Typography.title2.bold)}
  }
`;

const ApplyPeriod = styled.p`
  margin: 0;
  ${typographyCss(Typography.title3.medium)}

  ${media.xs} {
    ${typographyCss(Typography.headline1.medium)}
  }
`;

const ScheduleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  color: ${Label.strong};
`;

const ScheduleTitle = styled.h2`
  margin: 0;
  ${typographyCss(Typography.title1.bold)}
`;

const ScheduleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: 32px;
  border-radius: 22px;
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};

  ${media.xs} {
    padding: 20px;
  }
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;
  width: 100%;

  ${media.xs} {
    flex-direction: column;
    gap: 4px;
  }
`;

const ScheduleLabel = styled.p`
  flex-shrink: 0;
  margin: 0;
  width: 200px;
  ${typographyCss(Typography.heading2.bold)}
`;

const SchedulePeriod = styled.p`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  ${typographyCss(Typography.heading2.medium)}
`;
