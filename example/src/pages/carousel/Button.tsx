import { Pressable, Text } from "react-native";
import tw from "../../theme";

interface Props {
  label: string;
}

export const Button = ({ label }: Props) => {
  return (
    <Pressable style={tw`flex items-center bg-black px-6 py-4 rounded-full`}>
      <Text style={tw`text-white text-base font-medium`}>{label}</Text>
    </Pressable>
  );
};
