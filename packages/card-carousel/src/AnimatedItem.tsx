import {
  calculateWeightedMidPoint,
  fromPolarToCartesianCoordinates,
} from "@antropia/the-component-garden-lib";
import { type PropsWithChildren, useMemo } from "react";
import Animated, {
  type SharedValue,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
} from "react-native-reanimated";
import tw from "twrnc";

const Z_INDEX_THRESHOLD = 6;

export type CardsConfiguration = {
  /**
   * Radius (in pixels) of the inner circle that positions cards when idle (i.e., not being dragged or animated).
   *
   * @default 50
   */
  innerCircleRadiusInPx?: number;

  /**
   * Radius (in pixels) of the outer circle used while cards are being dragged/animated.
   *
   * @default 120
   */
  outerCircleRadiusInPx?: number;

  /**
   * Vertical compression of the outer circle to create a pseudo‑3D (volumetric) look. 0 produces a flat horizontal
   * line, 1 produces a perfect circle. Values between 0 and 1 flatten the circle vertically by that factor.
   *
   * @default 0.3
   */
  outerCircleVerticalCompressionFactor?: number;

  /**
   * Maximum per‑card tilt (in degrees) while dragging. 0 keeps cards perfectly upright; higher values increase the tilt
   * as cards move farther from the center.
   *
   * @default 15
   */
  maxCardTiltInDegrees?: number;
};

type AnimationProps = {
  index: number;
  totalNumberOfCards: number;
  progress: SharedValue<number>;
  centrifugalForce: SharedValue<number>;
};

type Props = CardsConfiguration & AnimationProps & PropsWithChildren;

export const AnimatedItem = ({
  centrifugalForce,
  index,
  totalNumberOfCards,
  progress,
  innerCircleRadiusInPx = 50,
  outerCircleRadiusInPx = 120,
  maxCardTiltInDegrees = 15,
  outerCircleVerticalCompressionFactor = 0.3,
  children,
}: Props) => {
  const animatedStyles = useAnimatedStyle(() => {
    const angleIncrement = (2 * Math.PI) / totalNumberOfCards;
    const initialAngleInRadians = angleIncrement * index;
    const angleInRadians =
      initialAngleInRadians - angleIncrement * progress.value;

    const innerCircleCoords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: innerCircleRadiusInPx,
    });

    const outerCircleCoords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: outerCircleRadiusInPx,
    });

    // We flatten the outer circle vertically
    outerCircleCoords.y *= outerCircleVerticalCompressionFactor;

    const coords = calculateWeightedMidPoint({
      point1: innerCircleCoords,
      point2: outerCircleCoords,
      ratio: centrifugalForce.value,
    });

    const baseZ = Math.round(coords.y * 100);
    let zIndex = baseZ;
    if (Math.abs(coords.y) < Z_INDEX_THRESHOLD) {
      zIndex = baseZ + Math.round(-coords.x * 10);
    }

    const rotationDeg =
      (coords.x / outerCircleRadiusInPx) * maxCardTiltInDegrees;

    return {
      elevation: Math.max(0, Math.round(zIndex * 0.01)),
      left: coords.x,
      top: coords.y,
      transform: [
        { translateX: "-50%" },
        { translateY: "-50%" },
        { rotate: `${rotationDeg}deg` },
      ],
      zIndex,
    };
  });

  const enterAnimation = useMemo(
    () => (index % 2 === 0 ? SlideInRight : SlideInLeft),
    [index],
  );

  return (
    <Animated.View
      entering={enterAnimation.springify().mass(20).dampingRatio(0.5)}
      style={[animatedStyles, tw`absolute`]}
    >
      {children}
    </Animated.View>
  );
};
