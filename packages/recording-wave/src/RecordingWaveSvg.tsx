import {
  type Coordinates,
  fromPolarToCartesianCoordinates,
  normalizeVector,
  repeat,
  vectorFromCoordinates,
  zip,
} from "@antropia/the-component-garden-lib";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { createNoise2D } from "simplex-noise";
import tw from "twrnc";

const TAU = Math.PI * 2;
const SEGMENTS = 100;
const SMOOTHNESS = 1;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const noise = createNoise2D();

const getPath = ({
  radius,
  loudness,
  seed,
}: {
  radius: number;
  loudness: number;
  seed: number;
}) => {
  const center = { x: radius, y: radius };

  const points: Coordinates[] = [];
  let hasFinished = false;
  let angleInRadians = 0;

  while (!hasFinished) {
    const randomFactor = noise(angleInRadians, seed);
    const sinFactor =
      loudness * 10 * Math.sin(10 * TAU * (angleInRadians / TAU));

    const coords = fromPolarToCartesianCoordinates({
      angleInRadians: angleInRadians,
      radius: radius * 0.9 + sinFactor + 0.5 * randomFactor,
    });

    points.push({ x: coords.x + center.x, y: coords.y + center.y });

    angleInRadians += TAU / SEGMENTS;
    hasFinished = angleInRadians >= TAU;
  }

  /** biome-ignore-start lint/style/noNonNullAssertion: We ignore array-access null checks because we made sure the array is not empty */

  const firstPoint = points[0]!;

  const nextPoints = [...points];
  nextPoints.push(nextPoints.shift()!);

  /**
   * We build an array with all points and their next points because it's easier to handle the path
   * generation algorithm if we tackle them in pairs.
   * That means for array [a, b, c] we will create the following array: [[a, b], [b, c], [c, a]]
   * Finally, to simplify index accesses, we introduce copies of the first and last tuple in the array so
   * that we can safely get the previous and next pairs. The resulting array is [[c, a], [a, b], [b, c], [c, a], [a, b]]
   */
  const pairsOfPoints = zip(points, nextPoints);
  const firstPair = pairsOfPoints[0]!;
  const lastPair = pairsOfPoints[pairsOfPoints.length - 1]!;
  pairsOfPoints.unshift(lastPair);
  pairsOfPoints.push(firstPair);

  let path = `M ${firstPoint.x} ${firstPoint.y}`;
  pairsOfPoints.forEach(({ first, second }, index) => {
    if (index === 0) return;
    if (index === pairsOfPoints.length - 1) return;

    const prevPair = pairsOfPoints[index - 1]!;
    const nextPair = pairsOfPoints[index + 1]!;

    const prevVector = normalizeVector(
      vectorFromCoordinates({
        coords1: prevPair.first,
        coords2: prevPair.second,
      }),
    );

    const nextVector = normalizeVector(
      vectorFromCoordinates({
        coords1: nextPair.second,
        coords2: nextPair.first,
      }),
    );

    const controlPoint1 = {
      x: first.x + prevVector.x * SMOOTHNESS,
      y: first.y + prevVector.y * SMOOTHNESS,
    };

    const controlPoint2 = {
      x: second.x + nextVector.x * SMOOTHNESS,
      y: second.y + nextVector.y * SMOOTHNESS,
    };

    path = `${path} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${second.x} ${second.y}`;
  });

  /** biome-ignore-end lint/style/noNonNullAssertion: We ignore array-access null checks because we made sure the array is not empty */

  return path;
};

const radius = 150;

export const CircularWave = ({ index }: { index: number }) => {
  const loudness = useRef(new Animated.Value(0)).current;

  const startPath = getPath({ loudness: 0, radius, seed: index });
  const endPath = getPath({ loudness: 1, radius, seed: index });

  const d = loudness.interpolate({
    inputRange: [0, 1],
    outputRange: [startPath, endPath],
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to include refs
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(loudness, {
          friction: 2,
          tension: 1,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(loudness, {
          friction: 2,
          tension: 1,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return <AnimatedPath d={d} fill="transparent" opacity={0.1} stroke="white" />;
};

export const RecordingWaveSvg = () => {
  const progress = useRef(new Animated.Value(0)).current;

  const spin = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to add animated values to them
  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        duration: 10000,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={tw`h-full items-center justify-center`}>
      <AnimatedSvg
        height={2 * radius}
        style={{ transform: [{ rotate: spin }] }}
        width={2 * radius}
      >
        {repeat(20).map((_, i) => (
          <CircularWave
            index={i}
            key={`wave_${
              // biome-ignore lint/suspicious/noArrayIndexKey: there is no other way to identify this node
              i
            }`}
          />
        ))}
      </AnimatedSvg>
    </View>
  );
};
