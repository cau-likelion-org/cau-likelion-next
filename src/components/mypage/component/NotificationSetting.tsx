import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import { deleteFcmToken, getUserProfile, updateFcmToken } from 'src/apis/account';
import {
  clearCachedFcmToken,
  getCachedFcmToken,
  getNotificationPermission,
  requestFcmToken,
} from 'src/lib/pushNotification';
import useTokenStore from 'src/store/useTokenStore';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type NotificationPermissionState = NotificationPermission | 'unsupported';

const GUIDE_TEXT: Record<NotificationPermissionState, string> = {
  default: '과제 제출 확인을 위해\n알림을 설정해주세요.',
  granted: '과제 제출 확인을 위해\n알림을 설정해주세요.',
  // 한 번 차단하면 사이트에서 다시 물어볼 수 없어 브라우저 설정에서 직접 풀어야 한다
  denied: '브라우저 설정에서\n알림을 허용해주세요.',
  unsupported: '이 브라우저에서는\n알림을 받을 수 없어요.',
};

interface NotificationSettingViewProps {
  permission: NotificationPermissionState;
  enabled: boolean;
  pending?: boolean;
  onToggle?: () => void;
}

export const NotificationSettingView = ({ permission, enabled, pending, onToggle }: NotificationSettingViewProps) => {
  const isDisabled = !!pending || permission === 'unsupported' || permission === 'denied';

  return (
    <Wrapper>
      <SectionLabel>과제 알림 설정</SectionLabel>
      <Row>
        <RowLabel>알림</RowLabel>
        <Switch
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="과제 알림"
          disabled={isDisabled}
          onClick={onToggle}
        >
          <Track $on={enabled}>
            <Thumb />
          </Track>
        </Switch>
      </Row>
      <Guide>{GUIDE_TEXT[permission]}</Guide>
    </Wrapper>
  );
};

// 과제 승인/반려 알림 on/off. 켜면 이 기기의 FCM 토큰을 서버에 등록하고, 끄면 삭제한다.
// 알림은 과제를 제출하는 아기사자에게만 발송되므로 다른 역할에는 노출하지 않는다.
const NotificationSetting = () => {
  const tokenState = useTokenStore((state) => state.token);
  const [permission, setPermission] = useState<NotificationPermissionState>('unsupported');
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  // Notification/localStorage는 서버에 없어 마운트 후에만 읽을 수 있다
  useEffect(() => {
    const current = getNotificationPermission();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPermission(current);
    setEnabled(current === 'granted' && !!getCachedFcmToken());
  }, []);

  const handleToggle = async () => {
    if (pending) return;
    setPending(true);

    try {
      if (enabled) {
        const fcmToken = getCachedFcmToken();
        if (fcmToken) await deleteFcmToken(tokenState, fcmToken);
        clearCachedFcmToken();
        setEnabled(false);
        return;
      }

      // 권한 팝업은 이 클릭 안에서 떠야 브라우저가 무시하지 않는다
      const fcmToken = await requestFcmToken();
      setPermission(getNotificationPermission());
      if (!fcmToken) return;

      await updateFcmToken(tokenState, fcmToken);
      setEnabled(true);
    } catch (error) {
      console.error('[push] 알림 설정 변경 실패', error);
    } finally {
      setPending(false);
    }
  };

  if (userProfile?.role !== 'BABY_LION') return null;

  return (
    <NotificationSettingView permission={permission} enabled={enabled} pending={pending} onToggle={handleToggle} />
  );
};

export default NotificationSetting;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

const SectionLabel = styled.p`
  margin: 0;
  padding: 8px 0;
  color: ${Label.strong};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${BackgroundWhite.tertiary};
`;

const RowLabel = styled.span`
  color: ${Black.b900};
  ${typographyCss(Typography.body1Normal.medium)}
`;

// Figma: 터치 영역 52x32, 트랙 39x24, 썸 18
const Switch = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const Track = styled.span<{ $on: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$on ? 'flex-end' : 'flex-start')};
  width: 39px;
  padding: 3px;
  border-radius: 75px;
  background-color: ${(props) => (props.$on ? Orange.o500 : Line.strong)};
  transition: background-color 0.15s ease;
`;

const Thumb = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 750px;
  background-color: ${BackgroundWhite.primary};
`;

const Guide = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  white-space: pre-line;
  color: ${Label.assistive};
  ${typographyCss(Typography.caption1.medium)}
`;
