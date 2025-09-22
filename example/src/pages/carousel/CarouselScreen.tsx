import { CardCarousel } from "@antropia/the-component-garden-card-carousel";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../theme";
import { Button } from "./Button";
import { CARDS } from "./cards";
import { Header } from "./Header";
import { SelectedCard } from "./SelectedCard";

export const CarouselScreen = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(1);
  const selectedCard = CARDS[selectedCardIndex];
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        tw`bg-base flex flex-col flex-1 justify-between px-4`,
        { paddingBottom: 20 + bottom, paddingTop: 40 + top },
      ]}
    >
      <StatusBar style="dark" />

      <Header />
      <CardCarousel cards={CARDS} onCardSelected={setSelectedCardIndex} />
      {selectedCard && <SelectedCard card={selectedCard} />}
      <Button label="Let's get started" />
    </View>
  );
};
