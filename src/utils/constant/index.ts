// example

export const GENERATION_CHECKER = 2012;

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
  ETC,
}

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

export enum ACTIVITY {
  SESSION,
  IDEATHON,
  HACKATHON,
  CAUTHON,
  STUDY,
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

export const TRACK_INDEX: { [key: string]: number } = {
  기획: TRACK.PM,
  디자인: TRACK.DESIGN,
  프론트엔드: TRACK.FRONTEND,
  백엔드: TRACK.BACKEND,
  기타: TRACK.ETC,
};

export const TRACK_NAME: { [key: number]: string } = {
  [TRACK.PM]: '기획',
  [TRACK.DESIGN]: '디자인',
  [TRACK.FRONTEND]: '프론트엔드',
  [TRACK.BACKEND]: '백엔드',
  [TRACK.ETC]: '기타',
};

export const ACTIVITY_NAME: { [key: number]: string } = {
  [ACTIVITY.SESSION]: '정기세션',
  [ACTIVITY.IDEATHON]: '아이디어톤',
  [ACTIVITY.HACKATHON]: '해커톤',
  [ACTIVITY.CAUTHON]: '중앙톤',
  [ACTIVITY.STUDY]: '스터디',
};

export const ACTIVITY_DESCRIPTION: { [key: number]: { description: string } } = {
  [ACTIVITY.SESSION]: {
    description:
      '멋쟁이사자처럼의 커리큘럼은 파트별 정기 세션을 기본으로 합니다. 주 1회 대면 세션을 원칙으로 하며, 운영진들이 열정적인 세션으로 처음 IT 분야에 입문하시는 분들도 따라오실 수 있도록 이끌어드립니다.',
  },
  [ACTIVITY.IDEATHON]: {
    description:
      '아이디어톤은 팀 프로젝트를 통해 실현하고 싶은 아이디어를 발표하는 행사입니다. 전국의 멋사 대학 학생들이 모여 아이디어를 공유하는 네트워킹의 장입니다.',
  },
  [ACTIVITY.HACKATHON]: {
    description:
      '멋사의 꽃, 해커톤은 실제 아이디어가 구현되는 진정한 축제의 장입니다. 한 달간 열심히 만들어낸 프로젝트를 발표합니다.',
  },
  [ACTIVITY.CAUTHON]: {
    description:
      '중앙대 해커톤은 중앙대 멋사인들의 마지막 공식 행사입니다. 아이디어톤, 해커톤으로 쌓아 올린 기획, 디자인, 개발 실력으로 중앙인만의 서비스를 선보입니다.',
  },
  [ACTIVITY.STUDY]: {
    description:
      '중앙대 멋쟁이사자처럼은 각 파트의 활발한 스터디 활동을 권장합니다. 익히고 싶은 신기술부터 알고리즘, CS, 기획, 디자인까지 적극적인 스터디 활동에 참여해보세요.',
  },
};

export const TRACK_DESCRIPTION: { [key: number]: { description: string; recommend: string } } = {
  [TRACK.PM]: {
    description:
      '기획 파트에서는 고객의 목소리를 들으며 우리 주변에 있는 Pain-Point를 모색하고, SaaS 서비스를 직접 출시해요. 협업에서는 Team Leader 로서 프로젝트의 진행을 리드하고,  디자이너 및 개발자와 협업해요.  덕분에 IT 서비스 출시의 AtoZ를 경험할 수 있어요. 이를 위해 와이어프레임, Flowchart 등 협업에 꼭 필요한 내용들을 설계하는 것을 배워요.',
    recommend:
      '서비스 기획자나 PM이 되기 위한 역량을 키우고 싶은 분들, 아직 기획을 제대로 배워본 적은 없지만, 본인의 아이디어를 실현해보고자 하는 열정이 가득한 분, 같이 창업할 팀원이나, 기획 및 IT 관련 스터디를 진행할 메이트를 구하고 싶은 분들께 추천해요!',
  },
  [TRACK.DESIGN]: {
    description:
      '디자인 파트에서는 웹을 디자인하기 위한 기초적인 스킬을 배울 수 있어요! 디자인 툴을 익히고 다양한 웹 디자인의 이론과 용어 등 기초를 배우고 앞으로의 협업에 도움이 될 스킬을 키우는 것을 공부합니다. 이를 통해 기획자와 협업하며 주변에서 자주 보는 웹 화면을 직접 구성하고 개발자와의 소통 과정을 거쳐 적절한 디자인을 구현할 수 있어요.',
    recommend:
      '생각을 자유롭게 표현하는 것을 즐기는 분에게 추천해요. 팀원들과 소통을 통해서 더 멋있는 아이디어를 만드는 분을 환영합니다!',
  },
  [TRACK.FRONTEND]: {
    description:
      '프론트엔드 파트은 사용자와 가장 가까운 개발 파트입니다! 웹 클라이언트 개발을 위한 기초부터 심화까지의 스킬들을 배울 수 있어요! HTML, CSS, Javascript를 학습하고 NodeJS, Webpack, Babel을 거쳐 React로 나아갑니다!',
    recommend:
      'UI/UX에 관심있거나 디자이너와의 협업을 통해 사용자 인터페이스를 시각적으로 구현해내는 과정에 흥미를 느끼시는 분들께 추천해요!',
  },
  [TRACK.BACKEND]: {
    description:
      '백엔드 개발자는 눈에 보이지 않는 서버를 전반적으로 담당합니다! API의 개념을 배우고, 서비스의 요구사항에 맞춰 API를 개발하고, 배포/운영하여 데이터를 관리해 볼 수 있어요. Django, DRF, Spring과 같은 프레임 워크를 바탕으로 서비스 운영을 위한 전반적인 인프라를 구현해요!',
    recommend:
      '서비스의 주요 기능 설계와 서버 운영에 관심이 있는 분들께 추천해요. 논리적이고, 효율적으로 코드를 설계해 보고 싶은 분들을 환영합니다!',
  },
};
