import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import LeaveConfirmAlert from '@common/alert/LeaveConfirmAlert';
import BackHeader from '@common/header/BackHeader';
import Button from '@common/button/Button';
import CharCount from '@common/charCount/CharCount';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import ImageSlotUploader from '@common/imageSlotUploader/ImageSlotUploader';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import ListboxSelect from '@common/select/ListboxSelect';
import ChipInput from '@common/chipInput/ChipInput';
import { Generation } from '@@types/request';
import {
  LinkPlatform,
  PROJECT_CATEGORY_LABEL,
  PROJECT_CREATED_FLAG_KEY,
  PROJECT_DELETED_FLAG_KEY,
  PROJECT_UPDATED_FLAG_KEY,
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
import useImageSlots from 'src/hooks/useImageSlots';
import useTokenStore from 'src/store/useTokenStore';
import { IcLineHorizontal } from '@assets/svg';
import useInput from 'src/hooks/useInput';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import { NUMERIC_ONLY_REGEX, PROJECT_CATEGORY_OPTIONS } from '@utils/constant';
import { Black, Label, State } from '@utils/constant/color';
import { invertRecord } from '@utils/index';
import { isUnfilled } from '@utils/validation';
import { resizeImageFile } from '@utils/resizeImage';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss } from '@utils/constant/breakpoint';
import ExtraPartFields, { ExtraPart } from './ExtraPartFields';
import LinkFields, { LINK_TYPE_OPTIONS, LinkRow } from './LinkFields';

const MAX_IMAGE_COUNT = 4;
const MAX_BANNER_LENGTH = 15;
// 한글이 하나라도 섞이면 16자, 순수 영문·숫자면 20자 (모두 공백 포함)
const MAX_TITLE_LENGTH_KO = 16;
const MAX_TITLE_LENGTH_EN = 20;
const HANGUL_REGEX = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const getMaxTitleLength = (value: string) => (HANGUL_REGEX.test(value) ? MAX_TITLE_LENGTH_KO : MAX_TITLE_LENGTH_EN);
const CONTENT_PLACEHOLDER = '서비스 기획 배경, 핵심 기능 등을 자유롭게 입력해주세요.';

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

const CATEGORY_CODE_TO_LABEL = PROJECT_CATEGORY_LABEL;
const CATEGORY_LABEL_TO_CODE: Record<string, ProjectCategoryCode> = invertRecord(CATEGORY_CODE_TO_LABEL);

const PART_LABELS = {
  pm: '기획',
  design: '디자인',
  frontend: '프론트엔드',
  backend: '백엔드',
} as const;
const KNOWN_PART_LABELS: string[] = Object.values(PART_LABELS);

interface ProjectUploadFormProps {
  mode?: 'create' | 'edit';
  initialData?: ProjectResponseDto;
}

const ProjectUploadForm = ({ mode = 'create', initialData }: ProjectUploadFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tokenState = useTokenStore((state) => state.token);
  const isEditMode = mode === 'edit';

  const idCounterRef = useRef(0);
  const nextId = () => {
    idCounterRef.current += 1;
    return idCounterRef.current;
  };

  const formRef = useRef<HTMLDivElement>(null);

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

  const imageSlots = useImageSlots({ maxCount: MAX_IMAGE_COUNT, initialImages, initialFeaturedIndex });
  const { images, imageFiles, featuredIndex } = imageSlots;
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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
  const { showErrors, validate } = useRequiredFieldsSave(formRef);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const formSnapshot = JSON.stringify({
    images,
    imageFiles: imageFiles.map(Boolean),
    featuredIndex,
    title,
    subtitle,
    description,
    generation,
    category,
    teamName,
    pmMembers,
    designMembers,
    frontendMembers,
    backendMembers,
    extraParts,
    dateRange,
    techStackItems,
    banner,
    linkRows,
  });
  const [initialSnapshot] = useState(formSnapshot);
  const { isConfirmOpen, confirmLeave, cancelLeave, allowLeave } = useLeaveGuard(formSnapshot !== initialSnapshot);

  const { data: generations, isError: isGenerationsError } = useQuery<Generation[]>({
    queryKey: ['generations'],
    queryFn: () => getGenerations(tokenState),
    enabled: !!tokenState.access,
  });
  const matchedGeneration = generations?.find((item) => item.number === Number(generation));

  const isDateMissing = isUnfilled(dateRange[0]) || isUnfilled(dateRange[1]);
  const isDateOrderInvalid = !isDateMissing && dateRange[1] < dateRange[0];
  const isDateInvalid = isDateMissing || isDateOrderInvalid;
  // 저장에는 generationId가 필요하므로 목록을 못 받은 경우에도 제출은 막되, 원인은 구분해서 안내한다
  const isGenerationUnresolved = !isUnfilled(generation) && !matchedGeneration;
  const isGenerationInvalid = isGenerationUnresolved && !!generations;
  const maxTitleLength = getMaxTitleLength(title);
  const isTitleOverflow = title.length > maxTitleLength;
  const isSubtitleOverflow = subtitle.length > 80;
  const isDescriptionOverflow = description.length > 300;
  const hasError =
    isUnfilled(title) ||
    isTitleOverflow ||
    isUnfilled(subtitle) ||
    isSubtitleOverflow ||
    isUnfilled(description) ||
    isDescriptionOverflow ||
    isUnfilled(generation) ||
    isGenerationUnresolved ||
    isUnfilled(category) ||
    isUnfilled(teamName) ||
    isDateInvalid;

  // 영문만 있을 땐 20자지만 한글이 섞이는 순간 한도가 16자로 줄어든다. 한도를 넘기는 입력은 막되,
  // 이미 입력된 글자를 잘라내지는 않는다(지우는 방향은 항상 허용).
  const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (next.length > title.length && next.length > getMaxTitleLength(next)) return;
    setTitle(next);
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
        return file
          ? resizeImageFile(file, 'image/webp').then((converted) => uploadProjectImage(tokenState, converted))
          : Promise.resolve(images[index] as string);
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

    const categoryCode = CATEGORY_LABEL_TO_CODE[category];
    if (!categoryCode) return null;

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
      category: categoryCode,
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
    if (isSubmitting || !validate(hasError)) return;
    const payload = buildPayload();
    if (!payload) {
      validate(true);
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
      onSuccess: () => {
        // 폼은 initialData로 state를 최초 1회만 초기화하므로,
        // 캐시가 남아 있으면 다시 수정에 들어왔을 때 저장 전 데이터로 초기화된다
        if (isEditMode) queryClient.removeQueries({ queryKey: ['adminProject', initialData!.id] });
        sessionStorage.setItem(isEditMode ? PROJECT_UPDATED_FLAG_KEY : PROJECT_CREATED_FLAG_KEY, 'true');
        allowLeave();
        router.push('/project');
      },
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
        queryClient.removeQueries({ queryKey: ['adminProject', initialData!.id] });
        sessionStorage.setItem(PROJECT_DELETED_FLAG_KEY, 'true');
        allowLeave();
        router.push('/project');
      },
      onError: () => setSubmitError('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.'),
    });
  };

  return (
    <Wrapper ref={formRef}>
      <BackHeader label="프로젝트 목록으로 돌아가기" onClick={handleCancel} />
      <PageTitle>{isEditMode ? '프로젝트 수정하기' : '프로젝트 추가하기'}</PageTitle>
      <FormContent>
        <ImageSlotUploader slots={imageSlots} maxCount={MAX_IMAGE_COUNT} />

        <FieldGroup>
          <FieldHeading>
            서비스명
            <Required>*</Required>
          </FieldHeading>
          <TitleTextarea
            placeholder={`서비스명을 입력해주세요. (국문 포함 ${MAX_TITLE_LENGTH_KO}자/영문 ${MAX_TITLE_LENGTH_EN}자)`}
            value={title}
            onChange={handleTitleChange}
            resize="fixed"
            maxLength={maxTitleLength}
            bottomTrailingContent={<CharCount>{title.length}</CharCount>}
            status={showErrors && (isUnfilled(title) || isTitleOverflow) ? 'negative' : 'normal'}
            description={
              showErrors && isUnfilled(title)
                ? '서비스명을 입력해 주세요.'
                : showErrors && isTitleOverflow
                  ? `${maxTitleLength}자 이내로 입력해 주세요.`
                  : undefined
            }
          />
        </FieldGroup>

        <FieldGroup>
          <FieldHeading>
            서비스 한줄소개
            <Required>*</Required>
          </FieldHeading>
          <TitleTextarea
            placeholder="서비스 한줄소개를 입력해주세요."
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value.slice(0, 80))}
            resize="fixed"
            maxLength={80}
            bottomTrailingContent={<CharCount>{subtitle.length}/80</CharCount>}
            status={showErrors && (isUnfilled(subtitle) || isSubtitleOverflow) ? 'negative' : 'normal'}
            description={
              showErrors && isUnfilled(subtitle)
                ? '서비스 한줄소개를 입력해 주세요.'
                : showErrors && isSubtitleOverflow
                  ? '80자 이내로 입력해 주세요.'
                  : undefined
            }
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
            onChange={(event) => setDescription(event.target.value.slice(0, 300))}
            resize="fixed"
            maxLength={300}
            bottomTrailingContent={<CharCount>{description.length}/300</CharCount>}
            status={showErrors && (isUnfilled(description) || isDescriptionOverflow) ? 'negative' : 'normal'}
            description={
              showErrors && isUnfilled(description)
                ? '서비스 설명을 입력해 주세요.'
                : showErrors && isDescriptionOverflow
                  ? '300자 이내로 입력해 주세요.'
                  : undefined
            }
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
              status={showErrors && (isUnfilled(generation) || isGenerationUnresolved) ? 'negative' : 'normal'}
              description={
                showErrors && isUnfilled(generation)
                  ? '기수를 입력해 주세요.'
                  : showErrors && isGenerationsError
                    ? '기수 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
                    : showErrors && isGenerationInvalid
                      ? '존재하지 않는 기수예요.'
                      : undefined
              }
            />
          </NarrowField>
          <ListboxSelect
            heading="프로젝트 구분"
            required
            options={PROJECT_CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            status={showErrors && isUnfilled(category) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(category) ? '프로젝트 구분을 선택해 주세요.' : undefined}
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
              status={showErrors && isUnfilled(teamName) ? 'negative' : 'normal'}
              description={showErrors && isUnfilled(teamName) ? '팀명을 입력해 주세요.' : undefined}
            />
            <FieldGroup>
              <FieldHeadingSmall>기획</FieldHeadingSmall>
              <ChipInput placeholder="텍스트 입력 후 띄어쓰기" value={pmMembers} onChange={setPmMembers} />
            </FieldGroup>
            <FieldGroup>
              <FieldHeadingSmall>디자인</FieldHeadingSmall>
              <ChipInput placeholder="텍스트 입력 후 띄어쓰기" value={designMembers} onChange={setDesignMembers} />
            </FieldGroup>
            <FieldGroup>
              <FieldHeadingSmall>프론트엔드</FieldHeadingSmall>
              <ChipInput placeholder="텍스트 입력 후 띄어쓰기" value={frontendMembers} onChange={setFrontendMembers} />
            </FieldGroup>
            <FieldGroup>
              <FieldHeadingSmall>백엔드</FieldHeadingSmall>
              <ChipInput placeholder="텍스트 입력 후 띄어쓰기" value={backendMembers} onChange={setBackendMembers} />
            </FieldGroup>
            <ExtraPartFields parts={extraParts} onChange={setExtraParts} nextId={nextId} />
          </TeamColumn>
          <TeamColumn>
            <DateFieldGroup>
              <FieldHeadingSmall>
                프로젝트 기간
                <RequiredSmall>*</RequiredSmall>
              </FieldHeadingSmall>
              <DateRangeRow>
                <DateTimeInput
                  placeholder="시작일 선택"
                  aria-label="시작일"
                  value={dateRange[0]}
                  onChange={(next) => setDateRange([next, dateRange[1]])}
                  status={showErrors && isDateInvalid ? 'negative' : 'normal'}
                />
                <DateRangeDivider width={16} height={16} />
                <DateTimeInput
                  placeholder="종료일 선택"
                  aria-label="종료일"
                  value={dateRange[1]}
                  min={dateRange[0] || undefined}
                  onChange={(next) => setDateRange([dateRange[0], next])}
                  status={showErrors && isDateInvalid ? 'negative' : 'normal'}
                />
              </DateRangeRow>
              {showErrors && isDateMissing && (
                <FieldDescription $status="negative">프로젝트 기간을 선택해 주세요.</FieldDescription>
              )}
              {showErrors && isDateOrderInvalid && (
                <FieldDescription $status="negative">종료일은 시작일 이후로 선택해 주세요.</FieldDescription>
              )}
            </DateFieldGroup>
            <FieldGroup>
              <FieldHeadingSmall>기술스택</FieldHeadingSmall>
              <ChipInput placeholder="텍스트 입력 후 띄어쓰기" value={techStackItems} onChange={setTechStackItems} />
            </FieldGroup>
            <TextField
              heading="배너 추가하기"
              placeholder="예시) 2026 해커톤 본선진출작"
              value={banner}
              onChange={(event) => setBanner(event.target.value.slice(0, MAX_BANNER_LENGTH))}
              maxLength={MAX_BANNER_LENGTH}
              trailingContent={
                <CharCount>
                  {banner.length}/{MAX_BANNER_LENGTH}
                </CharCount>
              }
            />
          </TeamColumn>
        </TeamRow>

        <FieldGroup>
          <LinkHeading>링크첨부</LinkHeading>
          <LinkFields rows={linkRows} onChange={setLinkRows} nextId={nextId} />
        </FieldGroup>

        <ActionArea>
          {isEditMode ? (
            <EditActionGroup>
              <Button
                variant="solid"
                color="primary"
                size="large"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={deleteMutation.isPending}
              >
                수정하기
              </Button>
              <Button
                variant="outlined"
                color="assistive"
                size="large"
                onClick={handleDelete}
                loading={deleteMutation.isPending}
                disabled={isSubmitting}
              >
                삭제하기
              </Button>
            </EditActionGroup>
          ) : (
            <>
              <ActionDescription>등록 후 수정할 수 있어요</ActionDescription>
              <Button variant="solid" color="primary" size="large" onClick={handleSubmit} loading={isSubmitting}>
                등록하기
              </Button>
            </>
          )}
        </ActionArea>
      </FormContent>

      <ToastWrapper>
        <Toast variant="negative" text={submitError} show={!!submitError} onHidden={() => setSubmitError('')} />
      </ToastWrapper>

      {isConfirmOpen && <LeaveConfirmAlert onCancel={cancelLeave} onConfirm={confirmLeave} />}
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${containerCss}
  padding-bottom: 80px;
`;

const PageTitle = styled.h2`
  margin: 0 0 42px;
  color: ${Black.b900};
  ${typographyCss(Typography.display3.bold)}
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
  width: 100%;
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

const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

const LinkHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
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
