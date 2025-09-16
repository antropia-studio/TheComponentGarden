const baseColors = {
  blinkingBlue: "#0030FF",
  sasquatchSocks: "#FF4B7E",
  white: "#FFFFFF",
  black: "#000000",
};

const themeColors = {
  primary: baseColors.blinkingBlue,
  "primary-content": baseColors.white,
  secondary: baseColors.sasquatchSocks,
  "secondary-content": baseColors.white,
};

export const colors = { ...baseColors, ...themeColors };
