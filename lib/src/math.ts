export interface Coordinates {
  x: number;
  y: number;
}

export type Vector = Coordinates;

/**
 * Calculates the coordinates of a point on a circle's circumference based on the given radius and angle in radians.
 */
export const fromPolarToCartesianCoordinates = ({
  angleInRadians,
  offsetRadius = 0,
  radius,
}: {
  angleInRadians: number;
  offsetRadius?: number;
  radius: number;
}): Coordinates => {
  "worklet";

  return {
    x: radius * Math.cos(offsetRadius + angleInRadians),
    y: radius * Math.sin(offsetRadius + angleInRadians),
  };
};

export const vectorFromCoordinates = ({
  coords1,
  coords2,
}: {
  coords1: Coordinates;
  coords2: Coordinates;
}): Vector => {
  "worklet";

  return {
    x: coords2.x - coords1.x,
    y: coords2.y - coords1.y,
  };
};

export const vectorMagnitude = (vector: Vector): number => {
  "worklet";

  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

export const normalizeVector = (vector: Vector): Vector => {
  "worklet";

  const magnitude = vectorMagnitude(vector);
  return { x: vector.x / magnitude, y: vector.y / magnitude };
};

export const multiply = ({
  coordinates,
  factor,
}: {
  coordinates: Coordinates;
  factor: Coordinates;
}) => {
  "worklet";

  return {
    x: coordinates.x * factor.x,
    y: coordinates.y * factor.y,
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
 * Calculates the weighted position between multiple points based on a ratio.
 * @param points An array of coordinates to interpolate between
 * @param ratio A value between 0 and 1, where 0 returns the first point and 1 returns the last point
 * @returns The interpolated position between all points
 */
export const calculateWeightedPosition = ({
  points,
  ratio,
}: {
  readonly points: Coordinates[];
  ratio: number;
}): Coordinates => {
  "worklet";

  if (points.length === 0) {
    throw new Error("Points array cannot be empty");
  }

  if (points.length === 1 && points[0]) {
    return points[0];
  }

  if (points.length === 2 && points[0] && points[1]) {
    return calculateWeightedMidPoint({
      point1: points[0],
      point2: points[1],
      ratio,
    });
  }

  const segmentCount = points.length - 1;
  const scaledRatio = ratio * segmentCount;
  const segmentIndex = Math.min(Math.floor(scaledRatio), segmentCount - 1);
  const segmentRatio = scaledRatio - segmentIndex;

  // biome-ignore-start lint/style/noNonNullAssertion: Points are guaranteed to be defined here
  return calculateWeightedMidPoint({
    point1: points[segmentIndex]!,
    point2: points[segmentIndex + 1]!,
    ratio: segmentRatio,
  });
  // biome-ignore-end lint/style/noNonNullAssertion: Points are guaranteed to be defined here
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
