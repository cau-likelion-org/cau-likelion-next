import { ChangeEvent, KeyboardEvent, ReactNode, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Chip from '@common/chip/Chip';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import Toast from '@common/toast/Toast';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import {
  GenerationListItem,
  LinkPlatform,
  PROJECT_DELETED_FLAG_KEY,
  ProjectCategoryCode,
  ProjectImagePayload,
  ProjectLinkPayload,
  ProjectMemberPayload,
  ProjectRequestPayload,
  ProjectResponseDto,
  createProject,
  deleteProject,
  getGenerations,
  updateProject,
  uploadProjectImage,
} from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import IcAdd from '@assets/svg/ic-add.svg';
import IcCalender from '@assets/svg/ic-calender.svg';
import {
  IcBehance,
  IcChevronDown,
  IcChevronLeft,
  IcCircleClose,
  IcCircleExclamation,
  IcGithub,
  IcLineHorizontal,
  IcLink,
} from '@assets/svg';
import useInput from 'src/hooks/useInput';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { NUMERIC_ONLY_REGEX, PROJECT_CATEGORY_OPTIONS } from '@utils/constant';
import { AccentTint, BackgroundColor, Fill, Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MAX_IMAGE_COUNT = 4;
const LINK_TYPE_OPTIONS = ['Web', 'GitHub', 'Behance'];
const MAX_LINK_COUNT = LINK_TYPE_OPTIONS.length;
const CONTENT_PLACEHOLDER = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

const LINK_TYPE_TO_PLATFORM: Record<string, LinkPlatform> = {
  Web: 'WEB',
  GitHub: 'GITHUB',
  Behance: 'BEHANCE',
};
const PLATFORM_TO_LINK_TYPE: Record<LinkPlatform, string> = {
  GITHUB: 'GitHub',
  WEB: 'Web',
  BEHANCE: 'Behance',
};

const LINK_TYPE_LABEL: Record<string, string> = {
  Web: '웹링크',
  GitHub: '깃허브',
  Behance: '비핸스',
};
const LINK_TYPE_ICON: Record<string, ReactNode> = {
  Web: <IcLink width={20} height={20} />,
  GitHub: <IcGithub width={20} height={20} />,
  Behance: <IcBehance width={20} height={14} />,
};

const CATEGORY_LABEL_TO_CODE: Record<string, ProjectCategoryCode> = {
  아이디어톤: 'IDEATHON',
  해커톤: 'HACKATHON',
  중커톤: 'CHUNGKATHON',
};
const CATEGORY_CODE_TO_LABEL: Record<ProjectCategoryCode, string> = {
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  CHUNGKATHON: '중커톤',
  ETC: '중커톤',
};

const PART_LABELS = {
  pm: '기획',
  design: '디자인',
  frontend: '프론트',
  backend: '백엔드',
} as const;
const KNOWN_PART_LABELS: string[] = Object.values(PART_LABELS);

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

interface ProjectUploadFormProps {
  mode?: 'create' | 'edit';
  initialData?: ProjectResponseDto;
}

const ProjectUploadForm = ({ mode = 'create', initialData }: ProjectUploadFormProps) => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const isEditMode = mode === 'edit';

  const sortedInitialImages = initialData
    ? [...initialData.images].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
  const initialImages =
    sortedInitialImages.length > 0
      ? Array.from({ length: MAX_IMAGE_COUNT }, (_, index) => sortedInitialImages[index]?.imageUrl ?? null)
      : Array(MAX_IMAGE_COUNT).fill(null);
  const initialFeaturedIndex = Math.max(
    sortedInitialImages.findIndex((image) => image.isMain),
    0,
  );

  const initialLinkRows: LinkRow[] = initialData
    ? initialData.links.map((link) => ({ id: nextId(), type: PLATFORM_TO_LINK_TYPE[link.platform], url: link.url }))
    : [];

  const initialExtraParts: ExtraPart[] = initialData
    ? Object.entries(
        initialData.members
          .filter((member) => !KNOWN_PART_LABELS.includes(member.part))
          .reduce<Record<string, string[]>>((acc, member) => {
            const key = member.part || '기타';
            acc[key] = [...(acc[key] ?? []), member.name];
            return acc;
          }, {}),
      ).map(([name, members]) => ({ id: nextId(), name, members }))
    : [];

  const membersByPart = (part: string) =>
    initialData?.members.filter((member) => member.part === part).map((member) => member.name) ?? [];

  const [images, setImages] = useState<(string | null)[]>(initialImages);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(Array(MAX_IMAGE_COUNT).fill(null));
  const [featuredIndex, setFeaturedIndex] = useState(initialFeaturedIndex);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
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
    setImageFiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [subtitle, setSubtitle] = useState(initialData?.tagline ?? '');
  const [description, setDescription] = useState(initialData?.summary ?? '');
  const [generation, onChangeGeneration] = useInput(
    initialData ? String(initialData.generationNumber) : '',
    NUMERIC_ONLY_REGEX,
  );
  const [category, setCategory] = useState(
    initialData ? CATEGORY_CODE_TO_LABEL[initialData.category] : PROJECT_CATEGORY_OPTIONS[0],
  );
  const [teamName, setTeamName] = useState(initialData?.teamName ?? '');
  const [pmMembers, setPmMembers] = useState<string[]>(membersByPart(PART_LABELS.pm));
  const [designMembers, setDesignMembers] = useState<string[]>(membersByPart(PART_LABELS.design));
  const [frontendMembers, setFrontendMembers] = useState<string[]>(membersByPart(PART_LABELS.frontend));
  const [backendMembers, setBackendMembers] = useState<string[]>(membersByPart(PART_LABELS.backend));
  const [extraParts, setExtraParts] = useState<ExtraPart[]>(initialExtraParts);
  const [dateRange, setDateRange] = useState<[string, string]>([
    initialData?.startDate ?? '',
    initialData?.endDate ?? '',
  ]);
  const [techStackItems, setTechStackItems] = useState<string[]>(
    initialData?.stack
      ? initialData.stack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  );
  const [banner, setBanner] = useState(initialData?.banner ?? '');
  const [linkRows, setLinkRows] = useState<LinkRow[]>(
    initialLinkRows.length > 0 ? initialLinkRows : [{ id: nextId(), type: LINK_TYPE_OPTIONS[0], url: '' }],
  );
  const [showErrors, setShowErrors] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { data: generations } = useQuery<GenerationListItem[]>({
    queryKey: ['generations'],
    queryFn: () => getGenerations(tokenState),
    enabled: !!tokenState.access,
  });
  const matchedGeneration = generations?.find((item) => item.number === Number(generation));

  const isEmpty = (value: string) => value.trim().length === 0;
  const isDateInvalid = isEmpty(dateRange[0]) || isEmpty(dateRange[1]);
  const isGenerationInvalid = !isEmpty(generation) && !matchedGeneration;
  const hasError =
    isEmpty(title) ||
    isEmpty(subtitle) ||
    isEmpty(description) ||
    isEmpty(generation) ||
    isGenerationInvalid ||
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

  const createMutation = useMutation({
    mutationFn: (payload: ProjectRequestPayload) => createProject(tokenState, payload),
  });
  const updateMutation = useMutation({
    mutationFn: (payload: ProjectRequestPayload) => updateProject(tokenState, initialData!.id, payload),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(tokenState, initialData!.id),
  });
  const isSubmitting = createMutation.isPending || updateMutation.isPending || isUploadingImages;

  const buildImagesPayload = async (): Promise<ProjectImagePayload[]> => {
    const filledIndices = images.map((image, index) => (image ? index : -1)).filter((index) => index !== -1);

    const imageUrls = await Promise.all(
      filledIndices.map((index) => {
        const file = imageFiles[index];
        return file ? uploadProjectImage(tokenState, file) : Promise.resolve(images[index] as string);
      }),
    );

    return filledIndices.map((index, order) => ({
      imageUrl: imageUrls[order],
      isMain: index === featuredIndex,
      displayOrder: order,
    }));
  };

  const buildPayload = (): ProjectRequestPayload | null => {
    if (!matchedGeneration) return null;

    const members: ProjectMemberPayload[] = [
      ...pmMembers.map((name) => ({ name, part: PART_LABELS.pm })),
      ...designMembers.map((name) => ({ name, part: PART_LABELS.design })),
      ...frontendMembers.map((name) => ({ name, part: PART_LABELS.frontend })),
      ...backendMembers.map((name) => ({ name, part: PART_LABELS.backend })),
      ...extraParts.flatMap((part) => part.members.map((name) => ({ name, part: part.name || '기타' }))),
    ];

    const links: ProjectLinkPayload[] = linkRows
      .filter((row) => row.url.trim())
      .map((row) => ({ platform: LINK_TYPE_TO_PLATFORM[row.type], url: row.url.trim() }));

    return {
      generationId: matchedGeneration.id,
      title,
      category: CATEGORY_LABEL_TO_CODE[category],
      stack: techStackItems.join(', '),
      tagline: subtitle,
      summary: description,
      teamName,
      startDate: dateRange[0],
      endDate: dateRange[1],
      banner: banner || undefined,
      images: [],
      links,
      members,
    };
  };

  const handleSubmit = async () => {
    if (hasError || isSubmitting) {
      setShowErrors(true);
      return;
    }
    const payload = buildPayload();
    if (!payload) {
      setShowErrors(true);
      return;
    }
    setSubmitError('');

    setIsUploadingImages(true);
    try {
      payload.images = await buildImagesPayload();
    } catch {
      setSubmitError('이미지 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.');
      setIsUploadingImages(false);
      return;
    }
    setIsUploadingImages(false);

    const mutation = isEditMode ? updateMutation : createMutation;
    mutation.mutate(payload, {
      onSuccess: () => setIsToastOpen(true),
      onError: () => setSubmitError('저장에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    });
  };

  const handleDelete = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteAlertOpen(false);
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.setItem(PROJECT_DELETED_FLAG_KEY, 'true');
        router.push('/project');
      },
      onError: () => setSubmitError('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    });
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
            status={showErrors && (isEmpty(generation) || isGenerationInvalid) ? 'negative' : 'normal'}
            description={
              showErrors && isEmpty(generation)
                ? '기수를 입력해 주세요.'
                : showErrors && isGenerationInvalid
                  ? '존재하지 않는 기수예요.'
                  : undefined
            }
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
              value={row.type}
              options={[row.type, ...availableLinkTypes]}
              onChange={(type) => setLinkRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, type } : r)))}
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
            <Button variant="solid" color="primary" size="large" onClick={handleSubmit} disabled={isSubmitting}>
              수정하기
            </Button>
            <Button variant="outlined" color="assistive" size="large" onClick={handleDelete}>
              삭제하기
            </Button>
          </EditActionGroup>
        ) : (
          <>
            <ActionDescription>등록 후 수정할 수 있어요</ActionDescription>
            <Button variant="solid" color="primary" size="large" onClick={handleSubmit} disabled={isSubmitting}>
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
        <Toast variant="negative" text={submitError} show={!!submitError} onHidden={() => setSubmitError('')} />
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

const LinkTypeSelect = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <LinkTypeWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <LinkTypeTrigger
        ref={triggerRef}
        tabIndex={0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-label="링크 타입 선택"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <LinkTypeIconSlot>{LINK_TYPE_ICON[value]}</LinkTypeIconSlot>
        <LinkTypeChevronSlot $open={isOpen}>
          <IcChevronDown width={16} height={16} />
        </LinkTypeChevronSlot>
      </LinkTypeTrigger>
      {isOpen && (
        <LinkTypeMenu role="listbox" id={listId}>
          {options.map((option, index) => (
            <LinkTypeMenuItem
              key={option}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              aria-selected={value === option}
              $active={index === activeIndex}
              onClick={() => selectOption(option, index)}
            >
              <LinkTypeIconSlot>{LINK_TYPE_ICON[option]}</LinkTypeIconSlot>
              <LinkTypeMenuLabel>{LINK_TYPE_LABEL[option]}</LinkTypeMenuLabel>
            </LinkTypeMenuItem>
          ))}
        </LinkTypeMenu>
      )}
    </LinkTypeWrapper>
  );
};

const LinkTypeWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: fit-content;
`;

const LinkTypeTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
  cursor: pointer;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const LinkTypeIconSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${Label.normal};
`;

const LinkTypeChevronSlot = styled.span<{ $open: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${Label.normal};
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
  transition: transform 0.15s ease;
`;

const LinkTypeMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: max-content;
  min-width: 160px;
  max-height: 400px;
  padding: 8px;
  overflow: auto;
  border: 1px solid ${Line.neutral};
  border-radius: 16px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 2px 4px -2px rgba(23, 23, 23, 0.06),
    0px 4px 6px -1px rgba(23, 23, 23, 0.06);
`;

const LinkTypeMenuItem = styled.button<{ $active: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  background-color: ${(props) => (props.$active ? 'rgba(23, 23, 25, 0.04)' : 'transparent')};
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: rgba(23, 23, 25, 0.04);
  }
`;

const LinkTypeMenuLabel = styled.span`
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}
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
