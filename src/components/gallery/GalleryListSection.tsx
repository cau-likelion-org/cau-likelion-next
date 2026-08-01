import { useState } from 'react';
import styled from 'styled-components';
import { HiPlus } from 'react-icons/hi2';

import Button from '@common/button/Button';
import Card from '@common/card/Card';
import ContentBadge from '@common/badge/ContentBadge';
import Tab from '@common/tab/Tab';
import IcChevronDown from '@assets/svg/ic-chevron-down.svg';
import { BackgroundColor, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import GalleryUploadModal from './component/GalleryUploadModal';
import ProjectUploadModal from './component/ProjectUploadModal';
import SessionUploadModal from './component/SessionUploadModal';

type GalleryTabKey = 'session' | 'project' | 'gallery';
type FilterKey = 'generation' | 'track';

interface GalleryCardItem {
  id: number;
  title: string;
  badges: string[];
  period?: string;
}

const TABS: { key: GalleryTabKey; label: string }[] = [
  { key: 'session', label: '세션' },
  { key: 'project', label: '프로젝트' },
  { key: 'gallery', label: '추억' },
];

const ADD_BUTTON_LABEL: Record<GalleryTabKey, string> = {
  session: '세션 추가',
  project: '프로젝트 추가',
  gallery: '추억 추가',
};

const GENERATION_OPTIONS = ['전체', '13기', '12기', '11기'];
const TRACK_OPTIONS = ['전체', '기획디자인', '프론트엔드', '백엔드'];
const WIKI_URL = 'https://wiki.cau-likelion.org';

const CARDS_BY_TAB: Record<GalleryTabKey, GalleryCardItem[]> = {
  session: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    badges: ['13기', '기획디자인', 'N주차'],
  })),
  project: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    badges: ['13기', '아이디어톤'],
    period: '2026/12/12-2012/12/12',
  })),
  gallery: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    badges: ['13기'],
    period: '2026/12/12-2012/12/12',
  })),
};

const GalleryListSection = () => {
  const [activeTab, setActiveTab] = useState<GalleryTabKey>('session');
  const [generation, setGeneration] = useState(GENERATION_OPTIONS[0]);
  const [track, setTrack] = useState(TRACK_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const cards = CARDS_BY_TAB[activeTab];

  return (
    <Wrapper>
      <Header>
        <Intro>
          <Title>갤러리</Title>
          <Subtitle>페이지 소개 글 페이지 소개 글 페이지 소개 글 페이지 소개 글</Subtitle>
        </Intro>
        <Tab items={TABS} activeKey={activeTab} onChange={(key) => setActiveTab(key as GalleryTabKey)} size="medium" />
        <FilterRow>
          <FilterGroup>
            <FilterSelect
              label="기수 구분"
              value={generation}
              options={GENERATION_OPTIONS}
              isOpen={openFilter === 'generation'}
              onToggle={() => setOpenFilter((prev) => (prev === 'generation' ? null : 'generation'))}
              onSelect={(option) => {
                setGeneration(option);
                setOpenFilter(null);
              }}
            />
            <FilterSelect
              label="파트 구분"
              value={track}
              options={TRACK_OPTIONS}
              isOpen={openFilter === 'track'}
              onToggle={() => setOpenFilter((prev) => (prev === 'track' ? null : 'track'))}
              onSelect={(option) => {
                setTrack(option);
                setOpenFilter(null);
              }}
            />
          </FilterGroup>
          <Button
            variant="solid"
            color="primary"
            size="large"
            trailingIcon={<HiPlus />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            {ADD_BUTTON_LABEL[activeTab]}
          </Button>
        </FilterRow>
      </Header>

      {isUploadModalOpen && activeTab === 'session' && (
        <SessionUploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
      {isUploadModalOpen && activeTab === 'project' && (
        <ProjectUploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
      {isUploadModalOpen && activeTab === 'gallery' && (
        <GalleryUploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
      <WikiBanner href={WIKI_URL} target="_blank" rel="noopener noreferrer" />
      <CardGrid>
        {cards.map((card) => (
          <Card
            key={card.id}
            thumbnailRatio={16 / 9}
            title={card.title}
            bottomContent={
              <BottomContent>
                <BadgeRow>
                  {card.badges.map((badge) => (
                    <ContentBadge key={badge} text={badge} color="accent" size="medium" />
                  ))}
                </BadgeRow>
                {card.period && <Period>{card.period}</Period>}
              </BottomContent>
            }
          />
        ))}
      </CardGrid>
    </Wrapper>
  );
};

export default GalleryListSection;

const FilterSelect = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
}) => {
  return (
    <SelectWrapper>
      <SelectHeading>{label}</SelectHeading>
      <SelectTrigger type="button" role="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={onToggle}>
        <SelectValue>{value}</SelectValue>
        <ChevronIcon $open={isOpen} width={16} height={16} />
      </SelectTrigger>
      {isOpen && (
        <OptionList role="listbox">
          {options.map((option) => (
            <Option
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
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
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const FilterGroup = styled.div`
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

const Option = styled.button`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: none;
  text-align: left;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Fill.subtle};
  }
`;

const WikiBanner = styled.a`
  display: block;
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
  cursor: pointer;
`;

const CardGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 340px);
  column-gap: 20px;
  row-gap: 40px;
`;

const BottomContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Period = styled.p`
  ${typographyCss(Typography.body1Reading.regular)}
  color: ${Label.alternative};
  margin: 0;
`;
