import Footer from '@common/footer/Footer';
import MobileNavBar from '@common/header/MobileNavBar';
import NavBar from '@common/header/NavBar';
import { BackgroundColor } from '@utils/constant/color';
import { ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { track } from 'src/lib/amplitude';

const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100];

const LayoutArchiving = ({ children }: { children: ReactElement; }) => {
  const router = useRouter();

  useEffect(() => {
    const pagePath = router.asPath;
    const startTime = Date.now();
    const reachedThresholds = new Set<number>();
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent =
        scrollableHeight > 0 ? Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100)) : 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);

      SCROLL_DEPTH_THRESHOLDS.forEach((threshold) => {
        if (scrollPercent >= threshold && !reachedThresholds.has(threshold)) {
          reachedThresholds.add(threshold);
          track('Archiving Scroll Depth Reached', { depth_percent: threshold, page_path: pagePath });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      track('Archiving Page Exited', {
        max_scroll_depth: maxScrollDepth,
        time_on_page_ms: Date.now() - startTime,
      });
    };
  }, [router.asPath]);

  return (
    <>
      <PageContainer>
        <NavBar />
        <MobileNavBar />
        <main>{children}</main>
      </PageContainer>
      <Footer isLandingLayout={false} />
    </>
  );
};

export default LayoutArchiving;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1440px) {
    padding: 100px 100px 100px 100px;
  }

  @media (max-width: 900px) {
    padding: 70px 20px;
  }
  padding: 100px 160px 100px 160px;
  
`;
