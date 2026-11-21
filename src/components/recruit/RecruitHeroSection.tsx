import { useRouter } from 'next/router';
import { HiOutlineBell } from 'react-icons/hi';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import { AccentTint, BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitInfo, RecruitPhase } from './mock';

interface PhaseBadge {
  stage: string;
  status: string;
  color: 'accent' | 'neutral';
  variant: 'solid' | 'outlined';
}

const PHASE_BADGES: Record<RecruitPhase, PhaseBadge> = {
  BEFORE_APPLY: { stage: '서류 전형', status: '접수 예정', color: 'accent', variant: 'outlined' },
  APPLYING: { stage: '서류 전형', status: '접수 중', color: 'accent', variant: 'solid' },
  APPLY_CLOSED: { stage: '서류 전형', status: '접수 마감', color: 'neutral', variant: 'solid' },
  DOCUMENT_ANNOUNCED: { stage: '서류 전형', status: '발표 완료', color: 'accent', variant: 'outlined' },
  FINAL_ANNOUNCED: { stage: '최종 결과', status: '발표 완료', color: 'accent', variant: 'outlined' },
  RESULT_CLOSED: { stage: '최종 결과', status: '발표 완료', color: 'accent', variant: 'outlined' },
};

export interface RecruitHeroSectionProps {
  recruit: RecruitInfo;
}

const RecruitHeroSection = ({ recruit }: RecruitHeroSectionProps) => {
  const router = useRouter();
  const badge = PHASE_BADGES[recruit.phase];
  const openNotifyModal = useRecruitModalStore((state) => state.openNotifyModal);

  const actions = (() => {
    if (recruit.phase === 'APPLYING') {
      return (
        <ButtonRow>
          <ApplyButton size="medium" onClick={() => router.push('/recruit/apply')}>
            지원하기
          </ApplyButton>
          <Button size="medium" variant="outlined" onClick={() => router.push('/recruit/history')}>
            지원 내역 확인하기
          </Button>
        </ButtonRow>
      );
    }
    if (recruit.phase === 'BEFORE_APPLY') {
      return (
        <Button size="medium" disabled>
          {recruit.applyButtonLabel}
        </Button>
      );
    }
    if (recruit.phase === 'APPLY_CLOSED') {
      return (
        <Button size="medium" onClick={() => router.push('/recruit/history')}>
          지원 내역 확인하기
        </Button>
      );
    }
    if (recruit.phase === 'RESULT_CLOSED') {
      return (
        <Button size="medium" color="assistive" trailingIcon={<HiOutlineBell />} onClick={openNotifyModal}>
          다음 기수 모집 알림받기
        </Button>
      );
    }
    return (
      <Button size="medium" onClick={() => router.push('/recruit/result')}>
        {recruit.phase === 'FINAL_ANNOUNCED' ? '최종 결과 확인하기' : '결과 확인하기'}
      </Button>
    );
  })();

  return (
    <>
      <Banner />
      <Wrapper>
        <Content>
          <Summary>
            <BadgeRow>
              <StatusBadge text={badge.stage} color="accent" size="medium" />
              <StatusBadge text={badge.status} color={badge.color} variant={badge.variant} size="medium" />
            </BadgeRow>
            <TitleGroup>
              <Title>{recruit.title}</Title>
              <ApplyPeriod>{recruit.applyPeriod}</ApplyPeriod>
            </TitleGroup>
            {actions}
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
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 52px 20px;

  ${media.xs} {
    padding: 42px 20px;
  }
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

// 리쿠르팅 뱃지는 공통 배경(AccentTint, Fill) 대신 Figma 값(O75, #F4F4F5)을 사용
// 테두리 배지도 Figma처럼 높이 28px이 되도록 테두리를 안쪽에 그린다
const StatusBadge = styled(ContentBadge)`
  ${(props) =>
    props.variant === 'outlined'
      ? `border: none; box-shadow: inset 0 0 0 1px ${AccentTint.border};`
      : `background-color: ${props.color === 'accent' ? Orange.o75 : Line.alternative};`}

  /* 배지 크기는 prop으로만 정해져, 모바일에서는 small 크기 값을 직접 덮어쓴다 */
  ${media.xs} {
    padding: 4px 6px;
    border-radius: 6px;

    span {
      font-size: 12px;
      line-height: 1.334;
      letter-spacing: 0.3024px;
    }
  }
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

  ${media.xs} {
    gap: 10px;
  }
`;

const Title = styled.h1`
  margin: 0;
  word-break: keep-all;
  ${typographyCss(Typography.display2.bold)}

  ${media.xs} {
    ${typographyCss(Typography.title1.bold)}
  }
`;

const ApplyPeriod = styled.p`
  margin: 0;
  ${typographyCss(Typography.title3.medium)}

  ${media.xs} {
    ${typographyCss(Typography.body1Normal.medium)}
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

  ${media.xs} {
    ${typographyCss(Typography.title3.bold)}
  }
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
    gap: 22px;
    padding: 28px;
  }
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;
  width: 100%;

  ${media.xs} {
    flex-direction: column;
    gap: 12px;
  }
`;

const ScheduleLabel = styled.p`
  flex-shrink: 0;
  margin: 0;
  width: 200px;
  ${typographyCss(Typography.heading2.bold)}

  ${media.xs} {
    ${typographyCss(Typography.headline1.bold)}
  }
`;

const SchedulePeriod = styled.p`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  ${typographyCss(Typography.heading2.medium)}

  ${media.xs} {
    ${typographyCss(Typography.headline1.medium)}
  }
`;
