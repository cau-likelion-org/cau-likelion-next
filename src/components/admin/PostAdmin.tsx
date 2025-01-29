import { IProjectDetail, UploadData } from '@@types/request';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { postGalleryData } from 'src/apis/admin';
import { token } from '@utils/state';
import useInput from 'src/hooks/useInput';
import styled from 'styled-components';

const PostAdmin = () => {
  // Input 상태 관리
  const [title, onChangeTitle] = useInput('');
  const [subTitle, onChangeSubTitle] = useInput('');
  const [devStack, onChangeDevStack] = useInput('');
  const [version, onChangeVersion] = useInput('');
  const [teamName, onChangeTeamName] = useInput('');
  const [pm, onChangePm] = useInput('');
  const [de, onChangeDe] = useInput('');
  const [fe, onChangeFe] = useInput('');
  const [be, onChangeBe] = useInput('');
  const [start, onChangeStart] = useInput('');
  const [end, onChangeEnd] = useInput('');
  const [description, onChangeDescription] = useInput('');
  const [webLink, onChangeWebLink] = useInput('');
  const [gitLink, onChangeGitLink] = useInput('');
  const [youtubeLink, onChangeYoutubeLink] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  // 파일 업로드 핸들러
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prevImages) => [...prevImages, ...Array.from(e.target.files as FileList)]);
    }
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!thumbnail || images.length === 0) {
      alert('썸네일과 이미지를 모두 업로드해주세요.');
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('subtitle', subTitle);
    formData.append('dev_stack', devStack);
    formData.append('version', version);
    formData.append('team_name', teamName);
    formData.append('start_date', start);
    formData.append('end_date', end);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('login_email', 'adsf');
    formData.append(
      'team_member',
      JSON.stringify({
        pm: pm.split(','),
        design: de.split(','),
        frontend: fe.split(','),
        backend: be.split(','),
      }),
    );

    formData.append(
      'link',
      JSON.stringify({
        github: gitLink,
        youtube: youtubeLink,
        web: webLink,
      }),
    );

    // 썸네일 파일 추가
    formData.append('thumbnail', thumbnail);

    // 이미지 배열 추가
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const result = await postGalleryData(formData);
      console.log(result);
      alert('업로드 성공');
    } catch (error) {
      console.error(error);
      alert('업로드 실패');
    }
  };

  return (
    <Wrapper>
      <h1>프로젝트 업로드</h1>
      <input type="text" value={title} onChange={onChangeTitle} placeholder="제목" />
      <input type="text" value={subTitle} onChange={onChangeSubTitle} placeholder="부제목" />
      <input type="text" value={devStack} onChange={onChangeDevStack} placeholder="개발 스택" />
      <input type="text" value={version} onChange={onChangeVersion} placeholder="버전" />
      <input type="text" value={teamName} onChange={onChangeTeamName} placeholder="팀 이름" />
      <input type="text" value={pm} onChange={onChangePm} placeholder="PM" />
      <input type="text" value={de} onChange={onChangeDe} placeholder="디자인" />
      <input type="text" value={fe} onChange={onChangeFe} placeholder="프론트엔드" />
      <input type="text" value={be} onChange={onChangeBe} placeholder="백엔드" />
      <input type="string" value={start} onChange={onChangeStart} placeholder="시작 날짜" />
      <input type="string" value={end} onChange={onChangeEnd} placeholder="종료 날짜" />
      <input type="string" onChange={onChangeDescription} placeholder="설명"></input>
      <input type="url" value={webLink} onChange={onChangeWebLink} placeholder="웹 링크" />
      <input type="url" value={gitLink} onChange={onChangeGitLink} placeholder="깃 링크" />
      <input type="url" value={youtubeLink} onChange={onChangeYoutubeLink} placeholder="깃 링크" />
      <input type="text" value={category} onChange={onChangeCategory} placeholder="카테고리" />

      <Title>프로젝트 썸네일 이미지</Title>
      <input type="file" accept="image/*" onChange={handleThumbnailChange} />

      <Title>프로젝트 이미지</Title>
      <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

      <button onClick={handleSubmit}>업로드하기</button>
    </Wrapper>
  );
};

export default PostAdmin;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;
