import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextField from '@common/textField/TextField';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import RemoveCardButton from '@mypage/component/RemoveCardButton';
import { IcAdd, IcCircleClose, IcLink, IcSearch } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { BlogCategory } from 'src/apis/blog';
import { NUMERIC_ONLY_REGEX } from '@utils/constant';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
import { createId } from '../utils';

const ALL_OPTION = '전체';

export interface BlogItem {
  id: string;
  generation: string;
  writer: string;
  category: string;
  url: string;
}

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  ACTIVITY_REVIEW: '활동 후기',
  PROJECT_REVIEW: '프로젝트 회고',
  CAREER: '취업/인턴 후기',
  ETC: '기타',
};
export const BLOG_CATEGORY_BY_LABEL: Record<string, BlogCategory> = Object.fromEntries(
  Object.entries(BLOG_CATEGORY_LABEL).map(([category, label]) => [label, category]),
) as Record<string, BlogCategory>;
const BLOG_CATEGORY_OPTIONS = Object.values(BLOG_CATEGORY_LABEL);

export const isBlogItemInvalid = (item: BlogItem) =>
  isUnfilled(item.generation) || isUnfilled(item.writer) || isUnfilled(item.category) || isUnfilled(item.url);

const createEmptyItem = (): BlogItem => ({ id: createId(), generation: '', writer: '', category: '', url: '' });

const BlogSection = ({
  items,
  onChange,
  showErrors,
  disabled = false,
}: {
  items: BlogItem[];
  onChange: (items: BlogItem[]) => void;
  showErrors: boolean;
  disabled?: boolean;
}) => {
  const [generationFilter, setGenerationFilter] = useState(ALL_OPTION);
  const [writerQuery, setWriterQuery] = useState('');

  const generationOptions = useMemo(() => {
    const generations = Array.from(new Set(items.map((item) => item.generation).filter((generation) => generation)));
    generations.sort((a, b) => Number(b) - Number(a));
    return [ALL_OPTION, ...generations];
  }, [items]);

  const visibleItems = disabled
    ? items
    : items.filter((item) => {
        const matchesGeneration = generationFilter === ALL_OPTION || item.generation === generationFilter;
        const matchesWriter = item.writer.toLowerCase().includes(writerQuery.trim().toLowerCase());
        return matchesGeneration && matchesWriter;
      });

  const pendingScrollIdRef = useRef<string | null>(null);

  useEffect(() => {
    const id = pendingScrollIdRef.current;
    if (!id) return;
    const card = document.querySelector<HTMLElement>(`[data-blog-item-id="${id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // preventScroll 없으면 focus()가 스크롤을 즉시 끊어버려 위 smooth scrollIntoView와 충돌한다
      card.querySelector('input')?.focus({ preventScroll: true });
      pendingScrollIdRef.current = null;
    }
  }, [items]);

  const updateItem = (id: string, patch: Partial<BlogItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => onChange(items.filter((item) => item.id !== id));

  const addItem = () => {
    const newItem = createEmptyItem();
    pendingScrollIdRef.current = newItem.id;
    setGenerationFilter(ALL_OPTION);
    setWriterQuery('');
    onChange([newItem, ...items]);
  };

  return (
    <Section>
      {!disabled && (
        <FilterRow>
          <ProjectFilterSelect
            heading="기수 구분"
            options={generationOptions}
            value={generationFilter}
            onChange={setGenerationFilter}
          />
          <SearchField
            heading="작성자 검색"
            placeholder="텍스트를 입력해 주세요."
            leadingIcon={<IcSearch width={22} height={22} />}
            value={writerQuery}
            onChange={(event) => setWriterQuery(event.target.value)}
          />
          <Button
            variant="solid"
            color="assistive"
            size="large"
            trailingIcon={<IcAdd width={20} height={20} />}
            onClick={addItem}
          >
            블로그 글 추가
          </Button>
        </FilterRow>
      )}
      {visibleItems.map((item) => (
        <BlogCard
          key={item.id}
          item={item}
          showErrors={showErrors}
          disabled={disabled}
          onChange={(patch) => updateItem(item.id, patch)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </Section>
  );
};

export default BlogSection;

const BlogCard = ({
  item,
  showErrors,
  disabled,
  onChange,
  onRemove,
}: {
  item: BlogItem;
  showErrors: boolean;
  disabled: boolean;
  onChange: (patch: Partial<BlogItem>) => void;
  onRemove: () => void;
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const {
    listId: categoryListId,
    wrapperRef: categoryRef,
    triggerRef: categoryTriggerRef,
    activeIndex: categoryActiveIndex,
    handleKeyDown: handleCategoryKeyDown,
    handleBlur: handleCategoryBlur,
    selectOption: selectCategory,
  } = useListboxSelect({
    isOpen: isCategoryOpen,
    options: BLOG_CATEGORY_OPTIONS,
    value: item.category,
    onOpen: () => setIsCategoryOpen(true),
    onClose: () => setIsCategoryOpen(false),
    onSelect: (category) => onChange({ category }),
  });

  return (
    <Card data-blog-item-id={item.id}>
      <Row>
        <FieldWrapper>
          <TextField
            heading="기수 구분"
            value={item.generation}
            placeholder="숫자 입력"
            readOnly={disabled}
            onChange={(event) => {
              if (NUMERIC_ONLY_REGEX.test(event.target.value)) {
                onChange({ generation: event.target.value });
              }
            }}
            status={showErrors && isUnfilled(item.generation) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.generation) ? '기수를 입력해 주세요.' : undefined}
          />
        </FieldWrapper>
        <FieldWrapper>
          <TextField
            heading="작성자명"
            value={item.writer}
            placeholder="텍스트 입력"
            readOnly={disabled}
            onChange={(event) => onChange({ writer: event.target.value })}
            status={showErrors && isUnfilled(item.writer) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.writer) ? '작성자명을 입력해 주세요.' : undefined}
          />
        </FieldWrapper>
        <SelectWrapper ref={categoryRef} onKeyDownCapture={handleCategoryKeyDown} onBlur={handleCategoryBlur}>
          <Select
            ref={categoryTriggerRef}
            heading="내용 구분"
            placeholder="선택"
            value={item.category}
            readOnly={disabled}
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            aria-expanded={isCategoryOpen}
            aria-activedescendant={isCategoryOpen ? `${categoryListId}-${categoryActiveIndex}` : undefined}
            aria-controls={categoryListId}
            status={showErrors && isUnfilled(item.category) ? 'negative' : 'normal'}
            description={showErrors && isUnfilled(item.category) ? '내용 구분을 선택해 주세요.' : undefined}
          >
            {isCategoryOpen && (
              <ListboxOptions
                listId={categoryListId}
                options={BLOG_CATEGORY_OPTIONS}
                value={item.category}
                activeIndex={categoryActiveIndex}
                onSelect={selectCategory}
              />
            )}
          </Select>
        </SelectWrapper>
      </Row>
      <TextField
        heading="링크 첨부"
        value={item.url}
        placeholder="사이트 링크를 복붙해주세요."
        readOnly={disabled}
        leadingIcon={<IcLink width={20} height={20} />}
        trailingContent={
          item.url && !disabled ? (
            <ClearButton type="button" onClick={() => onChange({ url: '' })} aria-label="링크 지우기">
              <IcCircleClose width={20} height={20} />
            </ClearButton>
          ) : undefined
        }
        onChange={(event) => onChange({ url: event.target.value })}
        status={showErrors && isUnfilled(item.url) ? 'negative' : 'normal'}
        description={showErrors && isUnfilled(item.url) ? '링크를 입력해 주세요.' : undefined}
      />
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

const FilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
`;

const SearchField = styled(TextField)`
  flex: 1 0 0;
  min-width: 0;
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
  flex: 0 0 160px;
`;

const SelectWrapper = styled.div`
  position: relative;
  flex: 0 0 160px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.assistive};
  cursor: pointer;
`;
