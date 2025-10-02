import { Pressable, type PressableProps, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import tw from "../../theme";
import { springify } from "./animation";

interface Props {
  onPress: PressableProps["onPress"];
  label: string;
}

export const Button = ({ label, onPress }: Props) => {
  return (
    <Animated.View entering={springify(FadeInDown).delay(1000)}>
      <Pressable
        onPress={onPress}
        style={tw`flex items-center bg-black px-6 py-4 rounded-full`}
      >
        <Text style={tw`text-white text-base font-medium`}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};
