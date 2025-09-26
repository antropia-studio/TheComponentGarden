import {
  calculateWeightedPosition,
  positiveModulus,
} from "@antropia/the-component-garden-lib";
import { type PropsWithChildren, useMemo } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import tw from "twrnc";
import {
  getItemCoordinates,
  getRotationForItem,
  getZIndexForItem,
} from "./geometry";

export type CardsConfiguration = {
  /**
   * Horizontal compression of the circle path all items follow while idle. 0 produces a flat vertical
   * line, 1 produces a perfect circle. Values between 0 and 1 flatten the circle horizontally by that factor.
   *
   * @default 0.75
   */
  horizontalCompressionFactor?: number;

  /**
   * Maximum per‑card tilt (in degrees) while dragging. 0 keeps cards perfectly upright; higher values increase the tilt
   * as cards move farther from the center.
   *
   * @default 10
   */
  maxCardTiltInDegrees?: number;

  /**
   * Radius (in pixels) of the circle that positions cards when idle (i.e., not being dragged or animated).
   *
   * @default 60
   */
  radiusInPx?: number;
};

type AnimationProps = {
  index: number;
  isDragging: SharedValue<boolean>;
  progress: SharedValue<number>;
  selectedCardIndex: number;
  totalNumberOfCards: number;
};

type Props = CardsConfiguration & AnimationProps & PropsWithChildren;

export const AnimatedItem = ({
  children,
  horizontalCompressionFactor = 0.75,
  index,
  isDragging,
  maxCardTiltInDegrees = 10,
  progress,
  radiusInPx = 60,
  selectedCardIndex,
  totalNumberOfCards,
}: Props) => {
  const { width } = useMemo(() => Dimensions.get("window"), []);

  const animatedStyles = useAnimatedStyle(() => {
    const positionIndex = positiveModulus(
      index - selectedCardIndex,
      totalNumberOfCards,
    );

    const {
      idlePrevCoords,
      prevCoords,
      idleNextCoords,
      nextCoords,
      idleCoords,
    } = getItemCoordinates({
      compressionFactor: horizontalCompressionFactor,
      index: positionIndex,
      radius: radiusInPx,
      totalNumberOfCards,
      windowWidth: width,
    });

    /**
     * We normalize the progress that has a value in the range selectedCardIndex +- 1 to a 0 to 1 range. This way
     * we can calculate the current position of the card in the path we have defined for them.
     */
    const normalizedProgress = interpolate(
      progress.value,
      [selectedCardIndex - 1, selectedCardIndex + 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const coords = calculateWeightedPosition({
      points: [
        idlePrevCoords,
        prevCoords,
        idleCoords,
        nextCoords,
        idleNextCoords,
      ],
      ratio: normalizedProgress,
    });

    const zIndex = getZIndexForItem({ coords });

    const rotationDeg = getRotationForItem({
      coords,
      maxCardTiltInDegrees,
      maxWidth: width * 0.2,
    });

    const baseStyle = {
      elevation: Math.max(0, Math.round(zIndex * 0.01)),
      transform: [
        { translateX: "-50%" },
        { translateY: "-50%" },
        { rotate: `${rotationDeg}deg` },
      ],
      zIndex,
    };

    if (isDragging.value) {
      return { ...baseStyle, left: coords.x, top: coords.y };
    } else {
      return {
        ...baseStyle,
        left: withSpring(idleCoords.x, { dampingRatio: 0.65, mass: 20 }),
        top: withSpring(idleCoords.y, { dampingRatio: 0.65, mass: 20 }),
      };
    }
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
