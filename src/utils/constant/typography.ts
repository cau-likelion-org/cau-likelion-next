export const FontFamily = 'Pretendard';

export interface TypographyToken {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
}

const font = (weight: number, size: number, lineHeight: number, letterSpacingPercent: number): TypographyToken => ({
  fontFamily: FontFamily,
  fontWeight: weight,
  fontSize: `${size}px`,
  lineHeight,
  letterSpacing: letterSpacingPercent === 0 ? '0em' : `${(letterSpacingPercent / 100).toFixed(4)}em`,
});

export const Typography = {
  display1: {
    bold: font(700, 56, 1.286, -3.19),
    medium: font(500, 56, 1.286, -3.19),
    regular: font(400, 56, 1.286, -3.19),
  },
  display2: {
    bold: font(700, 40, 1.3, -2.82),
    medium: font(500, 40, 1.3, -2.82),
    regular: font(400, 40, 1.3, -2.82),
  },
  display3: {
    bold: font(700, 36, 1.334, -2.7),
    medium: font(500, 36, 1.334, -2.7),
    regular: font(400, 36, 1.334, -2.7),
  },
  title1: {
    bold: font(700, 32, 1.375, -2.53),
    medium: font(500, 32, 1.375, -2.53),
    regular: font(400, 32, 1.375, -2.53),
  },
  title2: {
    bold: font(700, 28, 1.358, -2.36),
    medium: font(500, 28, 1.358, -2.36),
    regular: font(400, 28, 1.358, -2.36),
  },
  title3: {
    bold: font(700, 24, 1.334, -2.3),
    medium: font(500, 24, 1.334, -2.3),
    regular: font(400, 24, 1.334, -2.3),
  },
  heading1: {
    bold: font(600, 22, 1.364, -1.94),
    medium: font(500, 22, 1.364, -1.94),
    regular: font(400, 22, 1.364, -1.94),
  },
  heading2: {
    bold: font(600, 20, 1.4, -1.2),
    medium: font(500, 20, 1.4, -1.2),
    regular: font(400, 20, 1.4, -1.2),
  },
  headline1: {
    bold: font(600, 18, 1.445, -0.02),
    medium: font(500, 18, 1.445, -0.02),
    regular: font(400, 18, 1.445, -0.02),
  },
  headline2: {
    bold: font(600, 17, 1.412, 0),
    medium: font(500, 17, 1.412, 0),
    regular: font(400, 17, 1.412, 0),
  },
  body1Normal: {
    bold: font(600, 16, 1.5, 0.57),
    medium: font(500, 16, 1.5, 0.57),
    regular: font(400, 16, 1.5, 0.57),
  },
  body1Reading: {
    bold: font(600, 16, 1.625, 0.57),
    medium: font(500, 16, 1.625, 0.57),
    regular: font(400, 16, 1.625, 0.57),
  },
  body2Normal: {
    bold: font(600, 15, 1.467, 0.96),
    medium: font(500, 15, 1.467, 0.96),
    regular: font(400, 15, 1.467, 0.96),
  },
  body2Reading: {
    bold: font(600, 15, 1.6, 0.96),
    medium: font(500, 15, 1.6, 0.96),
    regular: font(400, 15, 1.6, 0.96),
  },
  label1Normal: {
    bold: font(600, 14, 1.429, 1.45),
    medium: font(500, 14, 1.429, 1.45),
    regular: font(400, 14, 1.429, 1.45),
  },
  label1Reading: {
    bold: font(600, 14, 1.571, 1.45),
    medium: font(500, 14, 1.571, 1.45),
    regular: font(400, 14, 1.571, 1.45),
  },
  label2: {
    bold: font(600, 13, 1.385, 1.94),
    regular: font(400, 13, 1.385, 1.94),
  },
  caption1: {
    bold: font(600, 12, 1.334, 2.52),
    medium: font(500, 12, 1.334, 2.52),
    regular: font(400, 12, 1.334, 2.52),
  },
  caption2: {
    bold: font(600, 11, 1.273, 3.11),
    medium: font(500, 11, 1.273, 3.11),
    regular: font(400, 11, 1.273, 3.11),
  },
} as const;
