import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";

const WelcomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView>
      <View style={tw`flex flex-col gap-10 items-center px-8 py-10`}>
        <View style={tw`flex flex-col gap-6`}>
          <View style={tw`flex flex-col self-center`}>
            <Text style={tw`text-3xl font-bold`}>The Component Garden</Text>
            <Text style={tw`self-end text-xl font-light`}>by Antropia</Text>
          </View>

          <Text style={tw`text-lg`}>
            Welcome to <Text style={tw`font-bold`}>The Component Garden</Text>,
            a curated collection of React Native components designed primarily
            for <Text style={tw`font-bold`}>learning and exploration</Text>.
            While you're free to integrate these components into your own
            projects, their true value lies in helping you understand React
            Native development patterns. {"\n\n"}
            Happy exploring!
          </Text>
        </View>

        <Pressable
          style={tw`bg-primary px-6 py-4 rounded-xl`}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={tw`text-primary-content font-medium`}>Open library</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
