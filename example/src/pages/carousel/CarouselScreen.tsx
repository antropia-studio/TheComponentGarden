import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCircleCoordinates } from "../../lib/math";
import tw from "../../theme";
import { Button } from "./Button";
import { Card } from "./Card";

const INNER_CIRCLE_RADIUS = 50;

type CardData = { backgroundColor: string } & Pick<
  ComponentProps<typeof Card>,
  "title" | "activityTimeInMinutes" | "coverImageUrl"
>;

const CARDS: CardData[] = [
  {
    activityTimeInMinutes: 5,
    backgroundColor: "#6DBD8F",
    coverImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVkfGVufDB8fDB8fHwy",
    title: "Make your bed differently",
  },
  {
    activityTimeInMinutes: 10,
    backgroundColor: "#ED8685",
    coverImageUrl:
      "https://images.unsplash.com/photo-1652662700928-5a4685e87d64?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Take a warm shower",
  },
  {
    activityTimeInMinutes: 5,
    backgroundColor: "#F6D378",
    coverImageUrl:
      "https://images.unsplash.com/photo-1546427660-eb346c344ba5?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Dance to one song",
  },
  {
    activityTimeInMinutes: 20,
    backgroundColor: "#719FF7",
    coverImageUrl:
      "https://images.unsplash.com/photo-1618840313409-66c0d92d6f26?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Make your own soap",
  },
];

export const CarouselScreen = () => {
  return (
    <View style={tw`bg-base flex-1`}>
      <StatusBar style="dark" />

      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`flex flex-col flex-1 pt-20 px-4 justify-between`}>
          <Animated.View
            entering={FadeInUp.delay(750)
              .springify()
              .mass(20)
              .dampingRatio(0.5)}
            style={tw`flex flex-col gap-4 px-8`}
          >
            <Text style={tw`text-2xl font-bold text-center`}>
              Swap the urge for something that lifts you up
            </Text>

            <Text style={tw`text-base text-center text-base-content/60`}>
              Get simple activities to replace harmful{"\n"}habits with
              healthier dopamine boosts.
            </Text>
          </Animated.View>

          <View style={tw`flex flex-col items-center justify-center`}>
            <View style={tw`relative size-0`}>
              {CARDS.map(({ backgroundColor, ...props }, index) => {
                const coords = getCircleCoordinates({
                  index,
                  radius: INNER_CIRCLE_RADIUS,
                  sections: CARDS.length,
                });

                const enterAnimation =
                  index % 2 === 0 ? SlideInRight : SlideInLeft;

                return (
                  <Animated.View
                    entering={enterAnimation
                      .springify()
                      .mass(20)
                      .dampingRatio(0.5)}
                    key={props.title}
                  >
                    <Card
                      style={[
                        tw.style(`absolute`),
                        { backgroundColor },
                        {
                          left: coords.x,
                          top: -coords.y,
                          transform: [
                            { translateX: "-50%" },
                            { translateY: "-50%" },
                            { rotate: `${coords.x * 0.1}deg` },
                          ],
                        },
                      ]}
                      {...props}
                    />
                  </Animated.View>
                );
              })}
            </View>
          </View>

          <Button label="Let's get started" />
        </View>
      </SafeAreaView>
    </View>
  );
};
