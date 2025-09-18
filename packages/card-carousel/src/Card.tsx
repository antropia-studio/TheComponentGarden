import { Clock } from "lucide-react-native";
import { Image, Text, View, type ViewProps } from "react-native";
import tw from "twrnc";

export interface Props extends ViewProps {
  backgroundColor: string;
  title: string;
  activityTimeInMinutes: number;
  coverImageUrl: string;
}

export const Card = ({
  backgroundColor,
  title,
  activityTimeInMinutes,
  coverImageUrl,
  style,
  ...props
}: Props) => {
  return (
    <View
      style={[tw`flex flex-col rounded-lg w-40`, { backgroundColor }, style]}
      {...props}
    >
      <View style={tw`flex flex-col px-2 pt-2`}>
        <Text style={tw`font-bold text-lg leading-none`}>{title}</Text>

        <View style={tw`flex flex-row items-center gap-1`}>
          <Clock size={10} />
          <Text style={tw`text-xs`}>{activityTimeInMinutes} min</Text>
        </View>
      </View>

      <Image
        source={{ uri: coverImageUrl }}
        style={tw`aspect-square rounded-md p-1`}
      />
    </View>
  );
};
