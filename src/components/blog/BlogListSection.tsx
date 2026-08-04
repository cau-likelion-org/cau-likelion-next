import { useState } from 'react';
import styled from 'styled-components';
import PageHeader from '@common/pageHeader/PageHeader';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import { IcCircleExclamation } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { BackgroundColor, Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import BlogCard from './component/BlogCard';

type FilterKey = 'generation' | 'category';

interface BlogPostItem {
  id: number;
  title: string;
  description: string;
  badges: string[];
  date: string;
  url: string;
  generation: string;
  category: string;
  thumbnailUrl?: string;
}

const GENERATION_OPTIONS = ['전체', '13기', '12기', '11기'];
const CATEGORY_OPTIONS = ['전체', '활동 후기', '프로젝트 회고', '인턴·취업 후기', '기타'];

const MOCK_DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설';

const MOCK_POST_VARIANTS: { generation: string; category: string }[] = [
  { generation: '13', category: '활동 후기' },
  { generation: '13', category: '프로젝트 회고' },
  { generation: '12', category: '활동 후기' },
  { generation: '11', category: '인턴·취업 후기' },
];

const POSTS: BlogPostItem[] = MOCK_POST_VARIANTS.map((variant, index) => ({
  id: index + 1,
  title: '제목 텍스트',
  description: MOCK_DESCRIPTION,
  badges: [`${variant.generation}기`, '코코몽', variant.category],
  date: '2026/12/12',
  url: `https://blog.cau-likelion.org/posts/${index + 1}`,
  generation: variant.generation,
  category: variant.category,
}));

const BlogListSection = () => {
  const [generation, setGeneration] = useState(GENERATION_OPTIONS[0]);
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const posts = POSTS.filter((post) => {
    const matchesGeneration = generation === GENERATION_OPTIONS[0] || `${post.generation}기` === generation;
    const matchesCategory = category === CATEGORY_OPTIONS[0] || post.category === category;
    return matchesGeneration && matchesCategory;
  });

  return (
    <Wrapper>
      <Header>
        <Intro title="블로그" subtitle="페이지 소개 글 페이지 소개 글 페이지 소개 글 페이지 소개 글" />
        <FilterRow>
          <FilterSelect
            label="기수 구분"
            value={generation}
            options={GENERATION_OPTIONS}
            isOpen={openFilter === 'generation'}
            onToggle={() => setOpenFilter((prev) => (prev === 'generation' ? null : 'generation'))}
            onClose={() => setOpenFilter(null)}
            onSelect={(option) => {
              setGeneration(option);
              setOpenFilter(null);
            }}
          />
          <FilterSelect
            label="내용 구분"
            value={category}
            options={CATEGORY_OPTIONS}
            isOpen={openFilter === 'category'}
            onToggle={() => setOpenFilter((prev) => (prev === 'category' ? null : 'category'))}
            onClose={() => setOpenFilter(null)}
            onSelect={(option) => {
              setCategory(option);
              setOpenFilter(null);
            }}
          />
        </FilterRow>
      </Header>

      {posts.length === 0 ? (
        <EmptyState>
          <IcCircleExclamation width={64} height={64} />
          <EmptyStateText>조건에 맞는 블로그 글이 없습니다.</EmptyStateText>
        </EmptyState>
      ) : (
        <PostList>
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              description={post.description}
              badges={post.badges}
              date={post.date}
              url={post.url}
              thumbnailUrl={post.thumbnailUrl}
              thumbnailAlt={post.title}
            />
          ))}
        </PostList>
      )}
    </Wrapper>
  );
};

export default BlogListSection;

const FilterSelect = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onClose,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (option: string) => void;
}) => {
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: onToggle,
    onClose,
    onSelect,
  });

  return (
    <SelectWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading={label}
        value={value}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
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
    </SelectWrapper>
  );
};

const Wrapper = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
`;

const Intro = styled(PageHeader)`
  gap: 24px;
  padding-bottom: 22px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`;

const EmptyState = styled.div`
  width: 100%;
  min-height: 468px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  color: ${Label.assistive};
`;

const EmptyStateText = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Label.alternative};
  text-align: center;
  margin: 0;
`;
