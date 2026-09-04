// 어른사자가 활동 전용 메뉴에 접근했을 때 마이페이지 홈에서 띄울 안내 플래그
export const INACTIVE_MEMBER_NOTICE_KEY = 'inactiveMemberNotice';

export const NUMERIC_ONLY_REGEX = /^[0-9]*$/;

export const ROLE_LABEL: Record<'BABY_LION' | 'ADULT_LION' | 'STAFF' | 'PRESIDENT' | 'ADMIN', string> = {
  BABY_LION: '아기사자',
  ADULT_LION: '어른사자',
  STAFF: '운영진',
  PRESIDENT: '회장',
  ADMIN: '관리자',
};

export enum TRACK {
  PM_DESIGN,
  FRONTEND,
  BACKEND,
  ETC,
}

export const TRACK_NAME: { [key: number]: string } = {
  [TRACK.PM_DESIGN]: '기획디자인',
  [TRACK.FRONTEND]: '프론트엔드',
  [TRACK.BACKEND]: '백엔드',
  [TRACK.ETC]: '기타',
};

export const TRACK_OPTIONS = [TRACK_NAME[TRACK.PM_DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND]];

// 갤러리 게시물 파트 선택지에만 존재하는, 프론트엔드에서 합성한 파트("전체 파트 공통"). 백엔드 기수 파트 목록에는 없다.
export const COMMON_PART_NAME = '공통';

export const MAIN_META_DESCRIPTION = 'IT로 세상을 바꾸는 경험, 중앙대학교 IT 창업 동아리입니다.';

export enum ARCHIVING {
  GALLERY,
  PROJECT,
  BLOG,
}

export const META_DESCRIPTION: { [key: number]: string } = {
  [ARCHIVING.GALLERY]: '멋쟁이사자처럼 중앙대학교의 추억 가득한 갤러리를 둘러보세요.',
  [ARCHIVING.PROJECT]: '멋쟁이사자처럼 중앙대학교에서 탄생한 프로젝트를 소개합니다.',
  [ARCHIVING.BLOG]: '멋쟁이사자처럼 중앙대학교 구성원들이 작성한 블로그를 읽어보세요.',
};

export const META_DESCRIPTION_HEAD = {
  [ARCHIVING.GALLERY]: '갤러리',
  [ARCHIVING.PROJECT]: '프로젝트 소개',
  [ARCHIVING.BLOG]: '블로그',
};

export const PROJECT_CATEGORY_OPTIONS = ['아이디어톤', '해커톤', '중커톤', '기타'];

// 운영 도메인이 점검 모드일 때도 OG 이미지가 뜨도록, Vercel 배포 주소의 이미지도 함께 노출한다
export const DEFAULT_OG_IMAGE = 'https://cau-likelion.org/image/og-image.png';
export const DEFAULT_OG_IMAGE_FALLBACK = 'https://cau-likelion-next-ashen.vercel.app/image/og-image.png';
