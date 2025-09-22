export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Calculates the coordinates of a point on a circle's circumference based on the given radius and angle in radians.
 */
export const fromPolarToCartesianCoordinates = ({
  radius,
  angleInRadians,
}: {
  radius: number;
  angleInRadians: number;
}): Coordinates => {
  "worklet";

  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
};

/**
 * Constrains a number within a minimum and maximum range.
 */
export const clamp = ({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}): number => {
  "worklet";

  return Math.min(Math.max(value, min), max);
};

/**
 * Calculates the weighted midpoint between two points based on a ratio.
 * @param point1 The first point
 * @param point2 The second point
 * @param ratio A value between 0 and 1, where 0 returns point1 and 1 returns point2
 */
export const calculateWeightedMidPoint = ({
  point1,
  point2,
  ratio,
}: {
  point1: Coordinates;
  point2: Coordinates;
  ratio: number;
}): Coordinates => {
  "worklet";

  return {
    x: point1.x * (1 - ratio) + point2.x * ratio,
    y: point1.y * (1 - ratio) + point2.y * ratio,
  };
};

/**
 * Calculates the positive modulus of a number, ensuring the result is always
 * between 0 and the divisor (exclusive), regardless of whether the dividend is negative.
 *
 * In JavaScript, the standard modulo operation (%) preserves the sign of the dividend,
 * which can result in negative values. This function ensures the result is always positive.
 *
 * @param dividend - The number to divide (can be positive, negative, or zero)
 * @param divisor - The divisor (must be positive)
 * @returns The positive modulus result, always between 0 and divisor (exclusive)
 * @throws Error if divisor is zero or negative
 */
export const positiveModulus = (dividend: number, divisor: number): number => {
  "worklet";

  if (divisor <= 0) {
    throw new Error("Divisor must be a positive number");
  }

  return ((dividend % divisor) + divisor) % divisor;
};
