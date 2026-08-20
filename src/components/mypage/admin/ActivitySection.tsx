import { useRef, useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import CharCount from '@common/charCount/CharCount';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { isUnfilled } from '@utils/index';
import { PageNavigation } from 'src/apis/activity';
import { IcCircleCloseOutline, IcImage } from '@assets/svg';
import { BackgroundWhite, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

// imageName엔 원본 파일명이 아니라 업로드된 이미지의 URL이 들어있어(S3 URL만 내려옴),
// 화면에 보여줄 파일명은 URL 마지막 경로에서 추출한다
const getFileNameFromUrl = (url: string) => {
  try {
    return decodeURIComponent(url.split('/').pop() ?? url);
  } catch {
    return url;
  }
};

export interface ActivityIntroItem {
  id: string;
  title: string;
  imageName: string;
  // 이번 편집 세션에서 새로 업로드한 파일의 원본 파일명. 비어있으면 imageName(URL)에서 추출해 보여준다
  imageFileName: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
}

export const isActivityItemInvalid = (item: ActivityIntroItem) =>
  isUnfilled(item.title) ||
  isUnfilled(item.imageName) ||
  isUnfilled(item.subtitle) ||
  isUnfilled(item.description) ||
  isUnfilled(item.buttonText) ||
  isUnfilled(item.href);

// 실제 백엔드 pageNavigation enum(5개)에 맞춘 라벨 — href 필드는 화면에서 이 라벨 문자열을 그대로 씀
export const PAGE_NAVIGATION_LABEL: Record<PageNavigation, string> = {
  INTRO_CURRICULUM: '소개 페이지 / 커리큘럼',
  PROJECT: '프로젝트 페이지',
  GALLERY_SESSION: '갤러리 페이지 / 세션',
  GALLERY_PROJECT: '갤러리 페이지 / 프로젝트',
  GALLERY_MEMORY: '갤러리 페이지 / 추억',
};
export const PAGE_NAVIGATION_BY_LABEL: Record<string, PageNavigation> = Object.fromEntries(
  Object.entries(PAGE_NAVIGATION_LABEL).map(([navigation, label]) => [label, navigation]),
) as Record<string, PageNavigation>;
const PAGE_LINK_OPTIONS = Object.values(PAGE_NAVIGATION_LABEL);

const createEmptyItem = (): ActivityIntroItem => ({
  id: createId(),
  title: '',
  imageName: '',
  imageFileName: '',
  subtitle: '',
  description: '',
  buttonText: '',
  href: '',
});

const ActivitySection = ({
  items,
  onChange,
  showErrors,
  disabled = false,
  uploadingIds,
  onUploadImage,
}: {
  items: ActivityIntroItem[];
  onChange: (items: ActivityIntroItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
  uploadingIds: string[];
  onUploadImage: (id: string, file: File) => void;
}) => {
  const updateItem = (id: string, patch: Partial<ActivityIntroItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));

  const addItem = () => onChange([...items, createEmptyItem()]);

  return (
    <Section>
      <Title>활동 소개</Title>
      {items.map((item) => (
        <ActivityCard
          key={item.id}
          item={item}
          showErrors={showErrors}
          disabled={disabled}
          isUploading={uploadingIds.includes(item.id)}
          onChange={(patch) => updateItem(item.id, patch)}
          onRemove={() => removeItem(item.id)}
          onUploadImage={(file) => onUploadImage(item.id, file)}
        />
      ))}
      {!disabled && <AddCardButton onClick={addItem} ariaLabel="활동 소개 추가" />}
    </Section>
  );
};

export default ActivitySection;

const ActivityCard = ({
  item,
  showErrors,
  disabled,
  isUploading,
  onChange,
  onRemove,
  onUploadImage,
}: {
  item: ActivityIntroItem;
  showErrors: boolean;
  disabled: boolean;
  isUploading: boolean;
  onChange: (patch: Partial<ActivityIntroItem>) => void;
  onRemove: () => void;
  onUploadImage: (file: File) => void;
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isImageInteractive = !disabled && !isUploading;
  const [isPageLinkOpen, setIsPageLinkOpen] = useState(false);
  const {
    listId: pageLinkListId,
    wrapperRef: pageLinkRef,
    triggerRef: pageLinkTriggerRef,
    activeIndex: pageLinkActiveIndex,
    handleKeyDown: handlePageLinkKeyDown,
    handleBlur: handlePageLinkBlur,
    selectOption: selectPageLink,
  } = useListboxSelect({
    isOpen: isPageLinkOpen,
    options: PAGE_LINK_OPTIONS,
    value: item.href,
    onOpen: () => setIsPageLinkOpen(true),
    onClose: () => setIsPageLinkOpen(false),
    onSelect: (href) => onChange({ href }),
  });

  return (
    <Card>
      <Row>
        <NameFieldWrapper>
          <TextField
            heading="활동명"
            value={item.title}
            placeholder="텍스트 입력"
            readOnly={disabled}
            onChange={(event) => onChange({ title: event.target.value })}
            status={showErrors && isUnfilled(item.title) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.title) ? '활동명을 입력해 주세요.' : undefined}
          />
        </NameFieldWrapper>
        <FieldWrapper>
          <ImageFieldHeading>이미지 첨부</ImageFieldHeading>
          <ImageInputWrapper
            onClick={() => isImageInteractive && imageInputRef.current?.click()}
            $clickable={isImageInteractive}
          >
            <IconSlot>
              <IcImage width={22} height={22} />
            </IconSlot>
            <ImageFileName $empty={!item.imageName}>
              {isUploading
                ? '업로드 중...'
                : item.imageName
                  ? item.imageFileName || getFileNameFromUrl(item.imageName)
                  : '이미지 파일을 선택해 주세요.'}
            </ImageFileName>
            {item.imageName && !disabled && !isUploading && (
              <ClearButton
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange({ imageName: '', imageFileName: '' });
                }}
                aria-label="이미지 삭제"
              >
                <IcCircleCloseOutline width={20} height={20} />
              </ClearButton>
            )}
          </ImageInputWrapper>
          <HiddenInput
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUploadImage(file);
              event.target.value = '';
            }}
          />
          {showErrors && isUnfilled(item.imageName) && <ImageErrorText>이미지를 첨부해 주세요.</ImageErrorText>}
        </FieldWrapper>
      </Row>
      <TextField
        heading="한줄 소개"
        value={item.subtitle}
        placeholder="텍스트 입력"
        readOnly={disabled}
        onChange={(event) => onChange({ subtitle: event.target.value })}
        status={showErrors && isUnfilled(item.subtitle) ? 'negative' : 'normal'}
        description={showErrors && isUnfilled(item.subtitle) ? '한줄 소개를 입력해 주세요.' : undefined}
      />
      <Textarea
        heading="설명글"
        value={item.description}
        placeholder="텍스트 입력"
        maxLength={1000}
        readOnly={disabled}
        bottomTrailingContent={<CharCount>{item.description.length}/1000</CharCount>}
        onChange={(event) => onChange({ description: event.target.value })}
        status={showErrors && isUnfilled(item.description) ? 'negative' : 'normal'}
        description={showErrors && isUnfilled(item.description) ? '설명글을 입력해 주세요.' : undefined}
      />
      <Row>
        <FieldWrapper>
          <TextField
            heading="버튼명"
            value={item.buttonText}
            placeholder="텍스트 입력"
            readOnly={disabled}
            onChange={(event) => onChange({ buttonText: event.target.value })}
            status={showErrors && isUnfilled(item.buttonText) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.buttonText) ? '버튼명을 입력해 주세요.' : undefined}
          />
        </FieldWrapper>
        <SelectWrapper ref={pageLinkRef} onKeyDownCapture={handlePageLinkKeyDown} onBlur={handlePageLinkBlur}>
          <Select
            ref={pageLinkTriggerRef}
            heading="페이지 이동"
            placeholder="선택"
            value={item.href}
            readOnly={disabled}
            onClick={() => setIsPageLinkOpen((prev) => !prev)}
            aria-expanded={isPageLinkOpen}
            aria-activedescendant={isPageLinkOpen ? `${pageLinkListId}-${pageLinkActiveIndex}` : undefined}
            aria-controls={pageLinkListId}
            status={showErrors && isUnfilled(item.href) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.href) ? '페이지 이동을 선택해 주세요.' : undefined}
          />
          {isPageLinkOpen && (
            <ListboxOptions
              listId={pageLinkListId}
              options={PAGE_LINK_OPTIONS}
              value={item.href}
              activeIndex={pageLinkActiveIndex}
              onSelect={selectPageLink}
            />
          )}
        </SelectWrapper>
      </Row>
      {!disabled && (
        <ButtonRow>
          <RemoveCardButton onClick={onRemove} />
        </ButtonRow>
      )}
    </Card>
  );
};

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const NameFieldWrapper = styled.div`
  flex: 0 0 160px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 0 0;
  min-width: 0;
`;

const SelectWrapper = styled.div`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ImageFieldHeading = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const ImageInputWrapper = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
`;

const IconSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const ImageFileName = styled.p<{ $empty: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$empty ? Label.assistive : Label.normal)};
  text-decoration: ${(props) => (props.$empty ? 'none' : 'underline')};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageErrorText = styled.p`
  margin: 0;
  width: 100%;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;
