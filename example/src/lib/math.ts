export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Calculates the coordinates of a point on a circle's circumference based on the given radius and angle in radians.
 */
export function fromPolarToCartesianCoordinates({
  radius,
  angleInRadians,
}: {
  radius: number;
  angleInRadians: number;
}): Coordinates {
  "worklet";

  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
}

/**
 * Constrains a number within a minimum and maximum range.
 */
export function clamp({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}): number {
  "worklet";

  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the weighted midpoint between two points based on a ratio.
 * @param point1 The first point
 * @param point2 The second point
 * @param ratio A value between 0 and 1, where 0 returns point1 and 1 returns point2
 */
export function calculateWeightedMidPoint({
  point1,
  point2,
  ratio,
}: {
  point1: Coordinates;
  point2: Coordinates;
  ratio: number;
}): Coordinates {
  "worklet";

  const clampedRatio = clamp({ max: 1, min: 0, value: ratio });

  return {
    x: point1.x * (1 - clampedRatio) + point2.x * clampedRatio,
    y: point1.y * (1 - clampedRatio) + point2.y * clampedRatio,
  };
}
