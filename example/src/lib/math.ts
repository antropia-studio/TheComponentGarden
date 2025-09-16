export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Calculates the coordinates of a point on a circle's circumference
 * @param radius - The radius of the circle
 * @param sections - The total number of sections to divide the circle into
 * @param index - The index of the current section (0-based)
 * @returns The x and y coordinates of the point
 */
export function getCircleCoordinates({
  radius,
  sections,
  index,
}: {
  radius: number;
  sections: number;
  index: number;
}): Coordinates {
  const angleInRadians = (2 * Math.PI * index) / sections;

  return {
    x: radius * Math.cos(angleInRadians),
    y: radius * Math.sin(angleInRadians),
  };
}
