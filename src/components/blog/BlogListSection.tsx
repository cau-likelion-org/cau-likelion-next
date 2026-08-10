import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@common/pageHeader/PageHeader';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import { IcCircleExclamation } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { getBlogs, BlogCategory } from 'src/apis/blog';
import { toDateString } from '@utils/index';
import { BackgroundColor, Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import BlogCard from './component/BlogCard';

type FilterKey = 'generation' | 'category';

const ALL_OPTION = '전체';

const CATEGORY_LABEL: Record<BlogCategory, string> = {
  ACTIVITY_REVIEW: '활동 후기',
  PROJECT_REVIEW: '프로젝트 회고',
  CAREER: '인턴·취업 후기',
  ETC: '기타',
};
const CATEGORY_OPTIONS = [ALL_OPTION, ...Object.values(CATEGORY_LABEL)];

const BlogListSection = () => {
  const { data: blogs } = useQuery({ queryKey: ['blogs'], queryFn: getBlogs });
  const [generation, setGeneration] = useState(ALL_OPTION);
  const [category, setCategory] = useState(ALL_OPTION);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const generationOptions = useMemo(() => {
    const generations = Array.from(new Set((blogs ?? []).map((blog) => blog.generationNumber))).sort((a, b) => b - a);
    return [ALL_OPTION, ...generations.map((generationNumber) => `${generationNumber}기`)];
  }, [blogs]);

  const posts = (blogs ?? []).filter((blog) => {
    const matchesGeneration = generation === ALL_OPTION || `${blog.generationNumber}기` === generation;
    const matchesCategory = category === ALL_OPTION || CATEGORY_LABEL[blog.category] === category;
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
            options={generationOptions}
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
              description={post.summary}
              badges={[`${post.generationNumber}기`, post.writer, CATEGORY_LABEL[post.category]]}
              date={toDateString(new Date(post.createdAt), '/')}
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
