import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@common/pageHeader/PageHeader';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import TextField from '@common/textField/TextField';
import { IcSearch } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { getBlogs, BlogCategory } from 'src/apis/blog';
import { toDateString } from '@utils/index';
import { Label } from '@utils/constant/color';

import BlogCard from './component/BlogCard';
import { containerCss, media } from '@utils/constant/breakpoint';

type FilterKey = 'generation' | 'category';

const ALL_OPTION = '전체';

const CATEGORY_LABEL: Record<BlogCategory, string> = {
  ACTIVITY_REVIEW: '활동 후기',
  PROJECT_REVIEW: '프로젝트 회고',
  CAREER: '인턴·취업 후기',
  ETC: '기타',
};
const CATEGORY_OPTIONS = [ALL_OPTION, ...Object.values(CATEGORY_LABEL)];
const PAGE_SIZE = 10;

const BlogListSection = () => {
  const { data: blogs, isLoading, isError } = useQuery({ queryKey: ['blogs'], queryFn: getBlogs });
  const [generation, setGeneration] = useState(ALL_OPTION);
  const [category, setCategory] = useState(ALL_OPTION);
  const [keyword, setKeyword] = useState('');
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [page, setPage] = useState(1);

  const generationOptions = useMemo(() => {
    const generations = Array.from(new Set((blogs ?? []).map((blog) => blog.generationNumber))).sort((a, b) => b - a);
    return [ALL_OPTION, ...generations.map((generationNumber) => `${generationNumber}기`)];
  }, [blogs]);

  const posts = (blogs ?? []).filter((blog) => {
    const matchesGeneration = generation === ALL_OPTION || `${blog.generationNumber}기` === generation;
    const matchesCategory = category === ALL_OPTION || CATEGORY_LABEL[blog.category] === category;
    const trimmedKeyword = keyword.trim().toLowerCase();
    const matchesKeyword =
      blog.title.toLowerCase().includes(trimmedKeyword) || blog.writer.toLowerCase().includes(trimmedKeyword);
    return matchesGeneration && matchesCategory && matchesKeyword;
  });
  const totalPage = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Wrapper>
      <Header>
        <Intro title="블로그" subtitle="멋사인들이 직접 쓴 프로젝트·취업 후기" />
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
              setPage(1);
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
              setPage(1);
            }}
          />
          <SearchField
            heading="검색"
            placeholder="텍스트를 입력해 주세요."
            leadingIcon={<IcSearch width={22} height={22} style={{ color: Label.normal }} />}
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setPage(1);
            }}
          />
        </FilterRow>
      </Header>

      {isLoading ? (
        <LoadingWrapper>
          <CircularLoading size={32} />
        </LoadingWrapper>
      ) : isError && posts.length === 0 ? (
        <EmptyState variant="error" />
      ) : posts.length === 0 ? (
        <EmptyState message="조건에 맞는 블로그 글이 없습니다." />
      ) : (
        <>
          <PostList>
            {pagePosts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                description={post.summary}
                badges={[`${post.generationNumber}기`, post.writer, CATEGORY_LABEL[post.category]]}
                date={toDateString(new Date(post.publishedDate ?? post.createdAt), '/')}
                url={post.url}
                thumbnailUrl={post.thumbnailUrl}
                thumbnailAlt={post.title}
              />
            ))}
          </PostList>
          <PaginationRow>
            <PaginationNavigation variant="extended" currentPage={page} totalPage={totalPage} onPageChange={setPage} />
          </PaginationRow>
        </>
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
      >
        {isOpen && (
          <ListboxOptions
            listId={listId}
            options={options}
            value={value}
            activeIndex={activeIndex}
            onSelect={selectOption}
          />
        )}
      </Select>
    </SelectWrapper>
  );
};

const Wrapper = styled.div`
  ${containerCss}
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
  gap: 52px;

  ${media.xs} {
    gap: 32px;
  }

  @media (max-width: 600px) {
    gap: 0;
  }
`;

const Intro = styled(PageHeader)`
  gap: 24px;

  @media (max-width: 600px) {
    padding-top: 52px;
    padding-bottom: 52px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 600px) {
    flex: 1 0 0;
    min-width: 0;
    width: auto;
  }
`;

const SearchField = styled(TextField)`
  flex: 1 0 0;
  min-width: 0;
`;

const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;

  @media (max-width: 600px) {
    gap: 32px;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 468px;
`;
