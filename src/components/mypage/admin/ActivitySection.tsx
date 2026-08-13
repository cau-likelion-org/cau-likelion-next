import { useState } from 'react';
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
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface ActivityIntroItem {
  id: string;
  title: string;
  imageName: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
}

export const isActivityItemInvalid = (item: ActivityIntroItem) =>
  isUnfilled(item.title) ||
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
}: {
  items: ActivityIntroItem[];
  onChange: (items: ActivityIntroItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
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
          onChange={(patch) => updateItem(item.id, patch)}
          onRemove={() => removeItem(item.id)}
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
  onChange,
  onRemove,
}: {
  item: ActivityIntroItem;
  showErrors: boolean;
  disabled: boolean;
  onChange: (patch: Partial<ActivityIntroItem>) => void;
  onRemove: () => void;
}) => {
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
            disabled={disabled}
            onChange={(event) => onChange({ title: event.target.value })}
            status={showErrors && isUnfilled(item.title) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.title) ? '활동명을 입력해 주세요.' : undefined}
          />
        </NameFieldWrapper>
        <FieldWrapper>
          <TextField
            heading="이미지 첨부"
            value={item.imageName}
            placeholder="이미지 파일을 선택해 주세요."
            disabled={disabled}
            onChange={(event) => onChange({ imageName: event.target.value })}
          />
        </FieldWrapper>
      </Row>
      <TextField
        heading="한줄 소개"
        value={item.subtitle}
        placeholder="텍스트 입력"
        disabled={disabled}
        onChange={(event) => onChange({ subtitle: event.target.value })}
        status={showErrors && isUnfilled(item.subtitle) ? 'negative' : 'normal'}
        description={showErrors && isUnfilled(item.subtitle) ? '한줄 소개를 입력해 주세요.' : undefined}
      />
      <Textarea
        heading="설명글"
        value={item.description}
        placeholder="텍스트 입력"
        maxLength={1000}
        disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
