import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { IProjectDetail } from '@@types/request';
import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Chip from '@common/chip/Chip';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import Toast from '@common/toast/Toast';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import { PROJECT_DELETED_FLAG_KEY } from 'src/apis/project';
import IcAdd from '@assets/svg/ic-add.svg';
import IcCalender from '@assets/svg/ic-calender.svg';
import { IcChevronLeft, IcCircleClose, IcCircleExclamation, IcLineHorizontal, IcLink } from '@assets/svg';
import useInput from 'src/hooks/useInput';
import { DEV_STACK, NUMERIC_ONLY_REGEX, PROJECT_CATEGORY_OPTIONS } from '@utils/constant';
import { AccentTint, BackgroundColor, Fill, Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MAX_IMAGE_COUNT = 4;
const LINK_TYPE_OPTIONS = ['GitHub', 'YouTube', 'Web'];
const MAX_LINK_COUNT = LINK_TYPE_OPTIONS.length;
const CONTENT_PLACEHOLDER = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

const ImagePlaceholderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 16L8 11L12 15L16 11L21 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ExtraPart {
  id: number;
  name: string;
  members: string[];
}

interface LinkRow {
  id: number;
  type: string;
  url: string;
}

let idCounter = 0;
const nextId = () => {
  idCounter += 1;
  return idCounter;
};

const LINK_TYPE_BY_KEY: Record<keyof IProjectDetail['link'], string> = {
  github: 'GitHub',
  youtube: 'YouTube',
  web: 'Web',
};

interface ProjectUploadFormProps {
  mode?: 'create' | 'edit';
  initialData?: IProjectDetail;
}

const ProjectUploadForm = ({ mode = 'create', initialData }: ProjectUploadFormProps) => {
  const router = useRouter();
  const isEditMode = mode === 'edit';

  const initialImages =
    initialData?.image && initialData.image.length > 0
      ? Array.from({ length: MAX_IMAGE_COUNT }, (_, index) => initialData.image[index] ?? null)
      : Array(MAX_IMAGE_COUNT).fill(null);

  const initialLinkRows: LinkRow[] = initialData
    ? (Object.keys(LINK_TYPE_BY_KEY) as (keyof IProjectDetail['link'])[])
        .filter((key) => initialData.link?.[key])
        .map((key) => ({ id: nextId(), type: LINK_TYPE_BY_KEY[key], url: initialData.link[key] }))
    : [];

  const [images, setImages] = useState<(string | null)[]>(initialImages);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const handleFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const hadNoImages = images.every((image) => image === null);
    const objectUrl = URL.createObjectURL(file);
    setImages((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index] as string);
      const next = [...prev];
      next[index] = objectUrl;
      return next;
    });
    if (hadNoImages) setFeaturedIndex(index);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index] as string);
      const next = [...prev];
      next[index] = null;
      if (featuredIndex === index) {
        const fallback = next.findIndex((image) => image !== null);
        setFeaturedIndex(fallback === -1 ? 0 : fallback);
      }
      return next;
    });
  };

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [generation, onChangeGeneration] = useInput(
    initialData ? String(initialData.generation) : '',
    NUMERIC_ONLY_REGEX,
  );
  const [category, setCategory] = useState(initialData?.category ?? PROJECT_CATEGORY_OPTIONS[0]);
  const [teamName, setTeamName] = useState(initialData?.team_name ?? '');
  const [pmMembers, setPmMembers] = useState<string[]>(initialData?.team_member.pm ?? []);
  const [designMembers, setDesignMembers] = useState<string[]>(initialData?.team_member.design ?? []);
  const [frontendMembers, setFrontendMembers] = useState<string[]>(initialData?.team_member.frontend ?? []);
  const [backendMembers, setBackendMembers] = useState<string[]>(initialData?.team_member.backend ?? []);
  const [extraParts, setExtraParts] = useState<ExtraPart[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(() => {
    if (!initialData?.date) return ['', ''];
    const [start, end] = initialData.date.split('~');
    return [start ?? '', end ?? ''];
  });
  const [techStackItems, setTechStackItems] = useState<string[]>(
    initialData?.dev_stack.map((stack) => DEV_STACK[stack]) ?? [],
  );
  const [banner, setBanner] = useState('');
  const [linkRows, setLinkRows] = useState<LinkRow[]>(
    initialLinkRows.length > 0 ? initialLinkRows : [{ id: nextId(), type: LINK_TYPE_OPTIONS[0], url: '' }],
  );
  const [showErrors, setShowErrors] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const isEmpty = (value: string) => value.trim().length === 0;
  const isDateInvalid = isEmpty(dateRange[0]) || isEmpty(dateRange[1]);
  const hasError =
    isEmpty(title) ||
    isEmpty(subtitle) ||
    isEmpty(description) ||
    isEmpty(generation) ||
    isEmpty(category) ||
    isEmpty(teamName) ||
    isDateInvalid;

  const handleAddPart = () => {
    setExtraParts((prev) => [...prev, { id: nextId(), name: '', members: [] }]);
  };

  const handleRemovePart = (id: number) => {
    setExtraParts((prev) => prev.filter((part) => part.id !== id));
  };

  const usedLinkTypes = linkRows.map((row) => row.type);
  const availableLinkTypes = LINK_TYPE_OPTIONS.filter((type) => !usedLinkTypes.includes(type));

  const handleAddLinkRow = () => {
    if (availableLinkTypes.length === 0) return;
    setLinkRows((prev) => [...prev, { id: nextId(), type: availableLinkTypes[0], url: '' }]);
  };

  const handleRemoveLinkRow = (id: number) => {
    setLinkRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleCancel = () => {
    router.push('/project');
  };

  const handleSubmit = () => {
    if (hasError) {
      setShowErrors(true);
      return;
    }
    setIsToastOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteAlertOpen(false);
    sessionStorage.setItem(PROJECT_DELETED_FLAG_KEY, 'true');
    router.push('/project');
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Button
          variant="outlined"
          color="assistive"
          size="medium"
          leadingIcon={<IcChevronLeft width={16} height={16} />}
          onClick={handleCancel}
        >
          닫기
        </Button>
        <Title>{isEditMode ? '프로젝트 수정하기' : '프로젝트 추가하기'}</Title>
      </HeaderRow>

      <ImageUploadGroup>
        <MainThumbnail as={images[featuredIndex] ? 'div' : 'label'} $hasImage={!!images[featuredIndex]}>
          {images[featuredIndex] ? (
            <MainThumbnailImage src={images[featuredIndex]} alt="대표 이미지" />
          ) : (
            <>
              <UploadGuide>
                사진을 {MAX_IMAGE_COUNT}장까지 업로드하고
                <br />
                표지가 되는 대표사진을 선택해주세요
              </UploadGuide>
              <HiddenFileInput
                type="file"
                accept="image/*"
                aria-label="대표 이미지 선택"
                onChange={(event) => handleFileChange(featuredIndex, event)}
              />
            </>
          )}
          <FeaturedChip>대표</FeaturedChip>
        </MainThumbnail>
        <ThumbnailRow>
          {images.map((image, index) =>
            image ? (
              <ThumbnailSlot
                key={index}
                as="button"
                type="button"
                $active={index === featuredIndex}
                aria-label={`${index + 1}번째 이미지를 대표사진으로 설정`}
                onClick={() => setFeaturedIndex(index)}
              >
                <ThumbnailImage src={image} alt="" />
                {index === featuredIndex && (
                  <RemoveThumbnailButton
                    type="button"
                    aria-label="대표 이미지 삭제"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveImage(index);
                    }}
                  >
                    <IcCircleClose width={24} height={24} />
                  </RemoveThumbnailButton>
                )}
              </ThumbnailSlot>
            ) : (
              <ThumbnailSlot key={index}>
                <ImagePlaceholderIcon />
                <HiddenFileInput
                  type="file"
                  accept="image/*"
                  aria-label={`이미지 ${index + 1} 선택`}
                  onChange={(event) => handleFileChange(index, event)}
                />
              </ThumbnailSlot>
            ),
          )}
        </ThumbnailRow>
      </ImageUploadGroup>

      <FieldGroup>
        <FieldHeading>
          서비스명
          <Required>*</Required>
        </FieldHeading>
        <TitleTextarea
          placeholder="메시지를 입력해 주세요."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          resize="fixed"
          bottomTrailingContent={<Counter>{title.length}/12</Counter>}
          status={showErrors && isEmpty(title) ? 'negative' : 'normal'}
          description={showErrors && isEmpty(title) ? '서비스명을 입력해 주세요.' : undefined}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldHeading>
          서비스 한줄소개
          <Required>*</Required>
        </FieldHeading>
        <TitleTextarea
          placeholder="메시지를 입력해 주세요."
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          resize="fixed"
          bottomTrailingContent={<Counter>{subtitle.length}/80</Counter>}
          status={showErrors && isEmpty(subtitle) ? 'negative' : 'normal'}
          description={showErrors && isEmpty(subtitle) ? '서비스 한줄소개를 입력해 주세요.' : undefined}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldHeading>
          서비스 설명
          <Required>*</Required>
        </FieldHeading>
        <ContentTextarea
          placeholder={CONTENT_PLACEHOLDER}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          resize="fixed"
          bottomTrailingContent={<Counter>{description.length}/300</Counter>}
          status={showErrors && isEmpty(description) ? 'negative' : 'normal'}
          description={showErrors && isEmpty(description) ? '서비스 설명을 입력해 주세요.' : undefined}
        />
      </FieldGroup>

      <Row>
        <NarrowField>
          <TextField
            heading="기수 구분"
            required
            placeholder="숫자 입력"
            value={generation}
            onChange={onChangeGeneration}
            status={showErrors && isEmpty(generation) ? 'negative' : 'normal'}
            description={showErrors && isEmpty(generation) ? '기수를 입력해 주세요.' : undefined}
          />
        </NarrowField>
        <ProjectFilterSelect
          heading="프로젝트 구분"
          required
          options={PROJECT_CATEGORY_OPTIONS}
          value={category}
          onChange={setCategory}
          status={showErrors && isEmpty(category) ? 'negative' : 'normal'}
          description={showErrors && isEmpty(category) ? '프로젝트 구분을 선택해 주세요.' : undefined}
        />
      </Row>

      <TeamRow>
        <TeamColumn>
          <TextField
            heading="팀명"
            required
            placeholder="텍스트 입력"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            status={showErrors && isEmpty(teamName) ? 'negative' : 'normal'}
            description={showErrors && isEmpty(teamName) ? '팀명을 입력해 주세요.' : undefined}
          />
          <TagChipInput heading="기획" placeholder="이름을 입력해 주세요." values={pmMembers} onChange={setPmMembers} />
          <TagChipInput
            heading="디자인"
            placeholder="이름을 입력해 주세요."
            values={designMembers}
            onChange={setDesignMembers}
          />
          <TagChipInput
            heading="프론트"
            placeholder="이름을 입력해 주세요."
            values={frontendMembers}
            onChange={setFrontendMembers}
          />
          <TagChipInput
            heading="백엔드"
            placeholder="이름을 입력해 주세요."
            values={backendMembers}
            onChange={setBackendMembers}
          />
          {extraParts.map((part) => (
            <ExtraPartGroup key={part.id}>
              <ExtraPartHeaderRow>
                <PartNameInput
                  placeholder="파트 이름 입력"
                  value={part.name}
                  onChange={(event) =>
                    setExtraParts((prev) =>
                      prev.map((p) => (p.id === part.id ? { ...p, name: event.target.value } : p)),
                    )
                  }
                />
                <TextButton size="small" color="assistive" onClick={() => handleRemovePart(part.id)}>
                  삭제
                </TextButton>
              </ExtraPartHeaderRow>
              <TagChipInput
                placeholder="이름을 입력해 주세요."
                values={part.members}
                onChange={(members) =>
                  setExtraParts((prev) => prev.map((p) => (p.id === part.id ? { ...p, members } : p)))
                }
              />
            </ExtraPartGroup>
          ))}
          <Button
            variant="solid"
            color="assistive"
            size="medium"
            trailingIcon={<IcAdd width={16} height={16} />}
            onClick={handleAddPart}
          >
            파트 추가
          </Button>
        </TeamColumn>
        <TeamColumn>
          <DateFieldGroup>
            <FieldHeadingSmall>
              프로젝트 기간
              <RequiredSmall>*</RequiredSmall>
            </FieldHeadingSmall>
            <DateRangeRow>
              <SingleDateInput
                placeholder="시작일 선택"
                ariaLabel="시작일"
                value={dateRange[0]}
                onChange={(next) => setDateRange([next, dateRange[1]])}
                invalid={showErrors && isDateInvalid}
              />
              <DateRangeDivider width={16} height={16} />
              <SingleDateInput
                placeholder="종료일 선택"
                ariaLabel="종료일"
                value={dateRange[1]}
                onChange={(next) => setDateRange([dateRange[0], next])}
                invalid={showErrors && isDateInvalid}
              />
            </DateRangeRow>
            {showErrors && isDateInvalid && <DateDescription>프로젝트 기간을 선택해 주세요.</DateDescription>}
          </DateFieldGroup>
          <TagChipInput
            heading="기술스택"
            placeholder="항목을 입력해 주세요."
            values={techStackItems}
            onChange={setTechStackItems}
          />
          <TextField
            heading="배너 추가하기"
            placeholder="예시)2026해커톤본선진출작"
            value={banner}
            onChange={(event) => setBanner(event.target.value)}
          />
        </TeamColumn>
      </TeamRow>

      <FieldGroup>
        <LinkHeading>링크첨부</LinkHeading>
        {linkRows.map((row) => (
          <LinkRowWrapper key={row.id}>
            <LinkTypeSelect
              leadingIcon={<IcLink width={20} height={20} />}
              value={row.type}
              options={[row.type, ...availableLinkTypes]}
              onChange={(type) => setLinkRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, type } : r)))}
              hideValue
            />
            <TextField
              placeholder="www.example.com"
              value={row.url}
              onChange={(event) =>
                setLinkRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, url: event.target.value } : r)))
              }
              trailingContent={
                <RemoveLinkButton type="button" onClick={() => handleRemoveLinkRow(row.id)} aria-label="링크 삭제">
                  <IcCircleClose width={20} height={20} />
                </RemoveLinkButton>
              }
            />
          </LinkRowWrapper>
        ))}
        {availableLinkTypes.length > 0 && (
          <AddLinkButton type="button" onClick={handleAddLinkRow} aria-label="링크 추가">
            <IcAdd width={20} height={20} />
          </AddLinkButton>
        )}
      </FieldGroup>

      <ActionArea>
        {isEditMode ? (
          <EditActionGroup>
            <Button variant="solid" color="primary" size="large" onClick={handleSubmit}>
              수정하기
            </Button>
            <Button variant="outlined" color="assistive" size="large" onClick={handleDelete}>
              삭제하기
            </Button>
          </EditActionGroup>
        ) : (
          <>
            <ActionDescription>등록 후 수정할 수 있어요</ActionDescription>
            <Button variant="solid" color="primary" size="large" onClick={handleSubmit}>
              등록하기
            </Button>
          </>
        )}
      </ActionArea>

      <ToastWrapper>
        <Toast
          variant="positive"
          text={isEditMode ? '수정이 완료되었습니다.' : '등록이 완료되었습니다.'}
          show={isToastOpen}
          onHidden={() => router.push('/project')}
        />
      </ToastWrapper>

      {isDeleteAlertOpen && (
        <Alert
          heading="프로젝트를 삭제하시겠습니까?"
          body="삭제 후 되돌릴 수 없습니다."
          onDimmerClick={() => setIsDeleteAlertOpen(false)}
          actions={[
            { label: '취소', variant: 'assistive', onClick: () => setIsDeleteAlertOpen(false) },
            { label: '삭제', variant: 'primary', onClick: handleConfirmDelete },
          ]}
        />
      )}
    </Wrapper>
  );
};

export default ProjectUploadForm;

const LinkTypeSelect = styled(ProjectFilterSelect)`
  flex-shrink: 0;
  width: fit-content;
`;

const TagChipInput = ({
  heading,
  required,
  placeholder,
  values,
  onChange,
}: {
  heading?: string;
  required?: boolean;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const commitValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed) onChange([...values, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === ',') {
      event.preventDefault();
      commitValue();
    } else if (event.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <TagInputRoot>
      {heading && (
        <TagInputHeading>
          {heading}
          {required && <RequiredSmall>*</RequiredSmall>}
        </TagInputHeading>
      )}
      <TagInputWrapper>
        {values.map((value, index) => (
          <Chip
            key={`${value}-${index}`}
            size="xsmall"
            trailingIcon={<RemoveIcon>×</RemoveIcon>}
            onClick={() => handleRemove(index)}
          >
            {value}
          </Chip>
        ))}
        <TagTextInput
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitValue}
          placeholder={values.length === 0 ? placeholder : ''}
        />
      </TagInputWrapper>
    </TagInputRoot>
  );
};

const SingleDateInput = ({
  placeholder,
  ariaLabel,
  value,
  onChange,
  invalid = false,
}: {
  placeholder: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DateInputWrapper $invalid={invalid} onClick={() => inputRef.current?.showPicker?.()}>
      <IcCalender width={22} height={22} />
      <DateValue $placeholder={!value}>{value || placeholder}</DateValue>
      {invalid && (
        <IconSlot>
          <IcCircleExclamation width={22} height={22} />
        </IconSlot>
      )}
      <HiddenDateInput
        ref={inputRef}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      />
    </DateInputWrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.title2.bold)}
`;

const ImageUploadGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

const MainThumbnail = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22px;
  background-color: ${(props) => (props.$hasImage ? BackgroundColor : '#f4f4f5')};
  cursor: pointer;
`;

const MainThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadGuide = styled.p`
  ${typographyCss(Typography.body2Normal.regular)}
  color: ${Orange.o500};
  text-align: center;
  margin: 0;
`;

const FeaturedChip = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 9px 12px;
  border-radius: 10px;
  background-color: ${Orange.o50};
  box-shadow:
    inset 0 0 0 9999px rgba(255, 96, 0, 0.05),
    inset 0 0 0 1px ${AccentTint.border};
  color: ${Orange.o500};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const ThumbnailRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ThumbnailSlot = styled.label<{ $active?: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.$active ? `2px solid ${Orange.o500}` : 'none')};
  border-radius: 8px;
  background-color: ${Fill.subtle};
  color: ${Line.normal};
  cursor: pointer;
  padding: 0;
`;

const RemoveThumbnailButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TagInputRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const TagInputHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const TagInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const TagTextInput = styled.input`
  flex: 1 0 60px;
  min-width: 60px;
  padding: 0 4px;
  border: none;
  outline: none;
  background: none;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const RemoveIcon = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const FieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const FieldHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.title3.bold)}
  color: ${Label.neutral};
`;

const FieldHeadingSmall = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  ${typographyCss(Typography.label1Normal.bold)}
  color: ${Label.neutral};
`;

const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.title3.bold)}
`;

const RequiredSmall = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Counter = styled.span`
  padding: 0 4px;
  opacity: 0.74;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

const TitleTextarea = styled(Textarea)`
  textarea {
    min-height: 26px;
  }
`;

const ContentTextarea = styled(Textarea)`
  textarea {
    min-height: 172px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const NarrowField = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

const TeamRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const TeamColumn = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
`;

const ExtraPartGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ExtraPartHeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PartNameInput = styled.input`
  flex-shrink: 0;
  width: 94px;
  padding: 4px 6px;
  margin: 0 -6px;
  border: none;
  border-radius: 6px;
  outline: none;
  background-color: rgba(0, 0, 0, 0.04);
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.medium)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const DateFieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const DateRangeRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateInputWrapper = styled.div<{ $invalid: boolean }>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  color: ${Label.normal};
  box-shadow: ${(props) =>
    props.$invalid
      ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
      : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`};
  cursor: pointer;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const IconSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${State.error};
`;

const DateDescription = styled.p`
  margin: 0;
  width: 100%;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;

const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

const DateValue = styled.span<{ $placeholder: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  ${typographyCss(Typography.body1Normal.regular)}
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
`;

const LinkHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

const LinkRowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const RemoveLinkButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.assistive};
  cursor: pointer;
`;

const AddLinkButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 375px;
  max-width: 100%;
  margin: 0 auto;

  button {
    width: 100%;
  }
`;

const EditActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  width: 100%;
`;

const ActionDescription = styled.p`
  margin: 0;
  text-align: center;
  color: ${Label.alternative};
  ${typographyCss(Typography.label2.regular)}
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
