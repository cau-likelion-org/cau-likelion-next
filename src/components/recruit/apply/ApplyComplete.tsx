import { useRouter } from 'next/router';

import RecruitSummary from '@recruit/RecruitSummary';
import { IllustApplyComplete } from '@assets/svg';
import { toDateTimeLabel } from '@utils/index';

export interface ApplyCompleteProps {
  generation: number;
  submittedAt: Date;
  part: string;
}

const ApplyComplete = ({ generation, submittedAt, part }: ApplyCompleteProps) => {
  const router = useRouter();

  return (
    <RecruitSummary
      title="지원서 제출이 완료되었어요!"
      subtitle={`멋쟁이사자처럼 중앙대학교 ${generation}기에 지원해 주셔서 감사합니다.`}
      graphic={<IllustApplyComplete aria-hidden />}
      rows={[
        { label: '제출 일시', value: toDateTimeLabel(submittedAt) },
        { label: '지원 파트', value: part },
      ]}
      notices={[
        '서류 결과와 최종 결과는 지원하기 페이지의 [결과 확인]에서 지원서 작성 시 등록한 이메일과 비밀번호로 로그인해 확인할 수 있습니다.',
        '제출한 지원서는 수정할 수 없습니다.',
      ]}
      actionLabel="메인 페이지로"
      actionGap={54}
      onAction={() => router.push('/')}
    />
  );
};

export default ApplyComplete;
