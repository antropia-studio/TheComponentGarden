import { CardDeck } from "@antropia/the-component-garden-card-carousel";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "../../theme";
import { Button } from "./Button";
import { CARDS } from "./cards";
import { Header } from "./Header";
import { SelectedCard } from "./SelectedCard";
import { SelectedEmoji } from "./SelectedEmoji";

type Mode = "card" | "emoji";

const EMOJIS = ["🐶", "🐨", "🐷", "🐱"];

export const DeckScreen = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const selectedCard = CARDS[selectedCardIndex];
  const selectedEmoji = EMOJIS[selectedCardIndex];
  const [mode, setMode] = useState<Mode>("card");
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
      {mode === "card" ? (
        <CardDeck cards={CARDS} onCardSelected={setSelectedCardIndex} />
      ) : (
        <CardDeck onCardSelected={setSelectedCardIndex} radiusInPx={120}>
          {EMOJIS.map((emoji) => (
            <Text key={emoji} style={[tw`p-2`, { fontSize: 120 }]}>
              {emoji}
            </Text>
          ))}
        </CardDeck>
      )}
      {mode === "card" && selectedCard && <SelectedCard card={selectedCard} />}
      {mode === "emoji" && selectedEmoji && (
        <SelectedEmoji emoji={selectedEmoji} />
      )}
      <Button
        label="Let's get started"
        onPress={() => setMode((mode) => (mode === "card" ? "emoji" : "card"))}
      />
    </View>
  );
};
