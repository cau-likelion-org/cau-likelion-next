// xs는 sm 미만 구간을 가리키는 이름
export const Breakpoint = {
  sm: 768, // 태블릿 세로
  md: 992, // 태블릿 가로
  lg: 1200, // 데스크톱
  xl: 1600, // 와이드 데스크톱
} as const;

export const XS_MEDIA_QUERY = `(max-width: ${Breakpoint.sm - 1}px)`;

export const media = {
  xs: `@media ${XS_MEDIA_QUERY}`,
  sm: `@media (min-width: ${Breakpoint.sm}px)`,
  md: `@media (min-width: ${Breakpoint.md}px)`,
  lg: `@media (min-width: ${Breakpoint.lg}px)`,
  xl: `@media (min-width: ${Breakpoint.xl}px)`,
} as const;

// 콘텐츠 좌우 여백
export const ContainerPadding = 20;

// 좌우 패딩을 포함한 값
export const ContainerMaxWidth = {
  lg: 1100,
  xl: 1436,
} as const;

export const containerCss = `
  width: 100%;
  margin: 0 auto;
  padding-left: ${ContainerPadding}px;
  padding-right: ${ContainerPadding}px;

  ${media.lg} {
    max-width: ${ContainerMaxWidth.lg}px;
  }
  ${media.xl} {
    max-width: ${ContainerMaxWidth.xl}px;
  }
`;
