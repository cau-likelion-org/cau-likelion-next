import styled from 'styled-components';
import { HiOutlineBell } from 'react-icons/hi';
import Button from '@common/button/Button';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import BgLanding from 'src/assets/svg/bg-landing.svg';
import LogoLikelion from 'src/assets/svg/logo/logo-likelion.svg';
import LogoX from 'src/assets/svg/logo/logo-x.svg';
import LogoCAU from 'src/assets/svg/logo/logo-cau.svg';
import LogoCatchphrase from 'src/assets/svg/logo/logo-catchphrase.svg';
import useRecruitModalStore from 'src/store/useRecruitModalStore';

const DESCRIPTION =
  '중앙대학교 멋쟁이사자처럼은 중앙대 학생들로 이루어진 IT 창업 동아리입니다\n아이디어를 현실로 만들고, 세계를 향한 첫 발자국을 멋쟁이사자처럼에서 내딛어보세요';

const MainSection = () => {
  const openRecruitNotifyModal = useRecruitModalStore((state) => state.openNotifyModal);

  return (
    <Wrapper>
      <BgLanding width={1440} height={666} aria-label="배경 이미지" />

      <Content>
        <TopGroup>
          <LogoRow>
            <LogoLikelion />
            <LogoX />
            <LogoCAU />
          </LogoRow>
          <LogoCatchphrase />
        </TopGroup>

        <BottomGroup>
          <Description>{DESCRIPTION}</Description>
          <Button
            variant="solid"
            color="assistive"
            size="large"
            trailingIcon={<HiOutlineBell />}
            onClick={openRecruitNotifyModal}
          >
            다음 기수 모집 알림받기
          </Button>
        </BottomGroup>
      </Content>
    </Wrapper>
  );
};

export default MainSection;

const Wrapper = styled.div`
  position: relative;
  width: 1440px;
  padding-top: 209px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
`;

const Content = styled.div`
  position: absolute;
  left: 190px;
  top: 114px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 77px;
`;

const TopGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BottomGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
`;

const Description = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Black.b70};
  white-space: pre-line;
  margin: 0;
`;
