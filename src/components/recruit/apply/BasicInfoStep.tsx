import { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import { FieldDescription, FieldStatus, getFieldBoxShadow } from '@common/fieldStatus/FieldStatus';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import InterviewTimeGrid from '@recruit/InterviewTimeGrid';
import useScrollToFirstError from 'src/hooks/useScrollToFirstError';
import { RECRUIT_INTERVIEW_SETTING_MOCK } from '@mypage/recruit/mock';
import { isUnfilled } from '@utils/index';
import { Black, Label, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import ApplySelect from './ApplySelect';
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

const STUDENT_ID_LENGTH = 8;
const PORTAL_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const PORTAL_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const getPortalImageError = (file: File) => {
  if (!PORTAL_IMAGE_TYPES.includes(file.type)) return 'JPG·JPEG·PNG 파일만 올릴 수 있습니다.';
  if (file.size > PORTAL_IMAGE_MAX_BYTES) return '5MB 이하 파일만 올릴 수 있습니다.';
  return undefined;
};

const REQUIRED_MESSAGE = '필수 입력 문항입니다.';
const FORMAT_MESSAGE = '형식이 맞지 않습니다.';

const toStatus = (error?: string): FieldStatus => (error ? 'negative' : 'normal');

const toDigits = (value: string, maxLength: number) => value.replace(/\D/g, '').slice(0, maxLength);

export interface BasicInfoStepProps {
  applicant: ApplicantProfile;
  onNext: () => void;
}

const BasicInfoStep = ({ applicant, onNext }: BasicInfoStepProps) => {
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
  const [interviewSlots, setInterviewSlots] = useState<string[]>([]);
  // [다음]을 누른 뒤부터 비어 있는 필수 항목을 오류로 표시한다
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollToFirstError = useScrollToFirstError(rootRef);

  const requiredError = (isEmpty: boolean) => (isSubmitted && isEmpty ? REQUIRED_MESSAGE : undefined);

  const getStudentIdError = () => {
    if (isUnfilled(studentId)) return requiredError(true);
    if ((isStudentIdTouched || isSubmitted) && studentId.length !== STUDENT_ID_LENGTH) return FORMAT_MESSAGE;
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
      if (!isDuplicate) return onNext();
      setDuplicateStudentId(checkedStudentId);
      scrollToFirstError();
    },
  });

  const changePortalImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const error = getPortalImageError(file);
    setPortalImageError(error);
    setPortalImage(error ? null : file);
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
    setIsSubmitted(true);
    if (!isValid) return scrollToFirstError();
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
          status={toStatus(errors.studentId)}
          description={errors.studentId}
          onChange={(event) => setStudentId(toDigits(event.target.value, STUDENT_ID_LENGTH))}
          onBlur={() => setIsStudentIdTouched(true)}
        />
        <ApplyTextarea
          heading="학과"
          required
          placeholder="ex) 교육학과"
          value={major}
          status={toStatus(errors.major)}
          description={errors.major}
          onChange={(event) => setMajor(event.target.value.replace(/\n/g, ''))}
        />
        <ApplySelect
          heading="학년"
          options={GRADE_OPTIONS}
          value={grade}
          status={toStatus(errors.grade)}
          description={errors.grade ?? '3월 기준으로 선택해주세요'}
          onChange={setGrade}
        />
        <ApplyTextarea
          heading="이수 학기"
          required
          inputMode="numeric"
          placeholder="숫자만 입력해 주세요"
          value={semester}
          status={toStatus(errors.semester)}
          description={errors.semester}
          onChange={(event) => setSemester(toDigits(event.target.value, 2))}
        />
        <ApplySelect
          heading="학적"
          options={ENROLLMENT_STATUS_OPTIONS}
          value={enrollmentStatus}
          status={toStatus(errors.enrollmentStatus)}
          description={errors.enrollmentStatus ?? '3월 기준으로 선택해주세요'}
          onChange={setEnrollmentStatus}
        />
        <Field>
          <HeadingRow>
            <Heading>
              <HeadingText>포탈 내정보수정 캡처</HeadingText>
              <Required>*</Required>
            </Heading>
            <LinkButton type="button">예시 이미지 보기</LinkButton>
          </HeadingRow>
          <ErrorAnchor aria-invalid={!!errors.portalImage} tabIndex={-1}>
            <FileButton color="assistive" $invalid={!!errors.portalImage} onClick={() => fileInputRef.current?.click()}>
              {portalImage?.name ?? '파일을 선택해 주세요. (JPG·JPEG·PNG, 5MB 이하)'}
            </FileButton>
          </ErrorAnchor>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            aria-label="포탈 내정보수정 캡처"
            onChange={changePortalImage}
          />
          <FieldDescription $status={toStatus(errors.portalImage)}>
            {errors.portalImage ?? '필요한 영역 외 개인정보는 가려주세요.'}
          </FieldDescription>
        </Field>
        <ApplySelect
          heading="지원 경로"
          options={REFERRAL_OPTIONS}
          value={referral}
          status={toStatus(errors.referral)}
          description={errors.referral}
          onChange={setReferral}
        />
        <ApplySelect
          heading="지원 파트"
          options={PART_OPTIONS_MOCK}
          value={part}
          status={toStatus(errors.part)}
          description={errors.part}
          onChange={setPart}
        />
        <Field aria-invalid={!!errors.interviewSlots} tabIndex={-1}>
          <Heading>
            <HeadingText>면접 가능 시간</HeadingText>
            <Required>*</Required>
          </Heading>
          <InterviewTimeGrid
            schedule={RECRUIT_INTERVIEW_SETTING_MOCK}
            selectedSlots={interviewSlots}
            onToggleSlot={toggleInterviewSlot}
          />
          <FieldDescription $status={toStatus(errors.interviewSlots)}>
            {errors.interviewSlots ?? `가능한 시간을 모두 선택해 주세요. (${MIN_INTERVIEW_SLOTS}개 이상)`}
          </FieldDescription>
        </Field>
      </Fields>
      <Actions>
        <Button color="assistive">이전</Button>
        <Button loading={duplicateCheckMutation.isPending} onClick={submit}>
          다음
        </Button>
      </Actions>
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

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeadingText = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading1.bold)}
`;

const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const LinkButton = styled.button`
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.alternative};
  text-decoration: underline;
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.regular)}
`;

// [다음]을 눌렀을 때 첫 오류 위치로 스크롤하기 위한 기준점 (useScrollToFirstError가 aria-invalid로 찾는다)
const ErrorAnchor = styled.div`
  width: 100%;
  outline: none;
`;

const FileButton = styled(Button)<{ $invalid: boolean }>`
  width: 100%;
  ${(props) => props.$invalid && `box-shadow: ${getFieldBoxShadow('negative', false)};`}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
