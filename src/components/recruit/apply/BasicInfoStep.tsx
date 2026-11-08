import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import InterviewTimeGrid from '@recruit/InterviewTimeGrid';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import { RECRUIT_INTERVIEW_SETTING_MOCK } from '@mypage/recruit/mock';
import { isUnfilled } from '@utils/index';
import { Label } from '@utils/constant/color';

import ApplyFieldHeading from './ApplyFieldHeading';
import ApplyFileField from './ApplyFileField';
import ApplySelect from './ApplySelect';
import PortalExampleLink from './PortalExampleLink';
import { applyFieldHeadingCss } from './applyFieldStyle';
import {
  ApplicantProfile,
  ENROLLMENT_STATUS_OPTIONS,
  GRADE_OPTIONS,
  MIN_INTERVIEW_SLOTS,
  PART_OPTIONS_MOCK,
  REFERRAL_OPTIONS,
  checkStudentIdDuplicate,
} from './mock';
import { FORMAT_MESSAGE, REQUIRED_MESSAGE, toFieldStatus } from './validation';

const STUDENT_ID_LENGTH = 8;
const PORTAL_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const PORTAL_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const getPortalImageError = (file: File) => {
  if (!PORTAL_IMAGE_TYPES.includes(file.type)) return 'JPG·JPEG·PNG 파일만 올릴 수 있습니다.';
  if (file.size > PORTAL_IMAGE_MAX_BYTES) return '5MB 이하 파일만 올릴 수 있습니다.';
  return undefined;
};

const toDigits = (value: string, maxLength: number) => value.replace(/\D/g, '').slice(0, maxLength);

export interface BasicInfoStepProps {
  applicant: ApplicantProfile;
  // 2단계에 작성한 내용이 있으면 파트를 바꿀 때 초기화 확인을 받는다
  hasPartAnswers: boolean;
  onPartReset: () => void;
  onNext: (part: string) => void;
}

const BasicInfoStep = ({ applicant, hasPartAnswers, onPartReset, onNext }: BasicInfoStepProps) => {
  const [studentId, setStudentId] = useState('');
  const [isStudentIdTouched, setIsStudentIdTouched] = useState(false);
  const [duplicateStudentId, setDuplicateStudentId] = useState<string>();
  const [major, setMajor] = useState('');
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [portalImage, setPortalImage] = useState<File | null>(null);
  const [portalImageError, setPortalImageError] = useState<string>();
  const [referral, setReferral] = useState('');
  const [part, setPart] = useState('');
  const [pendingPart, setPendingPart] = useState<string>();
  const [interviewSlots, setInterviewSlots] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const { showErrors, validate } = useRequiredFieldsSave(rootRef);

  const requiredError = (isEmpty: boolean) => (showErrors && isEmpty ? REQUIRED_MESSAGE : undefined);

  const getStudentIdError = () => {
    if (isUnfilled(studentId)) return requiredError(true);
    if ((isStudentIdTouched || showErrors) && studentId.length !== STUDENT_ID_LENGTH) return FORMAT_MESSAGE;
    if (studentId === duplicateStudentId) return '이미 지원 내역이 있는 학번입니다.';
    return undefined;
  };

  const errors = {
    studentId: getStudentIdError(),
    major: requiredError(isUnfilled(major)),
    grade: requiredError(!grade),
    semester: requiredError(isUnfilled(semester)),
    enrollmentStatus: requiredError(!enrollmentStatus),
    portalImage: portalImageError ?? requiredError(!portalImage),
    referral: requiredError(!referral),
    part: requiredError(!part),
    interviewSlots: requiredError(interviewSlots.length < MIN_INTERVIEW_SLOTS),
  };

  const duplicateCheckMutation = useMutation({
    mutationFn: checkStudentIdDuplicate,
    onSuccess: (isDuplicate, checkedStudentId) => {
      if (!isDuplicate) return onNext(part);
      setDuplicateStudentId(checkedStudentId);
      // 중복 오류는 학번 칸에 표시되므로 그 위치로 스크롤한다
      validate(true);
    },
  });

  const changePortalImage = (file: File) => {
    const error = getPortalImageError(file);
    setPortalImageError(error);
    setPortalImage(error ? null : file);
  };

  const changePart = (nextPart: string) => {
    if (hasPartAnswers && nextPart !== part) return setPendingPart(nextPart);
    setPart(nextPart);
  };

  const confirmPartChange = () => {
    if (pendingPart) setPart(pendingPart);
    setPendingPart(undefined);
    onPartReset();
  };

  const toggleInterviewSlot = (slot: string) =>
    setInterviewSlots((prev) => (prev.includes(slot) ? prev.filter((item) => item !== slot) : [...prev, slot]));

  const isValid =
    studentId.length === STUDENT_ID_LENGTH &&
    !isUnfilled(major) &&
    !!grade &&
    !isUnfilled(semester) &&
    !!enrollmentStatus &&
    !!portalImage &&
    !!referral &&
    !!part &&
    interviewSlots.length >= MIN_INTERVIEW_SLOTS;

  // 형식 검증을 통과하면 학번 중복을 확인한 뒤 2단계로 넘어간다
  const submit = () => {
    if (!validate(!isValid)) return;
    duplicateCheckMutation.mutate(studentId);
  };

  return (
    <Root ref={rootRef}>
      <Fields>
        <ProfileGroup>
          <ProfileField heading="이름" value={applicant.name} disabled />
          <ProfileField heading="전화번호" value={applicant.phone} disabled />
          <ProfileField
            heading="이메일"
            value={applicant.email}
            disabled
            description="본인 확인 단계에서 입력한 정보는 수정할 수 없습니다."
          />
        </ProfileGroup>
        <ApplyTextarea
          heading="학번"
          required
          inputMode="numeric"
          placeholder="숫자 8자리"
          value={studentId}
          status={toFieldStatus(errors.studentId)}
          description={errors.studentId}
          onChange={(event) => setStudentId(toDigits(event.target.value, STUDENT_ID_LENGTH))}
          onBlur={() => setIsStudentIdTouched(true)}
        />
        <ApplyTextarea
          heading="학과"
          required
          placeholder="ex) 교육학과"
          value={major}
          status={toFieldStatus(errors.major)}
          description={errors.major}
          onChange={(event) => setMajor(event.target.value.replace(/\n/g, ''))}
        />
        <ApplySelect
          heading="학년"
          options={GRADE_OPTIONS}
          value={grade}
          status={toFieldStatus(errors.grade)}
          description={errors.grade ?? '3월 기준으로 선택해주세요'}
          onChange={setGrade}
        />
        <ApplyTextarea
          heading="이수 학기"
          required
          inputMode="numeric"
          placeholder="숫자만 입력해 주세요"
          value={semester}
          status={toFieldStatus(errors.semester)}
          description={errors.semester}
          onChange={(event) => setSemester(toDigits(event.target.value, 2))}
        />
        <ApplySelect
          heading="학적"
          options={ENROLLMENT_STATUS_OPTIONS}
          value={enrollmentStatus}
          status={toFieldStatus(errors.enrollmentStatus)}
          description={errors.enrollmentStatus ?? '3월 기준으로 선택해주세요'}
          onChange={setEnrollmentStatus}
        />
        <ApplyFileField
          heading="포탈 내정보수정 캡처"
          required
          headingTrailing={<PortalExampleLink />}
          placeholder="파일을 선택해 주세요. (JPG·JPEG·PNG, 5MB 이하)"
          accept=".jpg,.jpeg,.png"
          file={portalImage ?? undefined}
          description="필요한 영역 외 개인정보는 가려주세요."
          error={errors.portalImage}
          onSelect={changePortalImage}
          onRemove={() => setPortalImage(null)}
        />
        <ApplySelect
          heading="지원 경로"
          options={REFERRAL_OPTIONS}
          value={referral}
          status={toFieldStatus(errors.referral)}
          description={errors.referral}
          onChange={setReferral}
        />
        <ApplySelect
          heading="지원 파트"
          options={PART_OPTIONS_MOCK}
          value={part}
          status={toFieldStatus(errors.part)}
          description={errors.part}
          onChange={changePart}
        />
        <Field aria-invalid={!!errors.interviewSlots} tabIndex={-1}>
          <ApplyFieldHeading title="면접 가능 시간" required />
          <InterviewTimeGrid
            schedule={RECRUIT_INTERVIEW_SETTING_MOCK}
            selectedSlots={interviewSlots}
            onToggleSlot={toggleInterviewSlot}
          />
          <FieldDescription $status={toFieldStatus(errors.interviewSlots)}>
            {errors.interviewSlots ?? `가능한 시간을 모두 선택해 주세요. (${MIN_INTERVIEW_SLOTS}개 이상)`}
          </FieldDescription>
        </Field>
      </Fields>
      <Actions>
        <Button loading={duplicateCheckMutation.isPending} onClick={submit}>
          다음
        </Button>
      </Actions>
      {pendingPart && (
        <Alert
          heading="파트를 변경하면 작성한 2단계 내용이 모두 초기화됩니다."
          onDimmerClick={() => setPendingPart(undefined)}
          actions={[
            { label: '취소', variant: 'assistive', onClick: () => setPendingPart(undefined) },
            { label: '변경', variant: 'primary', onClick: confirmPartChange },
          ]}
        />
      )}
    </Root>
  );
};

export default BasicInfoStep;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 78px;
  width: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
`;

const ProfileGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

// Figma에서 학번·학과·이수 학기는 한 줄짜리 Textarea(높이 50px)로 그려져 있어 그대로 맞춘다
const ApplyTextarea = styled(Textarea)`
  ${applyFieldHeadingCss}
`;

// 본인 확인 단계 정보는 수정할 수 없지만 값은 읽을 수 있게 보조 글자색으로 보여준다
const ProfileField = styled(TextField)`
  ${applyFieldHeadingCss}

  input:disabled {
    color: ${Label.alternative};
    -webkit-text-fill-color: ${Label.alternative};
    cursor: default;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  outline: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
