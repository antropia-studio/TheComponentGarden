import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";

const WelcomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View style={tw`bg-neutral flex-1`}>
      <SafeAreaView style={tw`flex flex-1`}>
        <View
          style={tw`flex flex-col flex-1 gap-10 items-center justify-between px-8 py-2`}
        >
          <View style={tw`flex flex-col gap-12`}>
            <View style={tw`flex flex-col`}>
              <Text style={tw`text-6xl font-black text-secondary`}>
                The Component Garden
              </Text>

              <Text style={tw`text-2xl font-light text-neutral-content`}>
                by <Text style={tw`font-black`}>Antropia</Text>
              </Text>
            </View>

            <Text style={tw`text-xl text-neutral-content font-light`}>
              Welcome to{" "}
              <Text style={tw`font-bold text-secondary`}>
                The Component Garden
              </Text>
              , a curated collection of React Native components designed
              primarily for{" "}
              <Text style={tw`font-bold`}>learning and exploration</Text>. While
              you're free to integrate these components into your own projects,
              their true value lies in helping you understand React Native
              development patterns. {"\n\n"}
              Happy exploring!
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.openDrawer()}
            style={tw`bg-secondary px-6 py-4 rounded-xl`}
          >
            <Text style={tw`text-secondary-content font-medium`}>
              Open library
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
