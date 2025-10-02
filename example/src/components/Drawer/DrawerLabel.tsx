import { Text } from "react-native";
import tw from "../../theme";

interface Props {
  label: string;
  focused: boolean;
}

export const DrawerLabel = ({ label, focused }: Props) => (
  <Text
    style={tw.style(
      `font-bold text-3xl`,
      focused ? "text-tertiary" : "text-primary-content",
    )}
  >
    {label}
  </Text>
);
