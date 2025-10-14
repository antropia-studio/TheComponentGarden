import {
  Group,
  LinearGradient,
  Path,
  Skia,
  type SkPath,
  vec,
} from "@shopify/react-native-skia";
import { interpolate } from "flubber";
import { useWindowDimensions } from "react-native";
import { useDerivedValue, withSpring } from "react-native-reanimated";

interface Props {
  isRecording: boolean;
}

// biome-ignore-start lint/style/noNonNullAssertion: No need to validate as paths are known
const Flubber2SkiaInterpolator = (from: SkPath, to: SkPath) => {
  const interpolator = interpolate(from.toSVGString(), to.toSVGString(), {
    maxSegmentLength: 1,
  });
  const d = 1e-3;
  const i0 = Skia.Path.MakeFromSVGString(interpolator(d))!;
  const i1 = Skia.Path.MakeFromSVGString(interpolator(1 - d))!;
  return (t: number) => {
    "worklet";
    if (t < d) {
      return from;
    }
    if (1 - t < d) {
      return to;
    }
    return i1.interpolate(i0, t)!;
  };
};

const RECORD_PATH = Skia.Path.MakeFromSVGString(
  "M85 50C85 69.33 69.33 85 50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15C69.33 15 85 30.67 85 50Z",
)!;

const RECORD_BACK_PATH = Skia.Path.MakeFromSVGString(
  "M98 50C98 76.5097 76.5097 98 50 98C23.4903 98 2 76.5097 2 50C2 23.4903 23.4903 2 50 2C76.5097 2 98 23.4903 98 50Z",
)!;

const STOP_PATH = Skia.Path.MakeFromSVGString(
  "M30 33.3333C30 31.4924 31.4924 30 33.3333 30H66.6667C68.5076 30 70 31.4924 70 33.3333V66.6667C70 68.5076 68.5076 70 66.6667 70H33.3333C31.4924 70 30 68.5076 30 66.6667V33.3333Z",
)!;
// biome-ignore-end lint/style/noNonNullAssertion: No need to validate as paths are known

const pathInterpolator = Flubber2SkiaInterpolator(RECORD_PATH, STOP_PATH);

const ICON_SIZE = 100;

export const StartStopButton = ({ isRecording }: Props) => {
  const { width } = useWindowDimensions();
  const transition = useDerivedValue(
    () =>
      isRecording
        ? withSpring(1, { dampingRatio: 0.65, mass: 20 })
        : withSpring(0, { dampingRatio: 0.65, mass: 20 }),
    [isRecording],
  );

  const path = useDerivedValue(
    () => pathInterpolator(transition.value),
    [transition],
  );

  const recordBackPathTransform = useDerivedValue(
    () => [{ scale: 1 - transition.value }],
    [transition],
  );

  return (
    <Group
      transform={[
        { translateX: width / 2 - ICON_SIZE / 2 },
        { translateY: width / 2 - ICON_SIZE / 2 },
      ]}
    >
      <Path
        opacity={0.6}
        origin={{ x: ICON_SIZE / 2, y: ICON_SIZE / 2 }}
        path={RECORD_BACK_PATH}
        style="fill"
        transform={recordBackPathTransform}
      >
        <LinearGradient
          colors={["#E83B68", "#AD2A73"]}
          end={vec(ICON_SIZE, ICON_SIZE)}
          start={vec(0, 0)}
        />
      </Path>

      <Path path={path} style="fill">
        <LinearGradient
          colors={["#E83B68", "#AD2A73"]}
          end={vec(ICON_SIZE, ICON_SIZE)}
          start={vec(0, 0)}
        />
      </Path>
    </Group>
  );
};
