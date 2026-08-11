import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
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
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { getSessionList, getSession } from 'src/apis/session';
import { getHistoryList, getHistory } from 'src/apis/history';
import { getGalleryProjectList, GalleryProjectCategory } from 'src/apis/project';

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

const PROJECT_CATEGORY_LABEL: Record<GalleryProjectCategory, string> = {
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  CHUNGKATHON: '중커톤',
  ETC: '기타',
};
const PROJECT_CATEGORY_FILTER_OPTIONS = ['전체', ...Object.values(PROJECT_CATEGORY_LABEL)];
const ALL_OPTION = '전체';
// const WIKI_URL = 'https://wiki.cau-likelion.org';

const toDisplayDate = (isoDate: string | undefined) => (isoDate ?? '').split('T')[0].replaceAll('-', '/');
const toPeriodDisplay = (startDate: string, endDate: string | null) =>
  `${toDisplayDate(startDate)}${endDate ? `-${toDisplayDate(endDate)}` : ''}`;

const GalleryListSection = () => {
  const [activeTab, setActiveTab] = useState<GalleryTabKey>('session');
  const [generation, setGeneration] = useState(ALL_OPTION);
  const [track, setTrack] = useState(ALL_OPTION);
  const [projectCategory, setProjectCategory] = useState(ALL_OPTION);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { data: sessions } = useQuery({ queryKey: ['gallerySessions'], queryFn: getSessionList });
  const { data: projects } = useQuery({ queryKey: ['galleryProjects'], queryFn: getGalleryProjectList });
  const { data: histories } = useQuery({ queryKey: ['galleryHistories'], queryFn: getHistoryList });

  const { data: sessionDetail } = useQuery({
    queryKey: ['gallerySessionDetail', selectedId],
    queryFn: () => getSession(selectedId as number),
    enabled: activeTab === 'session' && selectedId !== null,
  });
  const { data: historyDetail } = useQuery({
    queryKey: ['galleryHistoryDetail', selectedId],
    queryFn: () => getHistory(selectedId as number),
    enabled: activeTab === 'gallery' && selectedId !== null,
  });
  const projectDetail = useMemo(() => projects?.find((project) => project.id === selectedId), [projects, selectedId]);

  const showToast = (text: string) => {
    setToastText(text);
    setIsToastOpen(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as GalleryTabKey);
    setSelectedId(null);
    setIsEditModalOpen(false);
    setOpenFilter(null);
    setGeneration(ALL_OPTION);
    setTrack(ALL_OPTION);
    setProjectCategory(ALL_OPTION);
  };

  const closeUploadModal = () => setIsUploadModalOpen(false);
  const closeDetailModal = () => setSelectedId(null);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
  };
  const handleDelete = () => {
    setIsEditModalOpen(false);
    setSelectedId(null);
    showToast('삭제가 완료되었습니다.');
  };
  const handleUploadSubmit = () => showToast('등록이 완료되었습니다.');
  const handleEditSubmit = () => showToast('변경사항이 저장되었습니다.');

  const generationOptions = useMemo(() => {
    const source: { generationNumber: number }[] =
      activeTab === 'session' ? (sessions ?? []) : activeTab === 'project' ? (projects ?? []) : (histories ?? []);
    const numbers = Array.from(new Set(source.map((item) => item.generationNumber))).sort((a, b) => b - a);
    return [ALL_OPTION, ...numbers.map((n) => `${n}기`)];
  }, [activeTab, sessions, projects, histories]);

  const partOptions = useMemo(() => {
    const parts = Array.from(new Set((sessions ?? []).map((item) => item.partName)));
    return [ALL_OPTION, ...parts];
  }, [sessions]);

  const sessionCards = (sessions ?? []).filter(
    (item) =>
      (generation === ALL_OPTION || `${item.generationNumber}기` === generation) &&
      (track === ALL_OPTION || item.partName === track),
  );
  const projectCards = (projects ?? []).filter(
    (item) =>
      (generation === ALL_OPTION || `${item.generationNumber}기` === generation) &&
      (projectCategory === ALL_OPTION || PROJECT_CATEGORY_LABEL[item.category] === projectCategory),
  );
  const historyCards = (histories ?? []).filter(
    (item) => generation === ALL_OPTION || `${item.generationNumber}기` === generation,
  );

  const UploadModal = UPLOAD_MODAL_BY_TAB[activeTab];

  const renderDetailModal = () => {
    if (activeTab === 'session' && sessionDetail) {
      return (
        <SessionDetailModal
          title={sessionDetail.title}
          badges={[`${sessionDetail.generationNumber}기`, sessionDetail.partName, `${sessionDetail.degree}주차`]}
          description={sessionDetail.description}
          date={toDisplayDate(sessionDetail.sessionDate)}
          onClose={closeDetailModal}
          onEdit={openEditModal}
        />
      );
    }
    if (activeTab === 'project' && projectDetail) {
      return (
        <ProjectDetailModal
          title={projectDetail.title}
          badges={[`${projectDetail.generationNumber}기`, PROJECT_CATEGORY_LABEL[projectDetail.category]]}
          description={projectDetail.summary}
          date={[toDisplayDate(projectDetail.startDate), toDisplayDate(projectDetail.endDate)]}
          onClose={closeDetailModal}
          onEdit={openEditModal}
        />
      );
    }
    if (activeTab === 'gallery' && historyDetail) {
      return (
        <HistoryDetailModal
          title={historyDetail.title}
          badges={[`${historyDetail.generationNumber}기`]}
          description={historyDetail.description}
          date={[
            toDisplayDate(historyDetail.startDate),
            toDisplayDate(historyDetail.endDate ?? historyDetail.startDate),
          ]}
          onClose={closeDetailModal}
          onEdit={openEditModal}
        />
      );
    }
    return null;
  };

  const renderEditModal = () => {
    if (activeTab === 'session' && sessionDetail) {
      return (
        <SessionEditModal
          initialValues={{
            title: sessionDetail.title,
            content: sessionDetail.description,
            generation: String(sessionDetail.generationNumber),
            category: sessionDetail.partName,
            week: String(sessionDetail.degree),
            date: sessionDetail.sessionDate.split('T')[0],
          }}
          onClose={closeEditModal}
          onDelete={handleDelete}
          onSubmit={handleEditSubmit}
        />
      );
    }
    if (activeTab === 'project' && projectDetail) {
      return (
        <ProjectEditModal
          initialValues={{
            title: projectDetail.title,
            content: projectDetail.summary,
            generation: String(projectDetail.generationNumber),
            category: PROJECT_CATEGORY_LABEL[projectDetail.category],
            dateRange: [projectDetail.startDate, projectDetail.endDate],
          }}
          onClose={closeEditModal}
          onDelete={handleDelete}
          onSubmit={handleEditSubmit}
        />
      );
    }
    if (activeTab === 'gallery' && historyDetail) {
      return (
        <HistoryEditModal
          initialValues={{
            title: historyDetail.title,
            content: historyDetail.description,
            generation: String(historyDetail.generationNumber),
            dateRange: [historyDetail.startDate, historyDetail.endDate ?? historyDetail.startDate],
          }}
          onClose={closeEditModal}
          onDelete={handleDelete}
          onSubmit={handleEditSubmit}
        />
      );
    }
    return null;
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
              options={generationOptions}
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
                options={partOptions}
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
      {selectedId !== null && !isEditModalOpen && renderDetailModal()}
      {selectedId !== null && isEditModalOpen && renderEditModal()}
      <ToastWrapper>
        <Toast variant="positive" text={toastText} show={isToastOpen} onHidden={() => setIsToastOpen(false)} />
      </ToastWrapper>
      {/* <WikiBanner
        href={WIKI_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="중앙대학교 멋쟁이사자처럼 위키 바로가기"
      /> */}

      {activeTab === 'session' && (
        <CardGrid>
          {sessionCards.map((item) => (
            <Card
              key={item.id}
              thumbnailRatio={16 / 9}
              thumbnailSrc={item.thumbnailUrl}
              title={item.title}
              onClick={() => setSelectedId(item.id)}
              bottomContent={
                <BottomContent>
                  <BadgeRow>
                    {[`${item.generationNumber}기`, item.partName, `${item.degree}주차`].map((badge) => (
                      <ContentBadge key={badge} text={badge} color="accent" size="medium" />
                    ))}
                  </BadgeRow>
                </BottomContent>
              }
            />
          ))}
        </CardGrid>
      )}
      {activeTab === 'project' && (
        <CardGrid>
          {projectCards.map((item) => {
            const thumbnail = item.images.find((image) => image.isMain)?.imageUrl ?? item.images[0]?.imageUrl;
            return (
              <Card
                key={item.id}
                thumbnailRatio={16 / 9}
                thumbnailSrc={thumbnail}
                title={item.title}
                onClick={() => setSelectedId(item.id)}
                bottomContent={
                  <BottomContent>
                    <BadgeRow>
                      {[`${item.generationNumber}기`, PROJECT_CATEGORY_LABEL[item.category]].map((badge) => (
                        <ContentBadge key={badge} text={badge} color="accent" size="medium" />
                      ))}
                    </BadgeRow>
                    <Period>{toPeriodDisplay(item.startDate, item.endDate)}</Period>
                  </BottomContent>
                }
              />
            );
          })}
        </CardGrid>
      )}
      {activeTab === 'gallery' && (
        <CardGrid>
          {historyCards.map((item) => (
            <Card
              key={item.id}
              thumbnailRatio={16 / 9}
              thumbnailSrc={item.thumbnailUrl}
              title={item.title}
              onClick={() => setSelectedId(item.id)}
              bottomContent={
                <BottomContent>
                  <BadgeRow>
                    <ContentBadge text={`${item.generationNumber}기`} color="accent" size="medium" />
                  </BadgeRow>
                  <Period>{toPeriodDisplay(item.startDate, item.endDate)}</Period>
                </BottomContent>
              }
            />
          ))}
        </CardGrid>
      )}
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
