import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '@common/button/Button';
import useTokenStore from 'src/store/useTokenStore';
import ChungAngLogo from 'src/assets/svg/logo/logo-chungang-symbol.svg';
import IcMenu from 'src/assets/svg/icon/ic-menu.svg';
import IcClose from 'src/assets/svg/icon/ic-close.svg';
import { BackgroundColor, Label } from '@utils/constant/color';
import MobileNavModal from './MobileNavModal';

const MobileNavBar = () => {
  const router = useRouter();
  const [isModalOn, setIsModalOn] = useState(false);
  const { access } = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const isLogin = hasHydrated && !!access;

  return (
    <>
      <Wrapper>
        <Link href="/" aria-label="홈으로 이동">
          <ChungAngLogo width={168} height={20} />
        </Link>
        <RightSection>
          {/* 메뉴가 열리면 같은 버튼이 패널 안에 있으므로 바에서는 숨긴다 (Figma: 로고 + 닫기만) */}
          {!isModalOn &&
            (isLogin ? (
              <Button variant="solid" color="assistive" size="small" onClick={() => router.push('/mypage')}>
                마이페이지
              </Button>
            ) : (
              <Button variant="solid" color="primary" size="small" onClick={() => router.push('/login')}>
                로그인
              </Button>
            ))}
          <MenuButton
            type="button"
            aria-label={isModalOn ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isModalOn}
            onClick={() => setIsModalOn((prev) => !prev)}
          >
            {isModalOn ? <IcClose width={24} height={24} /> : <IcMenu width={24} height={24} />}
          </MenuButton>
        </RightSection>
      </Wrapper>
      <MobileNavModal isModalOn={isModalOn} onClose={() => setIsModalOn(false)} />
    </>
  );
};

export default MobileNavBar;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: ${BackgroundColor};

  @media (min-width: 900px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;
