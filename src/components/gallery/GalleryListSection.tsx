import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@common/button/Button';
import Card from '@common/card/Card';
import ContentBadge from '@common/badge/ContentBadge';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import { IcAdd } from '@assets/svg';
import PageHeader from '@common/pageHeader/PageHeader';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useTokenStore from 'src/store/useTokenStore';
import { getUserProfile, getGenerations } from 'src/apis/account';
import { COMMON_PART_NAME } from '@utils/constant';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { isAdminRole } from '@utils/index';
import { getSessionList, getSession } from 'src/apis/session';
import { getHistoryList, getHistory } from 'src/apis/history';
import { getGalleryProjectList, getGalleryProject, GALLERY_PROJECT_CATEGORY_LABEL } from 'src/apis/gallery';

import HistoryDetailModal from './component/history/HistoryDetailModal';
import HistoryEditModal from './component/history/HistoryEditModal';
import HistoryUploadModal from './component/history/HistoryUploadModal';
import ProjectDetailModal from './component/project/ProjectDetailModal';
import ProjectEditModal from './component/project/ProjectEditModal';
import ProjectUploadModal from './component/project/ProjectUploadModal';
import SessionDetailModal from './component/session/SessionDetailModal';
import SessionEditModal from './component/session/SessionEditModal';
import SessionUploadModal from './component/session/SessionUploadModal';
import { containerCss, media } from '@utils/constant/breakpoint';

type GalleryTabKey = 'session' | 'project' | 'gallery';
type FilterKey = 'generation' | 'track' | 'category';

const isGalleryTabKey = (value: unknown): value is GalleryTabKey =>
  value === 'session' || value === 'project' || value === 'gallery';

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

const LIST_QUERY_KEY_BY_TAB: Record<GalleryTabKey, string> = {
  session: 'gallerySessions',
  project: 'galleryProjects',
  gallery: 'galleryHistories',
};

const PROJECT_CATEGORY_FILTER_OPTIONS = ['전체', ...Object.values(GALLERY_PROJECT_CATEGORY_LABEL)];
const ALL_OPTION = '전체';
// 기수 필터가 "전체"일 때, 기수별로 파트명 체계가 달라도(기획디자인 vs 기획+디자인)
// 하나의 목록에서 항상 이 순서로 보여주기 위한 기준
const ALL_GENERATIONS_PART_ORDER = [COMMON_PART_NAME, '기획디자인', '기획', '디자인', '프론트엔드', '백엔드'];
const sortByAllGenerationsPartOrder = (a: string, b: string) => {
  const indexA = ALL_GENERATIONS_PART_ORDER.indexOf(a);
  const indexB = ALL_GENERATIONS_PART_ORDER.indexOf(b);
  return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
};
// const WIKI_URL = 'https://wiki.cau-likelion.org';

const toDisplayDate = (isoDate: string | undefined) => (isoDate ?? '').split('T')[0].replaceAll('-', '/');
const toPeriodDisplay = (startDate: string, endDate: string | null) =>
  `${toDisplayDate(startDate)}${endDate && endDate !== startDate ? `-${toDisplayDate(endDate)}` : ''}`;

const GalleryListSection = () => {
  const router = useRouter();
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
  const queryClient = useQueryClient();

  const queryTab = router.isReady && isGalleryTabKey(router.query.tab) ? router.query.tab : null;
  const [syncedQueryTab, setSyncedQueryTab] = useState<GalleryTabKey | null>(null);
  if (queryTab !== null && queryTab !== syncedQueryTab) {
    setSyncedQueryTab(queryTab);
    setActiveTab(queryTab);
  }

  const tokenState = useTokenStore((state) => state.token);
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    enabled: !!tokenState.access,
  });
  // 프로젝트/갤러리 게시물 생성·수정·삭제는 운영진 이상만 가능 (역할 정의: 운영진/회장/admin)
  const isStaff = !!userProfile && isAdminRole(userProfile.role);

  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
  } = useQuery({ queryKey: ['gallerySessions'], queryFn: getSessionList });
  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useQuery({ queryKey: ['galleryProjects'], queryFn: getGalleryProjectList });
  const {
    data: histories,
    isLoading: isHistoriesLoading,
    isError: isHistoriesError,
  } = useQuery({ queryKey: ['galleryHistories'], queryFn: getHistoryList });
  const { data: generations } = useQuery({ queryKey: ['generations'], queryFn: getGenerations });

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
  const { data: projectDetail } = useQuery({
    queryKey: ['galleryProjectDetail', selectedId],
    queryFn: () => getGalleryProject(selectedId as number),
    enabled: activeTab === 'project' && selectedId !== null,
  });

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
  const invalidateActiveTabList = () => queryClient.invalidateQueries({ queryKey: [LIST_QUERY_KEY_BY_TAB[activeTab]] });

  const handleUploadSuccess = () => {
    invalidateActiveTabList();
    showToast('등록이 완료되었습니다.');
  };
  const handleEditSuccess = () => {
    invalidateActiveTabList();
    showToast('변경사항이 저장되었습니다.');
  };
  const handleDeleteSuccess = () => {
    invalidateActiveTabList();
    showToast('삭제가 완료되었습니다.');
  };

  const generationOptions = useMemo(() => {
    const source: { generationNumber: number }[] =
      activeTab === 'session' ? (sessions ?? []) : activeTab === 'project' ? (projects ?? []) : (histories ?? []);
    const numbers = Array.from(new Set(source.map((item) => item.generationNumber))).sort((a, b) => b - a);
    return [ALL_OPTION, ...numbers.map((n) => `${n}기`)];
  }, [activeTab, sessions, projects, histories]);

  const partOptions = useMemo(() => {
    if (!generations) return [ALL_OPTION];
    if (generation === ALL_OPTION) {
      const parts = Array.from(
        new Set([...generations.flatMap((item) => item.parts.map((part) => part.name)), COMMON_PART_NAME]),
      ).sort(sortByAllGenerationsPartOrder);
      return [ALL_OPTION, ...parts];
    }
    const generationNumber = Number(generation.replace('기', ''));
    const matched = generations.find((item) => item.number === generationNumber);
    return [ALL_OPTION, ...(matched?.parts.map((part) => part.name) ?? [])];
  }, [generations, generation]);

  const sessionCards = (sessions ?? []).filter(
    (item) =>
      (generation === ALL_OPTION || `${item.generationNumber}기` === generation) &&
      (track === ALL_OPTION || item.partName === track),
  );
  const projectCards = (projects ?? []).filter(
    (item) =>
      (generation === ALL_OPTION || `${item.generationNumber}기` === generation) &&
      (projectCategory === ALL_OPTION || GALLERY_PROJECT_CATEGORY_LABEL[item.category] === projectCategory),
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
          imageUrls={sessionDetail.imageUrls}
          onClose={closeDetailModal}
          onEdit={isStaff ? openEditModal : undefined}
        />
      );
    }
    if (activeTab === 'project' && projectDetail) {
      return (
        <ProjectDetailModal
          title={projectDetail.title}
          badges={[`${projectDetail.generationNumber}기`, GALLERY_PROJECT_CATEGORY_LABEL[projectDetail.category]]}
          description={projectDetail.description}
          date={[
            toDisplayDate(projectDetail.startDate),
            toDisplayDate(projectDetail.endDate ?? projectDetail.startDate),
          ]}
          imageUrls={projectDetail.imageUrls}
          onClose={closeDetailModal}
          onEdit={isStaff ? openEditModal : undefined}
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
          imageUrls={historyDetail.imageUrls}
          onClose={closeDetailModal}
          onEdit={isStaff ? openEditModal : undefined}
        />
      );
    }
    return null;
  };

  const renderEditModal = () => {
    if (activeTab === 'session' && sessionDetail) {
      return (
        <SessionEditModal
          id={sessionDetail.id}
          initialValues={{
            title: sessionDetail.title,
            content: sessionDetail.description,
            generation: String(sessionDetail.generationNumber),
            category: sessionDetail.partName,
            week: String(sessionDetail.degree),
            date: sessionDetail.sessionDate.split('T')[0],
            imageUrls: sessionDetail.imageUrls,
            thumbnailUrl: sessionDetail.thumbnailUrl,
          }}
          onClose={closeEditModal}
          onDeleteSuccess={handleDeleteSuccess}
          onSubmitSuccess={handleEditSuccess}
        />
      );
    }
    if (activeTab === 'project' && projectDetail) {
      return (
        <ProjectEditModal
          id={projectDetail.id}
          initialValues={{
            title: projectDetail.title,
            content: projectDetail.description,
            generation: String(projectDetail.generationNumber),
            category: GALLERY_PROJECT_CATEGORY_LABEL[projectDetail.category],
            dateRange: [projectDetail.startDate, projectDetail.endDate ?? projectDetail.startDate],
            imageUrls: projectDetail.imageUrls,
            thumbnailUrl: projectDetail.imageUrls[0],
          }}
          onClose={closeEditModal}
          onDeleteSuccess={handleDeleteSuccess}
          onSubmitSuccess={handleEditSuccess}
        />
      );
    }
    if (activeTab === 'gallery' && historyDetail) {
      return (
        <HistoryEditModal
          id={historyDetail.id}
          initialValues={{
            title: historyDetail.title,
            content: historyDetail.description,
            generation: String(historyDetail.generationNumber),
            dateRange: [historyDetail.startDate, historyDetail.endDate ?? historyDetail.startDate],
            imageUrls: historyDetail.imageUrls,
            thumbnailUrl: historyDetail.imageUrls[0],
          }}
          onClose={closeEditModal}
          onDeleteSuccess={handleDeleteSuccess}
          onSubmitSuccess={handleEditSuccess}
        />
      );
    }
    return null;
  };

  return (
    <Wrapper>
      <Header>
        <Intro title="갤러리" subtitle="멋사 중앙대의 성장과 추억의 기록" />
        <GalleryTab items={TABS} activeKey={activeTab} onChange={handleTabChange} size="medium" />
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
                setTrack(ALL_OPTION);
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
          {isStaff && (
            <AddButtonWrapper>
              <Button
                variant="solid"
                color="primary"
                size="large"
                trailingIcon={<IcAdd width={20} height={20} />}
                onClick={() => setIsUploadModalOpen(true)}
              >
                {ADD_BUTTON_LABEL[activeTab]}
              </Button>
            </AddButtonWrapper>
          )}
        </FilterRow>
      </Header>

      {isUploadModalOpen && <UploadModal onClose={closeUploadModal} onSuccess={handleUploadSuccess} />}
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

      {activeTab === 'session' &&
        (isSessionsLoading ? (
          <LoadingWrapper>
            <CircularLoading size={32} />
          </LoadingWrapper>
        ) : isSessionsError ? (
          <EmptyState variant="error" />
        ) : sessionCards.length === 0 ? (
          <EmptyState message="조건에 맞는 게시물이 없습니다." />
        ) : (
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
        ))}
      {activeTab === 'project' &&
        (isProjectsLoading ? (
          <LoadingWrapper>
            <CircularLoading size={32} />
          </LoadingWrapper>
        ) : isProjectsError ? (
          <EmptyState variant="error" />
        ) : projectCards.length === 0 ? (
          <EmptyState message="조건에 맞는 게시물이 없습니다." />
        ) : (
          <CardGrid>
            {projectCards.map((item) => (
              <Card
                key={item.id}
                thumbnailRatio={16 / 9}
                thumbnailSrc={item.thumbnailUrl}
                title={item.title}
                onClick={() => setSelectedId(item.id)}
                bottomContent={
                  <BottomContent>
                    <BadgeRow>
                      {[`${item.generationNumber}기`, GALLERY_PROJECT_CATEGORY_LABEL[item.category]].map((badge) => (
                        <ContentBadge key={badge} text={badge} color="accent" size="medium" />
                      ))}
                    </BadgeRow>
                    <Period>{toPeriodDisplay(item.startDate, item.endDate)}</Period>
                  </BottomContent>
                }
              />
            ))}
          </CardGrid>
        ))}
      {activeTab === 'gallery' &&
        (isHistoriesLoading ? (
          <LoadingWrapper>
            <CircularLoading size={32} />
          </LoadingWrapper>
        ) : isHistoriesError ? (
          <EmptyState variant="error" />
        ) : historyCards.length === 0 ? (
          <EmptyState message="조건에 맞는 게시물이 없습니다." />
        ) : (
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
        ))}
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
  gap: 42px;
`;

const Intro = styled(PageHeader)`
  gap: 24px;
  padding-bottom: 22px;

  @media (max-width: 600px) {
    padding-top: 52px;

    p:first-of-type {
      ${typographyCss(Typography.display2.bold)}
    }
  }
`;

const GalleryTab = styled(Tab)`
  @media (max-width: 600px) {
    height: 56px;

    button {
      ${typographyCss(Typography.heading2.bold)}
    }
  }
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

  @media (max-width: 600px) {
    width: 100%;
  }
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

const AddButtonWrapper = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;

const CardGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
  row-gap: 40px;

  ${media.xs} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(5, 1fr);
  }
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
