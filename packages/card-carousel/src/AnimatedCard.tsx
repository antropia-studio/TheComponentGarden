import {
  calculateWeightedMidPoint,
  fromPolarToCartesianCoordinates,
} from "@antropia/the-component-garden-lib";
import { useMemo } from "react";
import Animated, {
  type SharedValue,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Card, type Props as CardProps } from "./Card";

const INNER_CIRCLE_RADIUS = 50;
const OUTER_CIRCLE_RADIUS = 120;
const Z_INDEX_THRESHOLD = 6;
const MAX_ROTATION_IN_DEGREES = 15;

type Props = CardProps & {
  index: number;
  totalNumberOfCards: number;
  progress: SharedValue<number>;
  centrifugalForce: SharedValue<number>;
};

export const AnimatedCard = ({
  centrifugalForce,
  index,
  totalNumberOfCards,
  progress,
  ...props
}: Props) => {
  const animatedStyles = useAnimatedStyle(() => {
    const angleIncrement = (2 * Math.PI) / totalNumberOfCards;
    const initialAngleInRadians = angleIncrement * index;
    const angleInRadians =
      initialAngleInRadians - angleIncrement * progress.value;

    const innerCircleCoords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: INNER_CIRCLE_RADIUS,
    });

    const outerCircleCoords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: OUTER_CIRCLE_RADIUS,
    });

    // We flatten the outer circle vertically
    outerCircleCoords.y *= 0.3;

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
      (coords.x / OUTER_CIRCLE_RADIUS) * MAX_ROTATION_IN_DEGREES;

    return {
      elevation: Math.max(0, Math.round(zIndex * 0.01)),
      left: coords.x,
      position: "absolute",
      top: coords.y,
      transform: [{ rotate: `${rotationDeg}deg` }],
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
      key={props.title}
      style={animatedStyles}
    >
      <Card
        style={[
          { transform: [{ translateX: "-50%" }, { translateY: "-50%" }] },
        ]}
        {...props}
      />
    </Animated.View>
  );
};
