// example

export enum MENU {
  SESSION,
  GALLERY,
  PROJECT,
  ATTENDANCE,
}

export enum TRACK {
  PM,
  DESIGN,
  FRONTEND,
  BACKEND,
}

export enum DEV_STACK {
  React,
  Typescript,
  Spring,
  NextJS,
  NodeJS,
  Django,
  //변동 가능
}
export const TRACK_INDEX: { [key: string]: number; } = {
  기획: TRACK.PM,
  디자인: TRACK.DESIGN,
  프론트엔드: TRACK.FRONTEND,
  백엔드: TRACK.BACKEND,
};

export const TRACK_NAME: { [key: number]: string; } = {
  [TRACK.PM]: '기획',
  [TRACK.DESIGN]: '디자인',
  [TRACK.FRONTEND]: '프론트엔드',
  [TRACK.BACKEND]: '백엔드',
};

export const TRACK_DESCRIPTION: { [key: number]: { description: string; recommend: string; }; } = {
  [TRACK.PM]: {
    description: '기획 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend: '평소에 기획에 관심이 많고 어쩌고 저쩌고 한 분들께 추천합니다.',
  },
  [TRACK.DESIGN]: {
    description:
      '디자인 트랙에서는 웹을 디자인하기 위한 기초적인 스킬을 배우고 익힐 수 있어요!기획자와 협업을 통해 주변에서 자주 보는 웹 화면을 직접 구성하며 개발자와의 소통을 통해 적절한 디자인을 구현할 수 있어요.다양한 웹 디자인의 이론과 용어 등 기초를 배우고 앞으로의 협업에 도움이 될 스킬을 키우는 것을 공부합니다!기획 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend:
      '평소에 디자인에 관심이 많고 웹 디자인을 구현하는데 관심이 있는 분들에게 추천해요!디자인에 열정이 있는 분이라면 모두 환영합니다!',
  },
  [TRACK.FRONTEND]: {
    description: '프론트엔드 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend: '평소에 프론트엔드에 관심이 많고 어쩌고 저쩌고 한 분들께 추천합니다.',
  },
  [TRACK.BACKEND]: {
    description: '백엔드 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend: '평소에 백엔드에 관심이 많고 어쩌고 저쩌고 한 분들께 추천합니다.',
  },
};
