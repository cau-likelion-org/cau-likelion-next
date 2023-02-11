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

export const TRACK_INDEX: { [key: string]: number } = {
  기획: TRACK.PM,
  디자인: TRACK.DESIGN,
  프론트엔드: TRACK.FRONTEND,
  백엔드: TRACK.BACKEND,
};

export const TRACK_NAME: { [key: number]: string } = {
  [TRACK.PM]: '기획',
  [TRACK.DESIGN]: '디자인',
  [TRACK.FRONTEND]: '프론트엔드',
  [TRACK.BACKEND]: '백엔드',
};

export const TRACK_DESCRIPTION: { [key: number]: { description: string; recommend: string } } = {
  [TRACK.PM]: {
    description: '기획 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend: '평소에 기획에 관심이 많고 어쩌고 저쩌고 한 분들께 추천합니다.',
  },
  [TRACK.DESIGN]: {
    description:
      '디자인 트랙에서는 웹을 디자인하기 위한 기초적인 스킬을 배울 수 있어요! 디자인 툴을 익히고 다양한 웹 디자인의 이론과 용어 등 기초를 배우고 앞으로의 협업에 도움이 될 스킬을 키우는 것을 공부합니다. 이를 통해 기획자와 협업하며 주변에서 자주 보는 웹 화면을 직접 구성하고 개발자와의 소통 과정을 거쳐 적절한 디자인을 구현할 수 있어요.',
    recommend:
      '생각을 자유롭게 표현하는 것을 즐기는 분에게 추천해요. 팀원들과 소통을 통해서 더 멋있는 아이디어를 만드는 분을 환영합니다!',
  },
  [TRACK.FRONTEND]: {
    description:
      '프론트엔드 트랙은 사용자와 가장 가까운 개발 트랙입니다! 웹 클라이언트 개발을 위한 기초부터 심화까지의 스킬들을 배울 수 있어요! HTML, CSS, Javascript를 학습하고 NodeJS, Webpack, Babel을 거쳐 React로 나아갑니다!',
    recommend:
      'UI/UX에 관심있거나 디자이너와의 협업을 통해 사용자 인터페이스를 시각적으로 구현해내는 과정에 흥미를 느끼시는 분들께 추천해요!',
  },
  [TRACK.BACKEND]: {
    description: '백엔드 트랙에서는 어쩌고 저쩌고 저쩌고 저쩌고 배웁니다!',
    recommend: '평소에 백엔드에 관심이 많고 어쩌고 저쩌고 한 분들께 추천합니다.',
  },
};
