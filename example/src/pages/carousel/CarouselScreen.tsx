import { CardCarousel } from "@antropia/the-component-garden-card-carousel";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";
import { Button } from "./Button";
import { CARDS } from "./cards";
import { Header } from "./Header";
import { SelectedCard } from "./SelectedCard";

export const CarouselScreen = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(1);
  const selectedCard = CARDS[selectedCardIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={tw`bg-base flex-1`}>
        <StatusBar style="dark" />

        <SafeAreaView style={tw`flex flex-1`}>
          <View style={tw`flex flex-col flex-1 pt-20 px-4 justify-between`}>
            <Header />
            <CardCarousel cards={CARDS} onCardSelected={setSelectedCardIndex} />
            {selectedCard && <SelectedCard card={selectedCard} />}
            <Button label="Let's get started" />
          </View>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
};
