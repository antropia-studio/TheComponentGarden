import type { CardProps } from "@antropia/the-component-garden-card-deck";
import { ArrowUp } from "lucide-react-native";
import { Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import tw from "../../theme";
import { springify } from "./animation";

interface Props {
  card: CardProps;
}

export const SelectedCard = ({ card }: Props) => {
  return (
    <Animated.View
      entering={springify(FadeInDown)}
      exiting={springify(FadeOutDown)}
      style={[tw`flex flex-col items-center gap-2`]}
    >
      <ArrowUp color={card.backgroundColor} />

      <Text
        style={[
          tw`mb-8 text-center font-medium text-xl italic`,
          { color: card.backgroundColor },
        ]}
      >
        {card.title}
      </Text>
    </Animated.View>
  );
};
