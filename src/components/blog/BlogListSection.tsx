import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { IcChevronDown, IcCircleExclamation } from '@assets/svg';
import useOutsideClick from 'src/hooks/useOutsideClick';
import { BackgroundColor, Fill, Label, Line, Orange } from '@utils/constant/color';
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
        <Intro>
          <Title>블로그</Title>
          <Subtitle>페이지 소개 글 페이지 소개 글 페이지 소개 글 페이지 소개 글</Subtitle>
        </Intro>
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(() => Math.max(options.indexOf(value), 0));
  useOutsideClick(wrapperRef, onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setActiveIndex(Math.max(options.indexOf(value), 0)), 0);
    return () => clearTimeout(timer);
  }, [isOpen, value, options]);

  const moveActive = (nextIndex: number) => {
    setActiveIndex(Math.min(Math.max(nextIndex, 0), options.length - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter')) {
      event.preventDefault();
      onToggle();
      return;
    }
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        moveActive(0);
        break;
      case 'End':
        event.preventDefault();
        moveActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(options[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <SelectWrapper ref={wrapperRef}>
      <SelectHeading>{label}</SelectHeading>
      <SelectTrigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <SelectValue>{value}</SelectValue>
        <ChevronIcon $open={isOpen} width={16} height={16} />
      </SelectTrigger>
      {isOpen && (
        <OptionList role="listbox" id={listId}>
          {options.map((option, index) => (
            <Option
              key={option}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              aria-selected={value === option}
              $active={index === activeIndex}
              onClick={() => onSelect(option)}
            >
              {option}
            </Option>
          ))}
        </OptionList>
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

const Intro = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding: 80px 0 22px;
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Orange.o500};
  margin: 0;
`;

const Subtitle = styled.p`
  ${typographyCss(Typography.heading2.medium)}
  color: ${Orange.o500};
  margin: 0;
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

const SelectHeading = styled.p`
  ${typographyCss(Typography.label1Normal.bold)}
  color: ${Label.neutral};
  margin: 0;
`;

const SelectTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);
  cursor: pointer;
  text-align: left;
`;

const SelectValue = styled.span`
  flex: 1 0 0;
  min-width: 0;
  ${typographyCss(Typography.body1Normal.regular)}
  color: ${Label.normal};
`;

const ChevronIcon = styled(IcChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: ${Label.normal};
  transform: ${(props) => (props.$open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const OptionList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  z-index: 1;
`;

const Option = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$active ? Fill.subtle : 'transparent')};
  text-align: left;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Fill.subtle};
  }
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
