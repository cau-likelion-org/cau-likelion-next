import { useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import CharCount from '@common/charCount/CharCount';
import useListboxSelect from 'src/hooks/useListboxSelect';
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

const PAGE_LINK_OPTIONS = ['소개 페이지 / 커리큘럼 영역', '프로젝트 페이지', '갤러리 페이지 / 세션', '블로그 페이지'];

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
  onSave,
}: {
  items: ActivityIntroItem[];
  onChange: (items: ActivityIntroItem[]) => void;
  onSave: () => void;
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
          onChange={(patch) => updateItem(item.id, patch)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
      <AddCardButton onClick={addItem} ariaLabel="활동 소개 추가" />
      <Button size="large" onClick={onSave}>
        저장
      </Button>
    </Section>
  );
};

export default ActivitySection;

const ActivityCard = ({
  item,
  onChange,
  onRemove,
}: {
  item: ActivityIntroItem;
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
        <TextField
          heading="활동명"
          value={item.title}
          placeholder="텍스트 입력"
          onChange={(event) => onChange({ title: event.target.value })}
        />
        <TextField
          heading="이미지 첨부"
          value={item.imageName}
          placeholder="이미지 파일을 선택해 주세요."
          onChange={(event) => onChange({ imageName: event.target.value })}
        />
      </Row>
      <TextField
        heading="한줄 소개"
        value={item.subtitle}
        placeholder="텍스트 입력"
        onChange={(event) => onChange({ subtitle: event.target.value })}
      />
      <Textarea
        heading="설명글"
        value={item.description}
        placeholder="텍스트 입력"
        maxLength={1000}
        bottomTrailingContent={<CharCount>{item.description.length}/1000</CharCount>}
        onChange={(event) => onChange({ description: event.target.value })}
      />
      <Row>
        <FieldWrapper>
          <TextField
            heading="버튼명"
            value={item.buttonText}
            placeholder="텍스트 입력"
            onChange={(event) => onChange({ buttonText: event.target.value })}
          />
        </FieldWrapper>
        <SelectWrapper ref={pageLinkRef} onKeyDownCapture={handlePageLinkKeyDown} onBlur={handlePageLinkBlur}>
          <Select
            ref={pageLinkTriggerRef}
            heading="페이지 이동"
            placeholder="선택"
            value={item.href}
            onClick={() => setIsPageLinkOpen((prev) => !prev)}
            aria-expanded={isPageLinkOpen}
            aria-activedescendant={isPageLinkOpen ? `${pageLinkListId}-${pageLinkActiveIndex}` : undefined}
            aria-controls={pageLinkListId}
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
      <ButtonRow>
        <RemoveCardButton onClick={onRemove} />
      </ButtonRow>
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
