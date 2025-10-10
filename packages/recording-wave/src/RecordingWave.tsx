import {
  type Coordinates,
  fromPolarToCartesianCoordinates,
  normalizeVector,
  repeat,
  vectorFromCoordinates,
  zip,
} from "@antropia/the-component-garden-lib";
import {
  BackdropBlur,
  Canvas,
  Fill,
  interpolateColors,
  Path,
  Skia,
  usePathInterpolation,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { createNoise3D } from "simplex-noise";
import tw from "twrnc";

const TAU = Math.PI * 2;
const NUMBER_OF_WAVES = 100;
const SEGMENTS = 80;
const SMOOTHNESS = 1;
const WAVE_FACTOR = 5;
const NOISE_SCALE = 1.5;

const noise = createNoise3D();

const getPath = ({
  radius,
  loudness,
  seed,
  center,
}: {
  radius: number;
  loudness: number;
  center: Coordinates;
  seed: number;
}) => {
  const points: Coordinates[] = [];
  let hasFinished = false;
  let angleInRadians = 0;

  while (!hasFinished) {
    const noiseCoords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: NOISE_SCALE,
    });

    const randomFactor =
      (0.1 + loudness) * (1 + noise(noiseCoords.x, noiseCoords.y, seed * 0.01));
    const sinFactor =
      loudness * (1 + Math.sin(WAVE_FACTOR * TAU * (angleInRadians / TAU)));

    const coords = fromPolarToCartesianCoordinates({
      angleInRadians,
      radius: radius * 0.8 - (sinFactor + 30 * randomFactor),
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

  // biome-ignore lint/style/noNonNullAssertion: This will not fail
  return Skia.Path.MakeFromSVGString(path)!;
};

export const CircularWave = ({
  index,
  radius,
  center,
  totalNumberOfWaves,
}: {
  center: Coordinates;
  radius: number;
  index: number;
  totalNumberOfWaves: number;
}) => {
  const opacity = useMemo(
    () => 0.5 * (index / totalNumberOfWaves),
    [index, totalNumberOfWaves],
  );
  const loudness = useSharedValue(0);

  const color = useMemo(
    () =>
      interpolateColors(
        0.5 * (index / totalNumberOfWaves),
        [0, 1],
        ["#8866FF", "#FFFFFF"],
      ),
    [index, totalNumberOfWaves],
  );

  const startPath = getPath({ center, loudness: 0, radius, seed: index });
  const path01 = getPath({ center, loudness: 0.3, radius, seed: index + 1000 });
  const path02 = getPath({ center, loudness: 0.6, radius, seed: index + 1001 });
  const path03 = getPath({ center, loudness: 0.8, radius, seed: index + 1002 });
  const endPath = getPath({ center, loudness: 1, radius, seed: index });
  const path = usePathInterpolation(
    loudness,
    [0, 0.3, 0.6, 0.8, 1],
    [startPath, path01, path02, path03, endPath],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to include shared values
  useEffect(() => {
    loudness.value = withRepeat(
      withSequence(
        withSpring(0.8 * Math.random() + 0.2 * (index / totalNumberOfWaves), {
          dampingRatio: 0.5,
          mass: 20,
        }),
        withSpring(0, { dampingRatio: 0.5, mass: 20 }),
      ),
      -1,
    );
  }, [index, totalNumberOfWaves]);

  return (
    <Path
      color={color}
      opacity={opacity}
      path={path}
      strokeWidth={1}
      style="stroke"
    />
  );
};

export const RecordingWave = () => {
  const rotation = useSharedValue(0);
  const size = 300;

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need to include shared values
  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(withTiming(1, { duration: 10000, easing: Easing.linear })),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${rotation.value * 360}deg` }] };
  });

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Animated.View style={[{ height: size, width: size }, animatedStyle]}>
        <Canvas style={[{ flex: 1 }]}>
          {repeat(NUMBER_OF_WAVES, (i) => i).map((i) => (
            <CircularWave
              center={{ x: size * 0.5, y: size * 0.5 }}
              index={i}
              key={`wave_${i}`}
              radius={size * 0.4}
              totalNumberOfWaves={NUMBER_OF_WAVES}
            />
          ))}
          <BackdropBlur
            blur={2}
            clip={{ height: size, width: size, x: 0, y: 0 }}
          >
            <Fill color="#FFFFFF00" />
          </BackdropBlur>
        </Canvas>
      </Animated.View>
    </View>
  );
};
