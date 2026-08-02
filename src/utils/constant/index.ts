export const GENERATION_CHECKER = 2012;

export enum MENU {
  SESSION,
  GALLERY,
  PROJECT,
  ATTENDANCE,
}

export enum TRACK {
  PM_DESIGN,
  FRONTEND,
  BACKEND,
  ETC,
}

export const TRACK_INDEX: { [key: string]: number } = {
  기획디자인: TRACK.PM_DESIGN,
  프론트엔드: TRACK.FRONTEND,
  백엔드: TRACK.BACKEND,
  기타: TRACK.ETC,
};

export const TRACK_NAME: { [key: number]: string } = {
  [TRACK.PM_DESIGN]: '기획디자인',
  [TRACK.FRONTEND]: '프론트엔드',
  [TRACK.BACKEND]: '백엔드',
  [TRACK.ETC]: '기타',
};

export const TRACK_OPTIONS = [TRACK_NAME[TRACK.PM_DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND]];

export const TRACK_DESCRIPTION: { [key: number]: { description: string; recommend: string } } = {
  [TRACK.PM_DESIGN]: {
    description:
      '기획디자인 파트에서는 고객의 목소리를 들으며 주변의 Pain-point에 맞는 서비스를 기획하고, UI/UX를 설계 및 디자인해요. 협업에서는 서비스 출시까지의 전 과정을 매니징하는 PM으로서 프로젝트 진행을 이끌고 개발자들과 소통해요. 이를 위해 기획산출물 및 디자인 시스템 구축 등 필요한 내용들을 설계하는 것을 배워요. 덕분에 IT 서비스 출시의 A to Z를 경험할 수 있어요.',
    recommend:
      '서비스 기획자나 PM, UI/UX 기획자나 PD(프로덕트 디자이너)가 되기 위한 역량을 키우고 싶은 분, 논리적인 근거에 기반하여 고객의 문제를 해결하고 싶은 분, 본인의 아이디어를 실현해보고자 하는 열정이 가득한 분',
  },
  [TRACK.FRONTEND]: {
    description:
      '프론트엔드 파트는 사용자와 가장 가까운 개발 파트입니다! 사용자 인터페이스를 구현하고 서버와 통신하며 동적인 웹사이트를 구축할 수 있어요. HTML, CSS, Javascript를 학습하고 NodeJS, Webpack, Babel을 거쳐 React, Typescript 까지 웹 클라이언트 개발을 위한 기초부터 심화까지의 스킬들을 배워나가요!',
    recommend:
      'UI/UX에 관심있거나 디자이너, 기획자, 백엔드 개발자와 다양한 협업을 통해 사용자 인터페이스를 시각적으로 구현해내는 과정에 흥미를 느끼시는 분들께 추천해요!',
  },
  [TRACK.BACKEND]: {
    description:
      '백엔드 개발자는 눈에 보이지 않는 서버를 전반적으로 담당합니다! API의 개념을 배우고, 서비스의 요구사항에 맞춰 API를 개발하고, 배포/운영하여 데이터를 관리해 볼 수 있어요. Django, DRF, Spring과 같은 프레임 워크를 바탕으로 서비스 운영을 위한 전반적인 인프라를 구현해요!',
    recommend:
      '서비스의 주요 기능 설계와 서버 운영에 관심이 있는 분들, 논리적이고 효율적으로 코드를 설계해 보고 싶은 분들에게 추천해요. 주요 기능을 담당하는 파트인 만큼, 책임감있게 활동하고 문제를 끈기있게 해결하실 수 있는 분들을 환영합니다 !',
  },
};

export enum ATTENDANCE_CATEGORY {
  ABSENCE,
  TRUANCY,
  TARDINESS,
  NOTSUBMITTED,
  LATESUBMITTED,
  TOTALSCORE,
}

export const ATTENDANCE_CATEGORY_NAME: { [key: number]: string } = {
  [ATTENDANCE_CATEGORY.ABSENCE]: '결석',
  [ATTENDANCE_CATEGORY.TRUANCY]: '무단결석',
  [ATTENDANCE_CATEGORY.TARDINESS]: '지각',
  [ATTENDANCE_CATEGORY.NOTSUBMITTED]: '미제출',
  [ATTENDANCE_CATEGORY.LATESUBMITTED]: '지각제출',
  [ATTENDANCE_CATEGORY.TOTALSCORE]: '총점',
};

export enum DEV_STACK {
  NodeJS,
  Spring,
  Django,
  Typescript,
  NextJS,
  React,
  HTML_CSS,
  JS,
}

export enum ARCHIVING {
  SESSION,
  GALLERY,
  PROJECT,
}

export const META_DESCRIPTION: { [key: number]: string } = {
  [ARCHIVING.SESSION]: 'CAU LION에서 매주 진행되는 기획, 디자인, 프론트엔드, 백엔드 정기 세션들을 둘러보세요.',
  [ARCHIVING.GALLERY]: 'CAU LION의 추억 가득한 갤러리를 둘러보세요.',
  [ARCHIVING.PROJECT]:
    'CAU LION에서 탄생한 프로젝트들을 소개합니다! 기획자, 디자이너, 개발자가 한마음으로 이뤄낸 프로젝트들을 둘러보세요.',
};

export const META_DESCRIPTION_HEAD = {
  [ARCHIVING.SESSION]: '정기세션',
  [ARCHIVING.GALLERY]: '갤러리',
  [ARCHIVING.PROJECT]: '프로젝트 소개',
};

export const PROJECT_CATEGORY_OPTIONS = ['아이디어톤', '해커톤', '중커톤'];
