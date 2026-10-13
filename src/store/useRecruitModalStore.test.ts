import { beforeEach, describe, expect, it } from 'vitest';

import useRecruitModalStore from './useRecruitModalStore';

describe('useRecruitModalStore', () => {
  beforeEach(() => {
    useRecruitModalStore.setState({ step: 'closed', toast: null });
  });

  it('처음에는 닫혀 있고 토스트가 없다', () => {
    expect(useRecruitModalStore.getState()).toMatchObject({ step: 'closed', toast: null });
  });

  it('모집 마감 안내와 알림 신청 모달을 각각 열 수 있다', () => {
    useRecruitModalStore.getState().openClosedAlert();
    expect(useRecruitModalStore.getState().step).toBe('closedAlert');

    useRecruitModalStore.getState().openNotifyModal();
    expect(useRecruitModalStore.getState().step).toBe('notify');

    useRecruitModalStore.getState().close();
    expect(useRecruitModalStore.getState().step).toBe('closed');
  });

  it('closeWithToast는 모달을 닫으면서 결과 토스트를 예약한다', () => {
    useRecruitModalStore.getState().openNotifyModal();

    useRecruitModalStore.getState().closeWithToast('positive', '알림 신청이 완료되었습니다.');

    expect(useRecruitModalStore.getState()).toMatchObject({
      step: 'closed',
      toast: { variant: 'positive', message: '알림 신청이 완료되었습니다.' },
    });
  });

  it('clearToast는 토스트만 지운다', () => {
    useRecruitModalStore.getState().closeWithToast('negative', '신청에 실패했습니다.');

    useRecruitModalStore.getState().clearToast();

    expect(useRecruitModalStore.getState().toast).toBeNull();
  });
});
