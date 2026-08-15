import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { Generation, UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import MyPageShell from '@mypage/component/MyPageShell';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import BlogSection, {
  BlogItem,
  BLOG_CATEGORY_LABEL,
  BLOG_CATEGORY_BY_LABEL,
  isBlogItemInvalid,
} from '@mypage/admin/BlogSection';
import EditButton from '@mypage/admin/component/EditButton';
import { syncListSection } from '@mypage/admin/utils';
import { getUserProfile, getGenerations } from 'src/apis/account';
import { getBlogs, createBlog, updateBlog, deleteBlog, BlogResponse, BlogRequest } from 'src/apis/blog';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const blogToLocal = (blog: BlogResponse): BlogItem => ({
  id: String(blog.id),
  generation: String(blog.generationNumber),
  writer: blog.writer,
  category: BLOG_CATEGORY_LABEL[blog.category],
  url: blog.url,
});

const buildBlogToRequest =
  (generations: Generation[]) =>
  (item: BlogItem): BlogRequest => {
    const generation = generations.find((candidate) => candidate.number === Number(item.generation));
    return {
      generationId: generation?.id ?? 0,
      writer: item.writer,
      url: item.url,
      category: BLOG_CATEGORY_BY_LABEL[item.category],
    };
  };

const isBlogGenerationInvalid = (item: BlogItem, generations: Generation[]) =>
  !generations.some((generation) => generation.number === Number(item.generation));

const MyPageAdminBlog = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  // 편집 화면이라 창 포커스 시 백그라운드 재조회로 입력 중인 값이 덮어써지지 않도록 자동 재조회를 끔
  const { data: blogs, isError: isBlogsError } = useQuery({
    queryKey: ['adminBlogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  });
  const { data: generations, isError: isGenerationsError } = useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations,
    refetchOnWindowFocus: false,
  });
  const isDataLoaded = blogs !== undefined && generations !== undefined;
  const isDataError = isBlogsError || isGenerationsError;

  const [blogItems, setBlogItems] = useState<BlogItem[]>(() => (blogs ?? []).map(blogToLocal));
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 조회된 데이터가 바뀌면(최초 로드, 저장 후 재조회) 화면 편집 상태를 다시 그 값으로 맞춤
  const [syncedBlogs, setSyncedBlogs] = useState(blogs);
  if (blogs !== syncedBlogs) {
    setSyncedBlogs(blogs);
    setBlogItems((blogs ?? []).map(blogToLocal));
  }

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setBlogItems((blogs ?? []).map(blogToLocal));
    setShowErrors(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const hasError =
      blogItems.some(isBlogItemInvalid) || blogItems.some((item) => isBlogGenerationInvalid(item, generations ?? []));

    if (hasError) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setIsSaving(true);
    try {
      await syncListSection({
        currentItems: blogItems,
        originalItems: blogs ?? [],
        toLocal: blogToLocal,
        toRequest: buildBlogToRequest(generations ?? []),
        create: (form) => createBlog(tokenState, form),
        update: (id, form) => updateBlog(tokenState, id, form),
        remove: (id) => deleteBlog(tokenState, id),
      });
      await queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      setToastMessage('변경사항이 저장되었습니다.');
      setIsEditing(false);
    } catch {
      setToastMessage('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const isAuthorized = !!userProfile && isAdminRole(userProfile.role);

  return (
    <>
      <MyPageShell active="admin-blog" isAdmin={isAuthorized}>
        {!isAuthorized ? (
          <PageLoadingGate isError={isUserProfileError} />
        ) : (
          <>
            <TitleRow>
              <PageTitle>블로그 페이지 관리</PageTitle>
              <ButtonRow>
                {isEditing ? (
                  <>
                    <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button size="small" onClick={handleSave} loading={isSaving}>
                      저장
                    </Button>
                  </>
                ) : (
                  <EditButton onClick={() => setIsEditing(true)} disabled={!isDataLoaded} />
                )}
              </ButtonRow>
            </TitleRow>
            {isDataError ? (
              <EmptyState variant="error" />
            ) : !isDataLoaded ? (
              <LoadingWrapper>
                <CircularLoading size={32} />
              </LoadingWrapper>
            ) : (
              <BlogSection items={blogItems} onChange={setBlogItems} showErrors={showErrors} disabled={!isEditing} />
            )}
          </>
        )}
      </MyPageShell>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
    </>
  );
};

MyPageAdminBlog.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAdminBlog;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PageTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
