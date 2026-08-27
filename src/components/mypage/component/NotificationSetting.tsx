import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import { deleteFcmToken, getUserProfile, updateFcmToken, updatePushSetting } from 'src/apis/account';
import {
  clearCachedFcmToken,
  getCachedFcmToken,
  getNotificationPermission,
  refreshFcmTokenIfGranted,
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

type GuideAlign = 'center' | 'left';

interface NotificationSettingViewProps {
  permission: NotificationPermissionState;
  enabled: boolean;
  onToggle?: () => void;
  guideAlign?: GuideAlign;
}

export const NotificationSettingView = ({
  permission,
  enabled,
  onToggle,
  guideAlign = 'center',
}: NotificationSettingViewProps) => {
  const isDisabled = permission === 'unsupported' || permission === 'denied';

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
      <Guide $align={guideAlign}>{GUIDE_TEXT[permission]}</Guide>
    </Wrapper>
  );
};

// 과제 승인/반려 알림 on/off. 알림 수신 여부는 계정 단위 설정(pushEnabled)이 기준이고,
// 이 기기의 FCM 토큰 등록/삭제는 그 설정을 실제로 동작시키기 위한 부수 작업이다.
// 알림은 과제를 제출하는 아기사자에게만 발송되므로 다른 역할에는 노출하지 않는다.
const NotificationSetting = ({ guideAlign }: { guideAlign?: GuideAlign }) => {
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [permission, setPermission] = useState<NotificationPermissionState>('unsupported');
  const [optimisticEnabled, setOptimisticEnabled] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const hasRestoredToken = useRef(false);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const enabled = optimisticEnabled ?? userProfile?.pushEnabled ?? false;

  // Notification은 서버에 없어 마운트 후에만 읽을 수 있다
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (!userProfile?.pushEnabled || hasRestoredToken.current) return;
    hasRestoredToken.current = true;
    refreshFcmTokenIfGranted().then((fcmToken) => {
      if (fcmToken) updateFcmToken(tokenState, fcmToken).catch(() => undefined);
    });
  }, [userProfile?.pushEnabled, tokenState]);

  const handleToggle = async () => {
    if (pending) return;
    const next = !enabled;
    setOptimisticEnabled(next);
    setPending(true);

    try {
      if (next) {
        const fcmToken = await requestFcmToken();
        setPermission(getNotificationPermission());
        // 권한을 거부했거나 토큰 발급에 실패하면 서버 값으로 되돌린다
        if (!fcmToken) return;
        await updateFcmToken(tokenState, fcmToken);
      } else {
        const fcmToken = getCachedFcmToken();
        if (fcmToken) await deleteFcmToken(tokenState, fcmToken);
        clearCachedFcmToken();
        await updatePushSetting(tokenState, false);
      }
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    } catch (error) {
      console.error('[push] 알림 설정 변경 실패', error);
    } finally {
      setOptimisticEnabled(null);
      setPending(false);
    }
  };

  if (userProfile?.role !== 'BABY_LION') return null;

  return (
    <NotificationSettingView
      permission={permission}
      enabled={enabled}
      onToggle={handleToggle}
      guideAlign={guideAlign}
    />
  );
};

export default NotificationSetting;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const SectionLabel = styled.p`
  margin: 0 0 4px;
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

const Guide = styled.p<{ $align: GuideAlign }>`
  margin: 14px 0 0;
  width: 100%;
  text-align: ${(props) => props.$align};
  white-space: ${(props) => (props.$align === 'center' ? 'pre-line' : 'normal')};
  color: ${Label.assistive};
  ${typographyCss(Typography.caption1.medium)}
`;
