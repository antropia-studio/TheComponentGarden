import {
  type Coordinates,
  fromPolarToCartesianCoordinates,
  multiply,
  positiveModulus,
} from "@antropia/the-component-garden-lib";

const angleForIndex = ({
  index,
  totalNumberOfCards,
}: {
  index: number;
  totalNumberOfCards: number;
}) => {
  "worklet";

  const baseAngle = ((2 * Math.PI) / totalNumberOfCards) * index;

  const isFirstCard = index === 0;
  const isMidCard =
    index === totalNumberOfCards / 2 && totalNumberOfCards % 2 === 0;

  const adjustmentAngle = isFirstCard || isMidCard ? 0 : -Math.PI * 0.05;

  return baseAngle + adjustmentAngle;
};

export const getCoordinatesForIndex = ({
  index,
  totalNumberOfCards,
  radius,
  compressionFactor,
}: {
  index: number;
  totalNumberOfCards: number;
  radius: number;
  compressionFactor: number;
}) => {
  "worklet";

  const coordinates = fromPolarToCartesianCoordinates({
    angleInRadians: angleForIndex({
      index,
      totalNumberOfCards,
    }),
    offsetRadius: Math.PI * 0.5,
    radius,
  });

  coordinates.x *= compressionFactor;

  return coordinates;
};

/**
 * There are 5 key coordinates while animating cards:
 *
 * - idleCoords: The initial position for the current card
 * - idlePrevCoords & idleNextCoords: The initial position for the previous and next cards. This is the position the
 *   cards will go to when the drag gesture finishes
 * - prevCoords & nextCoords: The mid-points where the cards move while the user is dragging
 */
export const getItemCoordinates = ({
  index,
  totalNumberOfCards,
  radius,
  compressionFactor,
  windowWidth,
}: {
  index: number;
  totalNumberOfCards: number;
  radius: number;
  compressionFactor: number;
  windowWidth: number;
}) => {
  "worklet";

  const idleCoords = getCoordinatesForIndex({
    compressionFactor,
    index,
    radius,
    totalNumberOfCards,
  });

  const idlePrevCoords = getCoordinatesForIndex({
    compressionFactor,
    index: positiveModulus(index + 1, totalNumberOfCards),
    radius,
    totalNumberOfCards,
  });

  const idleNextCoords = getCoordinatesForIndex({
    compressionFactor,
    index: positiveModulus(index - 1, totalNumberOfCards),
    radius,
    totalNumberOfCards,
  });

  const prevCoords =
    index < totalNumberOfCards / 2
      ? { x: -windowWidth * 0.4, y: idleCoords.y }
      : { x: windowWidth * 0.4, y: idleCoords.y };

  const nextCoords =
    index === 0
      ? multiply({ coordinates: prevCoords, factor: { x: -1, y: 1 } })
      : index === totalNumberOfCards / 2 && totalNumberOfCards % 2 === 0
        ? multiply({ coordinates: prevCoords, factor: { x: -1, y: 1 } })
        : prevCoords;

  return { idleCoords, idleNextCoords, idlePrevCoords, nextCoords, prevCoords };
};

export const getZIndexForItem = ({ coords }: { coords: Coordinates }) => {
  "worklet";

  return Math.round(coords.y * 100);
};

export const getRotationForItem = ({
  coords,
  maxWidth,
  maxCardTiltInDegrees,
}: {
  coords: Coordinates;
  maxWidth: number;
  maxCardTiltInDegrees: number;
}) => {
  "worklet";

  return (coords.x / maxWidth) * maxCardTiltInDegrees;
};
