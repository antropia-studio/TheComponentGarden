const baseColors = {
  blinkingBlue: "#0030FF",
  sasquatchSocks: "#FF4B7E",
  benzolGreen: "#00DC64",
  grannySmithApple: "#9FE38E",
  alucardsNight: "#030454",
  white: "#FFFFFF",
  black: "#000000",
};

const themeColors = {
  primary: baseColors.blinkingBlue,
  "primary-content": baseColors.white,
  secondary: baseColors.sasquatchSocks,
  "secondary-content": baseColors.white,
  tertiary: baseColors.benzolGreen,
  "tertiary-content": baseColors.black,
  neutral: baseColors.alucardsNight,
  "neutral-content": baseColors.white,
};

export const colors = { ...baseColors, ...themeColors };
