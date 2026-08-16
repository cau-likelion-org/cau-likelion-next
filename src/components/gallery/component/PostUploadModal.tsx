import { ChangeEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '@common/button/Button';
import Radio from '@common/radio/Radio';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import CharCount from '@common/charCount/CharCount';
import Toast from '@common/toast/Toast';
import { IcAdd, IcCalendar, IcCircleExclamation, IcCloseCircle, IcLineHorizontal } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useInput from 'src/hooks/useInput';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useTokenStore from 'src/store/useTokenStore';
import { UploadDomain, uploadFile } from 'src/apis/upload';
import { NUMERIC_ONLY_REGEX } from '@utils/constant';
import { BackgroundColor, Fill, Label, Line, Material, Orange, State } from '@utils/constant/color';
import { isUnfilled } from '@utils/index';
import { Typography, typographyCss } from '@utils/constant/typography';
const MAX_IMAGE_COUNT = 10;
const CONTENT_PLACEHOLDER = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

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
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const initialImageUrls = initialValues?.imageUrls ?? [];
  const initialImages =
    initialImageUrls.length > 0
      ? Array.from({ length: MAX_IMAGE_COUNT }, (_, index) => initialImageUrls[index] ?? null)
      : Array(MAX_IMAGE_COUNT).fill(null);
  const initialFeaturedIndex = Math.max(
    initialValues?.thumbnailUrl ? initialImageUrls.indexOf(initialValues.thumbnailUrl) : 0,
    0,
  );
  const [images, setImages] = useState<(string | null)[]>(initialImages);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(Array(MAX_IMAGE_COUNT).fill(null));
  const [featuredIndex, setFeaturedIndex] = useState(initialFeaturedIndex);

  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);
  const modalAriaLabel = `${POST_TYPE_LABEL[postType]} ${mode === 'edit' ? '수정' : '추가'}`;

  const handleFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    const hadNoImages = images.every((image) => image === null);

    const targets: { targetIndex: number; file: File }[] = [];
    let cursor = index;
    for (const file of files) {
      while (cursor < MAX_IMAGE_COUNT && images[cursor] !== null) cursor++;
      if (cursor >= MAX_IMAGE_COUNT) break;
      targets.push({ targetIndex: cursor, file });
      cursor++;
    }
    if (targets.length === 0) return;

    setImages((prev) => {
      const next = [...prev];
      targets.forEach(({ targetIndex, file }) => {
        if (next[targetIndex]) URL.revokeObjectURL(next[targetIndex] as string);
        next[targetIndex] = URL.createObjectURL(file);
      });
      return next;
    });
    setImageFiles((prev) => {
      const next = [...prev];
      targets.forEach(({ targetIndex, file }) => {
        next[targetIndex] = file;
      });
      return next;
    });
    if (hadNoImages) setFeaturedIndex(targets[0].targetIndex);
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

  const isDateInvalid = dateMode === 'single' ? isUnfilled(date) : isUnfilled(dateRange[0]) || isUnfilled(dateRange[1]);
  const hasError =
    isUnfilled(title) ||
    isUnfilled(content) ||
    isUnfilled(generation) ||
    (!!categoryConfig && isUnfilled(category)) ||
    (showWeekField && isUnfilled(week)) ||
    isDateInvalid;

  const handleSubmit = async () => {
    if (hasError) {
      setShowErrors(true);
      return;
    }
    if (!onSubmit) {
      onClose();
      return;
    }

    setSubmitError('');
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
      setSubmitError('저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await onDelete();
      onClose();
    } catch {
      setSubmitError('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <Backdrop>
      <Modal ref={modalRef} role="dialog" aria-modal="true" aria-label={modalAriaLabel} tabIndex={-1}>
        <Information>
          <ImageUploadGroup>
            <MainThumbnail as={images[featuredIndex] ? 'div' : 'label'} $empty={!images[featuredIndex]}>
              <FeaturedChip>대표</FeaturedChip>
              {images[featuredIndex] ? (
                <MainThumbnailImage src={images[featuredIndex] as string} alt="대표 이미지" />
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
                    multiple
                    aria-label="대표 이미지 선택"
                    onChange={(event) => handleFileChange(featuredIndex, event)}
                  />
                </>
              )}
            </MainThumbnail>
            <ThumbnailRow>
              {images.map((image, index) =>
                image ? (
                  <ThumbnailSlot
                    key={index}
                    as="div"
                    role="button"
                    tabIndex={0}
                    $featured={index === featuredIndex}
                    aria-label={`${index + 1}번째 이미지를 대표사진으로 설정`}
                    onClick={() => setFeaturedIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setFeaturedIndex(index);
                      }
                    }}
                  >
                    <ThumbnailImage src={image} alt="" />
                    <RemoveThumbnailButton
                      type="button"
                      aria-label={`${index + 1}번째 이미지 삭제`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <IcCloseCircle width={24} height={24} />
                    </RemoveThumbnailButton>
                  </ThumbnailSlot>
                ) : (
                  <ThumbnailSlot key={index} $featured={false}>
                    <IcAdd width={24} height={24} />
                    <HiddenFileInput
                      type="file"
                      accept="image/*"
                      multiple
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
              제목
              <Required>*</Required>
            </FieldHeading>
            <TitleTextarea
              placeholder="메시지를 입력해 주세요."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
              placeholder={CONTENT_PLACEHOLDER}
              value={content}
              onChange={(event) => setContent(event.target.value)}
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
                status={showErrors && isUnfilled(generation) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(generation) ? '기수를 입력해 주세요.' : undefined}
              />
            </NarrowField>
            {categoryConfig && (
              <CategorySelect
                label={categoryConfig.label}
                options={categoryConfig.options}
                value={category}
                onChange={setCategory}
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
              {showErrors && isDateInvalid && <DateDescription>날짜를 선택해 주세요.</DateDescription>}
            </RowField>
          </Row>
        </Information>
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
            <Button variant="solid" color="primary" size="large" onClick={handleSubmit} loading={isSubmitting}>
              {mode === 'edit' ? '저장하기' : '등록하기'}
            </Button>
          </ActionGroup>
        </Actions>
      </Modal>
      <ToastWrapper>
        <Toast variant="negative" text={submitError} show={!!submitError} onHidden={() => setSubmitError('')} />
      </ToastWrapper>
    </Backdrop>
  );
};

export default PostUploadModal;

const CategorySelect = ({
  label,
  options,
  value,
  onChange,
  status,
  description,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  status?: 'normal' | 'positive' | 'negative';
  description?: string;
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
    <NarrowSelectWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading={label}
        required
        placeholder="선택"
        value={value}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
        status={status}
        description={description}
      />
      {isOpen && (
        <ListboxOptions
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </NarrowSelectWrapper>
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
      <IcCalendar width={22} height={22} />
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
      <SingleDateInput
        placeholder="캘린더 선택"
        ariaLabel="일자"
        value={value ?? ''}
        onChange={(next) => onChange?.(next)}
        invalid={invalid}
      />
    );
  }

  return (
    <DateRangeRow>
      <DateRangeItem>
        <SingleDateInput
          placeholder="캘린더 선택"
          ariaLabel="시작일"
          value={rangeValue?.[0] ?? ''}
          onChange={(next) => onRangeChange?.(0, next)}
          invalid={invalid}
        />
      </DateRangeItem>
      <DateRangeDivider width={16} height={16} />
      <DateRangeItem>
        <SingleDateInput
          placeholder="캘린더 선택"
          ariaLabel="종료일"
          value={rangeValue?.[1] ?? ''}
          onChange={(next) => onRangeChange?.(1, next)}
          invalid={invalid}
        />
      </DateRangeItem>
    </DateRangeRow>
  );
};

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  width: 1040px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  outline: none;
  z-index: 10000;
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
`;

const ImageUploadGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

const MainThumbnail = styled.label<{ $empty: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22px;
  background-color: ${(props) => (props.$empty ? '#F4F4F5' : Fill.subtle)};
  cursor: ${(props) => (props.$empty ? 'pointer' : 'default')};
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
  background-color: rgba(255, 96, 0, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 96, 0, 0.43);
  color: ${Orange.o500};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const ThumbnailRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 16px 4px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ThumbnailSlot = styled.label<{ $featured: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${Fill.subtle};
  color: ${Label.neutral};
  box-shadow: ${(props) => (props.$featured ? `inset 0 0 0 2px ${Orange.o500}` : 'none')};
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const RemoveThumbnailButton = styled.button`
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  padding: 0;
  cursor: pointer;
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

const NarrowSelectWrapper = styled.div`
  position: relative;
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

const DateInputWrapper = styled.div<{ $invalid: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
