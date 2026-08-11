import { useState } from 'react';
import styled from 'styled-components';
import Button from '@common/button/Button';
import Card from '@common/card/Card';
import ContentBadge from '@common/badge/ContentBadge';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import IcAdd from '@assets/svg/ic-add.svg';
import PageHeader from '@common/pageHeader/PageHeader';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { PROJECT_CATEGORY_OPTIONS } from '@utils/constant';
import { BackgroundColor, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import HistoryDetailModal from './component/HistoryDetailModal';
import HistoryEditModal from './component/HistoryEditModal';
import HistoryUploadModal from './component/HistoryUploadModal';
import ProjectDetailModal from './component/ProjectDetailModal';
import ProjectEditModal from './component/ProjectEditModal';
import ProjectUploadModal from './component/ProjectUploadModal';
import SessionDetailModal from './component/SessionDetailModal';
import SessionEditModal from './component/SessionEditModal';
import SessionUploadModal from './component/SessionUploadModal';

type GalleryTabKey = 'session' | 'project' | 'gallery';
type FilterKey = 'generation' | 'track' | 'category';

interface GalleryCardItem {
  id: number;
  title: string;
  content: string;
  description: string;
  generation: string;
  category?: string;
  week?: string;
  date?: string;
  period?: string;
}

const toBadges = (card: GalleryCardItem): string[] =>
  [`${card.generation}기`, card.category, card.week && `${card.week}주차`].filter(Boolean) as string[];

const UPLOAD_MODAL_BY_TAB: Record<GalleryTabKey, typeof SessionUploadModal> = {
  session: SessionUploadModal,
  project: ProjectUploadModal,
  gallery: HistoryUploadModal,
};

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
const TRACK_FILTER_OPTIONS = ['전체', '기획디자인', '프론트엔드', '백엔드'];
const PROJECT_CATEGORY_FILTER_OPTIONS = ['전체', ...PROJECT_CATEGORY_OPTIONS];
// const WIKI_URL = 'https://wiki.cau-likelion.org';
const MOCK_CONTENT = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';
const MOCK_DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명';

const parseDateRange = (period: string | undefined): [string, string] => {
  const [start, end] = (period ?? '').split('-');
  const toIsoDate = (date: string) => date.replaceAll('/', '-');
  return [start ? toIsoDate(start) : '', end ? toIsoDate(end) : ''];
};

const splitPeriodForDisplay = (period: string | undefined): [string, string] => {
  const [start, end] = (period ?? '').split('-');
  return [start ?? '', end ?? ''];
};

const toDisplayDate = (isoDate: string | undefined) => (isoDate ?? '').replaceAll('-', '/');

const CARDS_BY_TAB: Record<GalleryTabKey, GalleryCardItem[]> = {
  session: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    content: MOCK_CONTENT,
    description: MOCK_DESCRIPTION,
    generation: '13',
    category: '기획디자인',
    week: '3',
    date: '2026-12-12',
  })),
  project: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    content: MOCK_CONTENT,
    description: MOCK_DESCRIPTION,
    generation: '13',
    category: '아이디어톤',
    period: '2026/12/12-2012/12/12',
  })),
  gallery: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: '제목',
    content: MOCK_CONTENT,
    description: MOCK_DESCRIPTION,
    generation: '13',
    period: '2026/12/12-2012/12/12',
  })),
};

const GalleryListSection = () => {
  const [activeTab, setActiveTab] = useState<GalleryTabKey>('session');
  const [generation, setGeneration] = useState(GENERATION_OPTIONS[0]);
  const [track, setTrack] = useState(TRACK_FILTER_OPTIONS[0]);
  const [projectCategory, setProjectCategory] = useState(PROJECT_CATEGORY_FILTER_OPTIONS[0]);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<GalleryCardItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (text: string) => {
    setToastText(text);
    setIsToastOpen(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as GalleryTabKey);
    setSelectedCard(null);
    setIsEditModalOpen(false);
    setOpenFilter(null);
  };

  const closeUploadModal = () => setIsUploadModalOpen(false);
  const closeDetailModal = () => setSelectedCard(null);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCard(null);
  };
  const handleDelete = () => {
    setIsEditModalOpen(false);
    setSelectedCard(null);
    showToast('삭제가 완료되었습니다.');
  };
  const handleUploadSubmit = () => showToast('등록이 완료되었습니다.');
  const handleEditSubmit = () => showToast('변경사항이 저장되었습니다.');

  const cards = CARDS_BY_TAB[activeTab].filter((card) => {
    const matchesGeneration = generation === GENERATION_OPTIONS[0] || `${card.generation}기` === generation;
    const matchesTrack = activeTab !== 'session' || track === TRACK_FILTER_OPTIONS[0] || card.category === track;
    const matchesCategory =
      activeTab !== 'project' ||
      projectCategory === PROJECT_CATEGORY_FILTER_OPTIONS[0] ||
      card.category === projectCategory;
    return matchesGeneration && matchesTrack && matchesCategory;
  });

  const UploadModal = UPLOAD_MODAL_BY_TAB[activeTab];

  const renderDetailModal = (card: GalleryCardItem) => {
    const commonProps = {
      title: card.title,
      badges: toBadges(card),
      description: card.description,
      onClose: closeDetailModal,
      onEdit: openEditModal,
    };
    if (activeTab === 'session') {
      return <SessionDetailModal {...commonProps} date={toDisplayDate(card.date)} />;
    }
    if (activeTab === 'project') {
      return <ProjectDetailModal {...commonProps} date={splitPeriodForDisplay(card.period)} />;
    }
    return <HistoryDetailModal {...commonProps} date={splitPeriodForDisplay(card.period)} />;
  };

  const renderEditModal = (card: GalleryCardItem) => {
    if (activeTab === 'session') {
      return (
        <SessionEditModal
          initialValues={{
            title: card.title,
            content: card.content,
            generation: card.generation,
            category: card.category ?? '',
            week: card.week ?? '',
            date: card.date ?? '',
          }}
          onClose={closeEditModal}
          onDelete={handleDelete}
          onSubmit={handleEditSubmit}
        />
      );
    }
    if (activeTab === 'project') {
      return (
        <ProjectEditModal
          initialValues={{
            title: card.title,
            content: card.content,
            generation: card.generation,
            category: card.category ?? '',
            dateRange: parseDateRange(card.period),
          }}
          onClose={closeEditModal}
          onDelete={handleDelete}
          onSubmit={handleEditSubmit}
        />
      );
    }
    return (
      <HistoryEditModal
        initialValues={{
          title: card.title,
          content: card.content,
          generation: card.generation,
          dateRange: parseDateRange(card.period),
        }}
        onClose={closeEditModal}
        onDelete={handleDelete}
        onSubmit={handleEditSubmit}
      />
    );
  };

  return (
    <Wrapper>
      <Header>
        <Intro title="갤러리" subtitle="페이지 소개 글 페이지 소개 글 페이지 소개 글 페이지 소개 글" />
        <Tab items={TABS} activeKey={activeTab} onChange={handleTabChange} size="medium" />
        <FilterRow>
          <FilterGroup>
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
            {activeTab === 'session' && (
              <FilterSelect
                label="파트 구분"
                value={track}
                options={TRACK_FILTER_OPTIONS}
                isOpen={openFilter === 'track'}
                onToggle={() => setOpenFilter((prev) => (prev === 'track' ? null : 'track'))}
                onClose={() => setOpenFilter(null)}
                onSelect={(option) => {
                  setTrack(option);
                  setOpenFilter(null);
                }}
              />
            )}
            {activeTab === 'project' && (
              <FilterSelect
                label="프로젝트 구분"
                value={projectCategory}
                options={PROJECT_CATEGORY_FILTER_OPTIONS}
                isOpen={openFilter === 'category'}
                onToggle={() => setOpenFilter((prev) => (prev === 'category' ? null : 'category'))}
                onClose={() => setOpenFilter(null)}
                onSelect={(option) => {
                  setProjectCategory(option);
                  setOpenFilter(null);
                }}
              />
            )}
          </FilterGroup>
          <Button
            variant="solid"
            color="primary"
            size="large"
            trailingIcon={<IcAdd width={20} height={20} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            {ADD_BUTTON_LABEL[activeTab]}
          </Button>
        </FilterRow>
      </Header>

      {isUploadModalOpen && <UploadModal onClose={closeUploadModal} onSubmit={handleUploadSubmit} />}
      {selectedCard && !isEditModalOpen && renderDetailModal(selectedCard)}
      {selectedCard && isEditModalOpen && renderEditModal(selectedCard)}
      <ToastWrapper>
        <Toast variant="positive" text={toastText} show={isToastOpen} onHidden={() => setIsToastOpen(false)} />
      </ToastWrapper>
      {/* <WikiBanner
        href={WIKI_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="중앙대학교 멋쟁이사자처럼 위키 바로가기"
      /> */}
      <CardGrid>
        {cards.map((card) => (
          <Card
            key={card.id}
            thumbnailRatio={16 / 9}
            title={card.title}
            onClick={() => setSelectedCard(card)}
            bottomContent={
              <BottomContent>
                <BadgeRow>
                  {toBadges(card).map((badge) => (
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

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

// const WikiBanner = styled.a`
//   display: block;
//   width: 100%;
//   height: 80px;
//   border-radius: 8px;
//   background-color: ${Fill.subtle};
//   cursor: pointer;
// `;

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
