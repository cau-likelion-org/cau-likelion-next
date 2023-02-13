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

export enum ATTENDANCE_CATEGORY {
  ABSENCE,
  TRUANCY,
  TARDINESS,
  NOTSUBMITTED,
  LATESUBMITTED,
  TOTALSCORE,
}

export const ATTENDANCE_CATEGORY_NAME: { [key: number]: string; } = {
  [ATTENDANCE_CATEGORY.ABSENCE]: '결석',
  [ATTENDANCE_CATEGORY.TRUANCY]: '무단결석',
  [ATTENDANCE_CATEGORY.TARDINESS]: '지각',
  [ATTENDANCE_CATEGORY.NOTSUBMITTED]: '과제 미제출',
  [ATTENDANCE_CATEGORY.LATESUBMITTED]: '과제 지각제출',
  [ATTENDANCE_CATEGORY.TOTALSCORE]: '총점'
}

export enum ACTIVITY {
  SESSION,
  IDEATHON,
  HACKATHON,
  CAUTHON,
  STUDY
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

export const ACTIVITY_NAME: { [key: number]: string; } = {
  [ACTIVITY.SESSION]: "정기세션",
  [ACTIVITY.IDEATHON]: "아이디어톤",
  [ACTIVITY.HACKATHON]: "해커톤",
  [ACTIVITY.CAUTHON]: "중앙톤",
  [ACTIVITY.STUDY]: "스터디",
};

export const ACTIVITY_DESCRIPTION: { [key: number]: { description: string; }; } = {
  [ACTIVITY.SESSION]: {
    description: '멋쟁이사자처럼의 커리큘럼은 트랙별 정기 세션을 기본으로 합니다. 주 1회 대면 세션을 원칙으로 하며, 운영진들이 열정적인 세션으로 처음 IT 분야에 입문하시는 분들도 따라오실 수 있도록 이끌어드립니다.'
  },
  [ACTIVITY.IDEATHON]: {
    description: '아이디어톤은 팀 프로젝트를 통해 실현하고 싶은 아이디어를 발표하는 행사입니다. 전국의 멋사 대학 학생들이 모여 아이디어를 공유하는 네트워킹의 장입니다.'
  },
  [ACTIVITY.HACKATHON]: {
    description: '멋사의 꽃, 해커톤은 실제 아이디어가 구현되는 진정한 축제의 장입니다. 한 달간 열심히 만들어낸 프로젝트를 발표합니다.'
  },
  [ACTIVITY.CAUTHON]: {
    description: '중앙대 해커톤은 중앙대 멋사인들의 마지막 공식 행사입니다. 아이디어톤, 해커톤으로 쌓아 올린 기획, 디자인, 개발 실력으로 중앙인만의 서비스를 선보입니다.'
  },
  [ACTIVITY.STUDY]: {
    description: '중앙대 멋쟁이사자처럼은 각 트랙의 활발한 스터디 활동을 권장합니다. 익히고 싶은 신기술부터 알고리즘, CS, 기획, 디자인까지 적극적인 스터디 활동에 참여해보세요.'
  },
};
