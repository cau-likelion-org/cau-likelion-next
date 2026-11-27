import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import Button from '@common/button/Button';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import Radio from '@common/radio/Radio';
import ScrollArea from '@common/scrollArea/ScrollArea';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import CharCount from '@common/charCount/CharCount';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import ListboxSelect from '@common/select/ListboxSelect';
import ImageSlotUploader from '@common/imageSlotUploader/ImageSlotUploader';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import { IcLineHorizontal } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import useInput from 'src/hooks/useInput';
import useTokenStore from 'src/store/useTokenStore';
import { UploadDomain, uploadFile } from 'src/apis/upload';
import { getGenerations } from 'src/apis/account';
import { NUMERIC_ONLY_REGEX } from '@utils/constant';
import { BackgroundColor, Label, Line } from '@utils/constant/color';
import { isUnfilled } from '@utils/validation';
import { resizeImageFile } from '@utils/resizeImage';
import useImageSlots from 'src/hooks/useImageSlots';
import { Typography, typographyCss } from '@utils/constant/typography';
const MAX_IMAGE_COUNT = 10;
const TITLE_PLACEHOLDER: Record<PostType, string> = {
  session: '세션명을 입력해주세요.',
  project: '게시물 제목을 입력해주세요.',
  gallery: '게시물 제목을 입력해주세요.',
};
const CONTENT_PLACEHOLDER: Record<PostType, string> = {
  session: '세션 내용을 입력해주세요.',
  project: '사진에 대한 설명을 입력해주세요.',
  gallery: '사진에 대한 설명을 입력해주세요.',
};
// 두 자리 기수를 입력하는 도중(예: "1" → "13") 검증이 앞서 트리거되지 않도록 입력이 멈춘 뒤에만 검증
const GENERATION_VALIDATION_DELAY = 1500;
// 2021년(9기)부터의 활동만 아카이빙 대상
const MIN_ALLOWED_GENERATION_NUMBER = 9;
const GENERATION_BEFORE_CUTOFF_MESSAGE = '2021년 이후 사진만 등록이 가능합니다.';
const GENERATION_NOT_FOUND_MESSAGE = '활동 이력이 없는 기수입니다. 다시 입력해주세요.';

const POST_TYPE_LABEL: Record<PostType, string> = {
  session: '세션',
  project: '프로젝트',
  gallery: '추억',
};

const POST_TYPE_TO_UPLOAD_DOMAIN: Record<PostType, UploadDomain> = {
  session: 'SESSION',
  project: 'PROJECT',
  gallery: 'HISTORY',
};

export type PostType = 'session' | 'project' | 'gallery';

export interface PostUploadModalInitialValues {
  title?: string;
  content?: string;
  generation?: string;
  category?: string;
  week?: string;
  date?: string;
  dateRange?: [string, string];
  imageUrls?: string[];
  thumbnailUrl?: string;
}

export interface PostUploadModalCategoryConfig {
  label: string;
  options: string[];
}

export interface PostUploadModalSubmitValues {
  title: string;
  content: string;
  generation: string;
  category?: string;
  week?: string;
  date?: string;
  dateRange?: [string, string];
  imageUrls: string[];
  thumbnailUrl?: string;
}

export interface PostUploadModalProps {
  onClose: () => void;
  postType: PostType;
  category?: PostUploadModalCategoryConfig;
  showWeekField?: boolean;
  dateFieldLabel: string;
  dateMode: 'single' | 'range';
  mode?: 'create' | 'edit';
  initialValues?: PostUploadModalInitialValues;
  onDelete?: () => Promise<void>;
  onSubmit?: (values: PostUploadModalSubmitValues) => Promise<void>;
}

const toUploadImage = (file: File) => resizeImageFile(file, 'image/webp');

const PostUploadModal = ({
  onClose,
  postType,
  category: categoryConfig,
  showWeekField = false,
  dateFieldLabel,
  dateMode,
  mode = 'create',
  initialValues,
  onDelete,
  onSubmit,
}: PostUploadModalProps) => {
  const tokenState = useTokenStore((state) => state.token);
  const uploadDomain = POST_TYPE_TO_UPLOAD_DOMAIN[postType];

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [generation, onChangeGeneration] = useInput(initialValues?.generation ?? '', NUMERIC_ONLY_REGEX);
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [week, onChangeWeek] = useInput(initialValues?.week ?? '', NUMERIC_ONLY_REGEX);
  const [date, setDate] = useState(initialValues?.date ?? '');
  const [dateRange, setDateRange] = useState<[string, string]>(initialValues?.dateRange ?? ['', '']);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  // 같은 문구를 다시 setErrorToast로 넘기면 값이 동일해 리렌더가 스킵되어 토스트가
  // 다시 뜨지 않는다. key를 바꿔 Toast를 강제로 새로 마운트시켜 항상 다시 노출되게 한다.
  const [toastKey, setToastKey] = useState(0);

  const { data: generations } = useQuery({ queryKey: ['generations'], queryFn: getGenerations });

  const [debouncedGeneration, setDebouncedGeneration] = useState(generation);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedGeneration(generation), GENERATION_VALIDATION_DELAY);
    return () => clearTimeout(timer);
  }, [generation]);

  const generationNumber = Number(debouncedGeneration);
  const isGenerationBeforeCutoff = debouncedGeneration.length > 0 && generationNumber < MIN_ALLOWED_GENERATION_NUMBER;
  const matchedGeneration = generations?.find((item) => item.number === generationNumber);
  const isGenerationNotFound =
    debouncedGeneration.length > 0 && !isGenerationBeforeCutoff && !!generations && !matchedGeneration;
  const generationError = isGenerationBeforeCutoff
    ? GENERATION_BEFORE_CUTOFF_MESSAGE
    : isGenerationNotFound
      ? GENERATION_NOT_FOUND_MESSAGE
      : '';

  const [prevDebouncedGeneration, setPrevDebouncedGeneration] = useState(debouncedGeneration);
  if (debouncedGeneration !== prevDebouncedGeneration) {
    setPrevDebouncedGeneration(debouncedGeneration);
    if (generationError) {
      setErrorToast(generationError);
      setToastKey((prev) => prev + 1);
    }
  }

  const categoryOptions =
    postType === 'session'
      ? (matchedGeneration?.parts.map((part) => part.name) ?? [])
      : (categoryConfig?.options ?? []);
  const categoryOptionsKey = categoryOptions.join(' ');
  const [prevCategoryOptionsKey, setPrevCategoryOptionsKey] = useState(categoryOptionsKey);
  if (categoryOptionsKey !== prevCategoryOptionsKey) {
    setPrevCategoryOptionsKey(categoryOptionsKey);
    if (category && !categoryOptions.includes(category)) setCategory('');
  }

  const initialImageUrls = initialValues?.imageUrls ?? [];
  const initialImages =
    initialImageUrls.length > 0
      ? Array.from({ length: MAX_IMAGE_COUNT }, (_, index) => initialImageUrls[index] ?? null)
      : Array(MAX_IMAGE_COUNT).fill(null);
  const initialFeaturedIndex = Math.max(
    initialValues?.thumbnailUrl ? initialImageUrls.indexOf(initialValues.thumbnailUrl) : 0,
    0,
  );
  const imageSlots = useImageSlots({
    maxCount: MAX_IMAGE_COUNT,
    initialImages,
    initialFeaturedIndex,
    prepareFile: toUploadImage,
  });
  const { images, imageFiles, featuredIndex, isPreparing } = imageSlots;

  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);
  const { showErrors, validate } = useRequiredFieldsSave(modalRef);
  const modalAriaLabel = `${POST_TYPE_LABEL[postType]} ${mode === 'edit' ? '수정' : '추가'}`;

  // 썸네일(드래그 가능한 이미지) 바깥 영역에서 시작한 드래그만 좌우 스크롤로 처리하고,
  // 이미지 위에서 시작한 드래그는 네이티브 HTML5 드래그(순서 변경)에 맡긴다.
  const isDateMissing = dateMode === 'single' ? isUnfilled(date) : isUnfilled(dateRange[0]) || isUnfilled(dateRange[1]);
  const isDateOrderInvalid = dateMode === 'range' && !isDateMissing && dateRange[1] < dateRange[0];
  const isDateInvalid = isDateMissing || isDateOrderInvalid;
  const hasError =
    isUnfilled(title) ||
    isUnfilled(content) ||
    isUnfilled(generation) ||
    !!generationError ||
    (!!categoryConfig && isUnfilled(category)) ||
    (showWeekField && isUnfilled(week)) ||
    isDateInvalid;

  const handleSubmit = async () => {
    if (!validate(hasError)) return;
    if (!onSubmit) {
      onClose();
      return;
    }

    setErrorToast('');
    setIsSubmitting(true);
    try {
      const filledIndices = images.map((image, index) => (image ? index : -1)).filter((index) => index !== -1);
      const imageUrls = await Promise.all(
        filledIndices.map((index) => {
          const file = imageFiles[index];
          return file
            ? uploadFile(tokenState, uploadDomain, file).then((res) => res.url)
            : Promise.resolve(images[index] as string);
        }),
      );
      const featuredPosition = filledIndices.indexOf(featuredIndex);
      const thumbnailUrl = featuredPosition !== -1 ? imageUrls[featuredPosition] : undefined;

      await onSubmit({ title, content, generation, category, week, date, dateRange, imageUrls, thumbnailUrl });
      onClose();
    } catch {
      setErrorToast('저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setErrorToast('');
    setIsSubmitting(true);
    try {
      await onDelete();
      onClose();
    } catch {
      setErrorToast('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <Modal ref={modalRef} role="dialog" aria-modal="true" aria-label={modalAriaLabel} tabIndex={-1}>
        <ModalScrollArea>
          <Information>
            <ImageSlotUploader slots={imageSlots} maxCount={MAX_IMAGE_COUNT} addable />

            <FieldGroup>
              <FieldHeading>
                제목
                <Required>*</Required>
              </FieldHeading>
              <TitleTextarea
                placeholder={TITLE_PLACEHOLDER[postType]}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={70}
                resize="fixed"
                bottomTrailingContent={<CharCount>{title.length}/70</CharCount>}
                status={showErrors && isUnfilled(title) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(title) ? '제목을 입력해 주세요.' : undefined}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldHeading>
                내용
                <Required>*</Required>
              </FieldHeading>
              <ContentTextarea
                placeholder={CONTENT_PLACEHOLDER[postType]}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={300}
                resize="fixed"
                bottomTrailingContent={<CharCount>{content.length}/300</CharCount>}
                status={showErrors && isUnfilled(content) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(content) ? '내용을 입력해 주세요.' : undefined}
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
                  status={generationError ? 'negative' : showErrors && isUnfilled(generation) ? 'negative' : 'normal'}
                  description={showErrors && isUnfilled(generation) ? '기수를 입력해 주세요.' : undefined}
                />
              </NarrowField>
              {categoryConfig && (
                <ListboxSelect
                  heading={categoryConfig.label}
                  required
                  placeholder="선택"
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                  disabled={postType === 'session' && (isUnfilled(generation) || !!generationError)}
                  status={showErrors && isUnfilled(category) ? 'negative' : 'normal'}
                  description={
                    showErrors && isUnfilled(category) ? `${categoryConfig.label}을 선택해 주세요.` : undefined
                  }
                />
              )}
              {showWeekField && (
                <NarrowField>
                  <TextField
                    heading="주차 구분"
                    required
                    placeholder="숫자 입력"
                    value={week}
                    onChange={onChangeWeek}
                    status={showErrors && isUnfilled(week) ? 'negative' : 'normal'}
                    description={showErrors && isUnfilled(week) ? '주차를 입력해 주세요.' : undefined}
                  />
                </NarrowField>
              )}
            </Row>

            <Row>
              <RowField $gap={8}>
                <FieldHeadingSmall>
                  게시물 유형
                  <RequiredSmall>*</RequiredSmall>
                </FieldHeadingSmall>
                <RadioRow>
                  <RadioItem>
                    <Radio
                      label="세션"
                      checked={postType === 'session'}
                      disabled={postType !== 'session'}
                      onChange={() => {}}
                    />
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      label="프로젝트"
                      checked={postType === 'project'}
                      disabled={postType !== 'project'}
                      onChange={() => {}}
                    />
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      label="추억"
                      checked={postType === 'gallery'}
                      disabled={postType !== 'gallery'}
                      onChange={() => {}}
                    />
                  </RadioItem>
                </RadioRow>
              </RowField>
              <RowField $gap={8}>
                <FieldHeadingSmall>
                  {dateFieldLabel}
                  <RequiredSmall>*</RequiredSmall>
                </FieldHeadingSmall>
                <DateField
                  mode={dateMode}
                  value={date}
                  onChange={setDate}
                  rangeValue={dateRange}
                  onRangeChange={(index, value) =>
                    setDateRange((prev) => (index === 0 ? [value, prev[1]] : [prev[0], value]))
                  }
                  invalid={showErrors && isDateInvalid}
                />
                {showErrors && isDateMissing && (
                  <FieldDescription $status="negative">날짜를 선택해 주세요.</FieldDescription>
                )}
                {showErrors && isDateOrderInvalid && (
                  <FieldDescription $status="negative">종료일은 시작일 이후로 선택해 주세요.</FieldDescription>
                )}
              </RowField>
            </Row>
          </Information>
        </ModalScrollArea>
        <Actions $mode={mode}>
          {mode === 'edit' &&
            (isConfirmingDelete ? (
              <DeleteConfirm>
                <DeleteConfirmText>정말 삭제하시겠습니까?</DeleteConfirmText>
                <DeleteConfirmActions>
                  <TextButton size="small" color="assistive" onClick={() => setIsConfirmingDelete(false)}>
                    아니요
                  </TextButton>
                  <TextButton size="small" color="primary" onClick={handleConfirmDelete} disabled={isSubmitting}>
                    삭제
                  </TextButton>
                </DeleteConfirmActions>
              </DeleteConfirm>
            ) : (
              <Button variant="solid" color="assistive" size="large" onClick={() => setIsConfirmingDelete(true)}>
                삭제
              </Button>
            ))}
          <ActionGroup>
            <Button variant="outlined" color="assistive" size="large" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="solid"
              color="primary"
              size="large"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!!generationError || isPreparing}
            >
              {mode === 'edit' ? '저장하기' : '등록하기'}
            </Button>
          </ActionGroup>
        </Actions>
      </Modal>
      <ToastWrapper>
        <Toast
          key={toastKey}
          variant="negative"
          text={errorToast}
          show={!!errorToast}
          onHidden={() => setErrorToast('')}
        />
      </ToastWrapper>
    </ModalOverlay>
  );
};

export default PostUploadModal;

const DateField = ({
  mode,
  value,
  onChange,
  rangeValue,
  onRangeChange,
  invalid = false,
}: {
  mode: 'single' | 'range';
  value?: string;
  onChange?: (value: string) => void;
  rangeValue?: [string, string];
  onRangeChange?: (index: 0 | 1, value: string) => void;
  invalid?: boolean;
}) => {
  if (mode === 'single') {
    return (
      <DateTimeInput
        placeholder="날짜 선택"
        aria-label="일자"
        value={value ?? ''}
        onChange={(next) => onChange?.(next)}
        status={invalid ? 'negative' : 'normal'}
      />
    );
  }

  return (
    <DateRangeRow>
      <DateRangeItem>
        <DateTimeInput
          placeholder="날짜 선택"
          aria-label="시작일"
          value={rangeValue?.[0] ?? ''}
          onChange={(next) => onRangeChange?.(0, next)}
          status={invalid ? 'negative' : 'normal'}
        />
      </DateRangeItem>
      <DateRangeDivider width={16} height={16} />
      <DateRangeItem>
        <DateTimeInput
          placeholder="날짜 선택"
          aria-label="종료일"
          value={rangeValue?.[1] ?? ''}
          onChange={(next) => onRangeChange?.(1, next)}
          status={invalid ? 'negative' : 'normal'}
        />
      </DateRangeItem>
    </DateRangeRow>
  );
};

const Modal = styled.div`
  position: relative;
  width: 1040px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  outline: none;
  z-index: 10000;
`;

const ModalScrollArea = styled(ScrollArea)`
  flex: 1 1 auto;
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
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
  color: #ff4242;
  ${typographyCss(Typography.title3.bold)}
`;

const RequiredSmall = styled.span`
  color: #ff4242;
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

const RowField = styled.div<{ $gap?: number }>`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.$gap ?? 0}px;
`;

const NarrowField = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

const RadioRow = styled.div`
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RadioItem = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const DateRangeRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateRangeItem = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

const Actions = styled.div<{ $mode: 'create' | 'edit' }>`
  width: 100%;
  padding: 0 28px 20px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$mode === 'edit' ? 'space-between' : 'flex-end')};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const DeleteConfirm = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 10px 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px ${Line.normal};
`;

const DeleteConfirmText = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Label.normal};
  margin: 0;
`;

const DeleteConfirmActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;
