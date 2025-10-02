import { ArrowUp } from "lucide-react-native";
import { useMemo } from "react";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import tw from "../../theme";
import { springify } from "./animation";

interface Props {
  emoji: string;
}

const EMOJI_NAMES: Record<string, string> = {
  "🐨": "koala",
  "🐱": "cat",
  "🐶": "dog",
  "🐷": "pig",
};

const EMOJI_COLORS: Record<string, string> = {
  "🐨": "#A18C85",
  "🐱": "#E0AA07",
  "🐶": "#A86509",
  "🐷": "#DFA594",
};

export const SelectedEmoji = ({ emoji }: Props) => {
  const name = useMemo(() => EMOJI_NAMES[emoji] ?? "unknown", [emoji]);
  const color = useMemo(() => EMOJI_COLORS[emoji] ?? "#000000", [emoji]);

  return (
    <Animated.View
      entering={springify(FadeInDown)}
      exiting={springify(FadeOutDown)}
      style={[tw`flex flex-col gap-2 items-center`]}
    >
      <ArrowUp color={color} />

      <Text
        style={[tw`text-center text-xl italic mb-8 font-medium`, { color }]}
      >
        You picked a beautiful {name}
      </Text>
    </Animated.View>
  );
};
