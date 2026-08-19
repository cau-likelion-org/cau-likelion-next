import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import NotificationSetting from '@mypage/component/NotificationSetting';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SidebarActive =
  | 'home'
  | 'attendance'
  | 'assignment'
  | 'admin-landing'
  | 'admin-about'
  | 'admin-blog'
  | 'admin-members'
  | 'admin-recruit';

const Sidebar = ({ active, isAdmin = false }: { active: SidebarActive; isAdmin?: boolean }) => {
  const router = useRouter();
  const isAdminSection = active.startsWith('admin-');

  const [isAdminOpen, setIsAdminOpen] = useState(isAdminSection);

  const [wasAdminSection, setWasAdminSection] = useState(isAdminSection);
  if (wasAdminSection !== isAdminSection) {
    setWasAdminSection(isAdminSection);
    setIsAdminOpen(isAdminSection);
  }

  const handleAdminToggle = () => {
    const willOpen = !isAdminOpen;
    setIsAdminOpen(willOpen);
    if (willOpen && !isAdminSection) router.push('/mypage/admin/landing');
  };

  return (
    <Wrapper>
      <StyledLink href="/mypage">
        <Item $active={active === 'home'}>홈</Item>
      </StyledLink>
      <StyledLink href="/mypage/attendance">
        <Item $active={active === 'attendance'}>출결관리</Item>
      </StyledLink>
      <StyledLink href="/mypage/assignment">
        <Item $active={active === 'assignment'}>과제관리</Item>
      </StyledLink>
      <NotificationSetting />
      {isAdmin && (
        <AdminGroup>
          <GroupToggle type="button" aria-expanded={isAdminOpen} $active={isAdminSection} onClick={handleAdminToggle}>
            관리자
          </GroupToggle>
          {isAdminOpen && (
            <>
              <StyledLink href="/mypage/admin/landing">
                <SubItem $active={active === 'admin-landing'} $inSection={isAdminSection}>
                  랜딩페이지 관리
                </SubItem>
              </StyledLink>
              <StyledLink href="/mypage/admin/about">
                <SubItem $active={active === 'admin-about'} $inSection={isAdminSection}>
                  소개 페이지 관리
                </SubItem>
              </StyledLink>
              <StyledLink href="/mypage/admin/blog">
                <SubItem $active={active === 'admin-blog'} $inSection={isAdminSection}>
                  블로그 페이지 관리
                </SubItem>
              </StyledLink>
              <StyledLink href="/mypage/admin/members">
                <SubItem $active={active === 'admin-members'} $inSection={isAdminSection}>
                  전체 회원/파트 관리
                </SubItem>
              </StyledLink>
              <StyledLink href="/mypage/admin/recruitment">
                <SubItem $active={active === 'admin-recruit'} $inSection={isAdminSection}>
                  리크루팅 사전 알림 발송
                </SubItem>
              </StyledLink>
            </>
          )}
        </AdminGroup>
      )}
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  gap: 4px;
  width: 160px;
  padding: 0 6px;
`;

const AdminGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

// 관리자 하위 메뉴에 들어와 있으면 상위 항목들과 동일하게 선택된 색으로 표시한다
const GroupToggle = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${(props) => (props.$active ? Label.strong : Label.assistive)};
  ${typographyCss(Typography.heading2.bold)}
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  text-decoration: none;
`;

const Item = styled.p<{ $active?: boolean }>`
  margin: 0;
  width: 100%;
  padding: 8px 0;
  text-align: left;
  color: ${(props) => (props.$active ? Label.strong : Label.assistive)};
  ${typographyCss(Typography.heading2.bold)}
`;

// 관리자 화면에 들어와 있을 때만 하위 항목도 선택 색으로 보여주고, 그 전에는 전부 미선택 색
const SubItem = styled.p<{ $active?: boolean; $inSection?: boolean }>`
  margin: 0;
  width: 100%;
  padding: 6px;
  border-radius: 6px;
  text-align: left;
  color: ${(props) => (props.$inSection ? Label.strong : Label.assistive)};
  background-color: ${(props) => (props.$active ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};
  ${(props) => typographyCss(props.$active ? Typography.label1Normal.bold : Typography.label1Normal.medium)}
`;
