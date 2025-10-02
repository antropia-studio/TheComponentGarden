import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { type ParamListBase, useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";

const WelcomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View style={tw`flex-1 bg-neutral`}>
      <SafeAreaView style={tw`flex flex-1`}>
        <View
          style={tw`flex flex-1 flex-col items-center justify-between gap-10 px-8 py-2`}
        >
          <View style={tw`flex flex-col gap-12`}>
            <View style={tw`flex flex-col`}>
              <Text style={tw`font-black text-6xl text-secondary`}>
                The Component Garden
              </Text>

              <Text style={tw`font-light text-2xl text-neutral-content`}>
                by <Text style={tw`font-black`}>Antropia</Text>
              </Text>
            </View>

            <Text style={tw`font-light text-neutral-content text-xl`}>
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
            style={tw`rounded-xl bg-secondary px-6 py-4`}
          >
            <Text style={tw`font-medium text-secondary-content`}>
              Open library
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
