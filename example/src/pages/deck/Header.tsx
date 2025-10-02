import { Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import tw from "../../theme";
import { springify } from "./animation";

export const Header = () => {
  return (
    <Animated.View
      entering={springify(FadeInUp).delay(750)}
      style={tw`flex flex-col gap-4 px-8`}
    >
      <Text style={tw`text-center font-bold text-2xl`}>
        Swap the urge for something that lifts you up
      </Text>

      <Text style={tw`text-center text-base text-base-content/60`}>
        Get simple activities to replace harmful{"\n"}habits with healthier
        dopamine boosts.
      </Text>
    </Animated.View>
  );
};
