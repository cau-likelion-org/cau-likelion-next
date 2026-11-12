import { KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled, { css } from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import CharCount from '@common/charCount/CharCount';
import Checkbox from '@common/checkbox/Checkbox';
import BackHeader from '@common/header/BackHeader';
import Radio from '@common/radio/Radio';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import InfoList from '@recruit/InfoList';
import ApplyFieldHeading from '@recruit/apply/ApplyFieldHeading';
import { applyFieldHeadingCss } from '@recruit/apply/applyFieldStyle';
import { EMAIL_FORMAT_MESSAGE } from '@recruit/apply/validation';
import { IcDocument, IcDownload, IcLink } from '@assets/svg';
import {
  formatFileSize,
  formatInterviewSlots,
  formatPhoneNumber,
  isEmailFormatInvalid,
  isNameFormatInvalid,
  isPhoneFormatInvalid,
  isUnfilled,
  toDateTimeLabel,
} from '@utils/index';
import { Black, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import {
  ApplicantDetail,
  ApplicantFile,
  SECOND_STEP_QUESTIONS_BY_PART,
  deleteApplicant,
  updateApplicantContact,
} from './applicantMock';
import { RECRUIT_INTERVIEW_SETTING_MOCK } from './mock';

const LIST_PATH = '/mypage/recruit/applicants';

const openInNewTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

const getLinkFieldProps = (url: string) => ({
  onClick: () => openInNewTab(url),
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && openInNewTab(url),
});

const downloadFile = async (file: ApplicantFile) => {
  const response = await fetch(file.url);
  if (!response.ok) throw new Error('file not found');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
};

export interface ApplicantDetailViewProps {
  applicant: ApplicantDetail;
  canDelete: boolean;
}

const ApplicantDetailView = ({ applicant, canDelete }: ApplicantDetailViewProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({ name: applicant.name, phone: applicant.phone, email: applicant.email });
  const [showErrors, setShowErrors] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState<{ variant: 'positive' | 'negative'; message: string } | null>(null);

  const refreshApplicants = () => queryClient.invalidateQueries({ queryKey: ['recruitApplicants'] });

  const updateMutation = useMutation({
    mutationFn: updateApplicantContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitApplicant', applicant.id] });
      setIsEditing(false);
      setShowErrors(false);
      refreshApplicants();
      setToast({ variant: 'positive', message: '변경사항이 저장되었습니다.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      refreshApplicants();
      router.replace({ pathname: LIST_PATH, query: { deleted: 'true' } });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: downloadFile,
    networkMode: 'always',
    onError: () => setToast({ variant: 'negative', message: '파일을 불러올 수 없습니다' }),
  });

  const contactErrors = {
    name:
      isUnfilled(contact.name) || isNameFormatInvalid(contact.name)
        ? '한글 또는 영문 2~20자로 입력해 주세요.'
        : undefined,
    phone:
      isUnfilled(contact.phone) || isPhoneFormatInvalid(contact.phone)
        ? '010-0000-0000 형식으로 입력해 주세요.'
        : undefined,
    email: isUnfilled(contact.email) || isEmailFormatInvalid(contact.email) ? EMAIL_FORMAT_MESSAGE : undefined,
  };

  const saveContact = () => {
    if (Object.values(contactErrors).some(Boolean)) return setShowErrors(true);
    updateMutation.mutate({ id: applicant.id, ...contact });
  };

  const cancelEdit = () => {
    setContact({ name: applicant.name, phone: applicant.phone, email: applicant.email });
    setShowErrors(false);
    setIsEditing(false);
  };

  const contactField = (key: keyof typeof contact, label: string) => ({
    label,
    value: isEditing ? (
      <ContactField
        aria-label={label}
        value={contact[key]}
        status={showErrors && contactErrors[key] ? 'negative' : 'normal'}
        description={showErrors ? contactErrors[key] : undefined}
        onChange={(event) =>
          setContact((prev) => ({
            ...prev,
            [key]: key === 'phone' ? formatPhoneNumber(event.target.value) : event.target.value,
          }))
        }
      />
    ) : (
      contact[key]
    ),
  });

  const questions = applicant.part ? (SECOND_STEP_QUESTIONS_BY_PART[applicant.part] ?? []) : [];

  return (
    <Page>
      <BackHeader label="지원자 목록으로 돌아가기" onClick={() => router.push(LIST_PATH)} />
      <Sections>
        <TitleRow>
          <PageTitle>지원자 정보</PageTitle>
          {applicant.submittedAt && (
            <SubmittedAt>
              <span>제출 일시</span>
              <span>ㅣ</span>
              <span>{toDateTimeLabel(new Date(applicant.submittedAt)).replace(/\./g, '/')}</span>
            </SubmittedAt>
          )}
        </TitleRow>
        <Section>
          <SectionHeader>
            <SectionTitle>기본 정보</SectionTitle>
            <SectionActions>
              {isEditing ? (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="assistive"
                    disabled={updateMutation.isPending}
                    onClick={cancelEdit}
                  >
                    취소
                  </Button>
                  <Button size="small" loading={updateMutation.isPending} onClick={saveContact}>
                    저장
                  </Button>
                </>
              ) : (
                <>
                  <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>
                    수정
                  </Button>
                  {canDelete && (
                    <Button size="small" color="assistive" onClick={() => setIsDeleteOpen(true)}>
                      지원서 삭제
                    </Button>
                  )}
                </>
              )}
            </SectionActions>
          </SectionHeader>
          <InfoList
            labelWidth={140}
            rows={[contactField('name', '이름'), contactField('phone', '전화번호'), contactField('email', '이메일')]}
          />
          {isEditing && <EditCaption>이메일을 바꾸면 지원자의 로그인 이메일도 함께 바뀝니다.</EditCaption>}
          {applicant.studentId && (
            <InfoList
              labelWidth={140}
              rows={[
                { label: '학번', value: applicant.studentId },
                { label: '학과', value: applicant.major },
                { label: '학년', value: applicant.grade },
                { label: '이수 학기', value: applicant.semester },
                { label: '학적', value: applicant.enrollmentStatus },
                { label: '지원 경로', value: applicant.referral },
                {
                  label: '면접 가능 시간',
                  value: formatInterviewSlots(applicant.interviewSlots, RECRUIT_INTERVIEW_SETTING_MOCK.unitMinutes),
                },
                {
                  label: '포탈 내정보수정 캡처',
                  value: applicant.portalCapture && (
                    <PortalRow>
                      <FileLink
                        aria-label="포탈 내정보수정 캡처"
                        readOnly
                        value={applicant.portalCapture.name}
                        leadingIcon={<IcDocument width={22} height={22} />}
                        {...getLinkFieldProps(applicant.portalCapture.url)}
                      />
                      <IconButton
                        type="button"
                        aria-label="포탈 내정보수정 캡처 다운로드"
                        onClick={() => applicant.portalCapture && downloadMutation.mutate(applicant.portalCapture)}
                      >
                        <IcDownload width={22} height={22} />
                      </IconButton>
                    </PortalRow>
                  ),
                },
              ]}
            />
          )}
        </Section>
        {questions.length > 0 && (
          <AnswerSection>
            <SectionTitle>2단계 문항 답변</SectionTitle>
            <Answers>
              {questions.map((question, index) => {
                const heading = `${index + 1}. ${question.title}`;
                const answer = applicant.answers.find((item) => item.questionId === question.id);

                if (question.type === 'LONG_TEXT') {
                  const text = answer?.text ?? '';
                  return (
                    <AnswerTextarea
                      key={question.id}
                      heading={heading}
                      required={question.isRequired}
                      readOnly
                      value={text}
                      bottomTrailingContent={
                        question.maxLength && (
                          <Count>
                            {text.length}/{question.maxLength}
                          </Count>
                        )
                      }
                    />
                  );
                }

                if (question.type === 'LINK') {
                  const link = answer?.text?.trim();
                  const isOpenable = !!link && /^https?:\/\//.test(link);
                  const LinkField = isOpenable ? LinkAnswerField : AnswerField;
                  return (
                    <LinkField
                      key={question.id}
                      heading={heading}
                      required={question.isRequired}
                      readOnly
                      value={link || '-'}
                      leadingIcon={<IcLink width={22} height={22} />}
                      {...(isOpenable && getLinkFieldProps(link))}
                    />
                  );
                }

                if (question.type === 'FILE') {
                  const file = answer?.file;
                  return (
                    <AnswerField
                      key={question.id}
                      heading={heading}
                      required={question.isRequired}
                      readOnly
                      value={file ? `${file.name} · ${formatFileSize(file.size)}` : '-'}
                      leadingIcon={<IcDocument width={22} height={22} />}
                      trailingContent={
                        file && (
                          <IconButton
                            type="button"
                            aria-label={`${question.title} 다운로드`}
                            onClick={() => downloadMutation.mutate(file)}
                          >
                            <IcDownload width={22} height={22} />
                          </IconButton>
                        )
                      }
                    />
                  );
                }

                const ChoiceControl = question.type === 'SINGLE_CHOICE' ? Radio : Checkbox;
                return (
                  <ChoiceField key={question.id}>
                    <ApplyFieldHeading title={heading} required={question.isRequired} />
                    <ChoiceList>
                      {question.choices.map((choice) => {
                        const isSelected = !!answer?.choiceIds?.includes(choice.id);
                        return (
                          <ChoiceItem key={choice.id} $selected={isSelected}>
                            <ChoiceControl label={choice.text} checked={isSelected} onChange={() => {}} />
                          </ChoiceItem>
                        );
                      })}
                    </ChoiceList>
                  </ChoiceField>
                );
              })}
            </Answers>
          </AnswerSection>
        )}
      </Sections>
      {isDeleteOpen && (
        <Alert
          align="center"
          heading={'삭제 후에는 복구가 어렵습니다.\n지원서를 삭제하시겠습니까?'}
          onDimmerClick={() => !deleteMutation.isPending && setIsDeleteOpen(false)}
          actions={[
            {
              label: '취소',
              variant: 'assistive',
              disabled: deleteMutation.isPending,
              onClick: () => setIsDeleteOpen(false),
            },
            {
              label: '삭제하기',
              variant: 'primary',
              disabled: deleteMutation.isPending,
              onClick: () => deleteMutation.mutate(applicant.id),
            },
          ]}
        />
      )}
      <ToastWrapper>
        <Toast
          variant={toast?.variant ?? 'positive'}
          text={toast?.message ?? ''}
          show={!!toast}
          onHidden={() => setToast(null)}
        />
      </ToastWrapper>
    </Page>
  );
};

export default ApplicantDetailView;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1060px;
  padding: 0 20px 80px;
  box-sizing: content-box;
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.display3.bold)}
`;

const SubmittedAt = styled.p`
  display: flex;
  gap: 4px;
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const SectionActions = styled.div`
  display: flex;
  gap: 14px;
`;

const ContactField = styled(TextField)`
  max-width: 400px;
`;

const EditCaption = styled.p`
  margin: -12px 0 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;

const PortalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const linkInputCss = css`
  input {
    text-decoration: underline;
    cursor: pointer;
    pointer-events: auto;
  }
`;

const FileLink = styled(TextField)`
  flex: 1 0 0;
  min-width: 0;
  ${linkInputCss}
`;

const IconButton = styled.button`
  display: flex;
  flex-shrink: 0;
  padding: 1px;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

const AnswerSection = styled(Section)`
  gap: 32px;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const AnswerTextarea = styled(Textarea)`
  ${applyFieldHeadingCss}

  textarea {
    field-sizing: content;
    min-height: 146px;
  }
`;

const AnswerField = styled(TextField)`
  ${applyFieldHeadingCss}
`;

const LinkAnswerField = styled(AnswerField)`
  ${linkInputCss}
`;

const Count = styled(CharCount)`
  font-weight: 500;
`;

const ChoiceField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
`;

// 답변 표시용이라 선택을 바꿀 수 없게 막는다
const ChoiceItem = styled.div<{ $selected: boolean }>`
  padding: 12px 20px;
  opacity: ${(props) => (props.$selected ? 1 : 0.43)};
  pointer-events: none;
`;
