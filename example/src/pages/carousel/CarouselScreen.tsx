import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";
import { Button } from "./Button";
import { Card } from "./Card";

export const CarouselScreen = () => {
  return (
    <View style={tw`bg-base flex-1`}>
      <StatusBar style="dark" />

      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`flex flex-col flex-1 pt-20 px-4 justify-between`}>
          <View style={tw`flex flex-col gap-4 px-8`}>
            <Text style={tw`text-2xl font-bold text-center`}>
              Swap the urge for something that lifts you up
            </Text>

            <Text style={tw`text-base text-center text-base-content/60`}>
              Get simple activities to replace harmful{"\n"}habits with
              healthier dopamine boosts.
            </Text>
          </View>

          <View style={tw`flex flex-row flex-wrap items-center justify-center`}>
            <Card
              activityTimeInMinutes={5}
              coverImageUrl="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkfGVufDB8fDB8fHwy"
              style={tw`bg-[#6DBD8F]`}
              title="Make your bed differently"
            />

            <Card
              activityTimeInMinutes={10}
              coverImageUrl="https://images.unsplash.com/photo-1652662700928-5a4685e87d64?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={tw`bg-[#ED8685]`}
              title="Take a warm shower"
            />

            <Card
              activityTimeInMinutes={5}
              coverImageUrl="https://images.unsplash.com/photo-1546427660-eb346c344ba5?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={tw`bg-[#F6D378]`}
              title="Dance to one song"
            />

            <Card
              activityTimeInMinutes={20}
              coverImageUrl="https://images.unsplash.com/photo-1618840313409-66c0d92d6f26?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={tw`bg-[#719FF7]`}
              title="Make your own soap"
            />
          </View>

          <Button label="Let's get started" />
        </View>
      </SafeAreaView>
    </View>
  );
};
