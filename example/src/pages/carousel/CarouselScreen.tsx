import { CardCarousel } from "@antropia/the-component-garden-card-carousel";
import { StatusBar } from "expo-status-bar";
import { ArrowUp } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";
import { Button } from "./Button";
import { CARDS } from "./cards";
import { Header } from "./Header";

export const CarouselScreen = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(1);
  const selectedCard = CARDS[selectedCardIndex % CARDS.length];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={tw`bg-base flex-1`}>
        <StatusBar style="dark" />

        <SafeAreaView style={tw`flex flex-1`}>
          <View style={tw`flex flex-col flex-1 pt-20 px-4 justify-between`}>
            <Header />

            <CardCarousel cards={CARDS} onCardSelected={setSelectedCardIndex} />

            {selectedCard && (
              <Animated.View
                entering={FadeInDown.springify().mass(20).dampingRatio(0.5)}
                exiting={FadeOutDown.springify().mass(20).dampingRatio(0.5)}
                key={selectedCard.title}
                style={[tw`flex flex-col gap-2 items-center`]}
              >
                <ArrowUp color={selectedCard.backgroundColor} />

                <Text
                  style={[
                    tw`text-center text-xl italic mb-8 font-medium`,
                    { color: selectedCard.backgroundColor },
                  ]}
                >
                  {selectedCard.title}
                </Text>
              </Animated.View>
            )}

            <Animated.View
              entering={FadeInDown.delay(1000)
                .springify()
                .mass(20)
                .dampingRatio(0.5)}
            >
              <Button label="Let's get started" />
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
};
