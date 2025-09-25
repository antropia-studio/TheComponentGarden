import { Children, type ReactNode, useMemo } from "react";
import { View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import tw from "twrnc";
import { AnimatedItem, type CardsConfiguration } from "./AnimatedItem";
import { Card, type Props as CardProps } from "./Card";
import { useCardDeckGesture } from "./useCardDeckGesture";

type ListenersProps = {
  onCardSelected?: (index: number) => void;
};

type ContentProps =
  | { children: ReactNode }
  | { cards: CardProps[]; children?: never };

type RenderItem = {
  content: ReactNode;
  key: string;
};

export type Props = ContentProps & CardsConfiguration & ListenersProps;

export const CardDeck = (props: Props) => {
  const numberOfItems = useMemo(
    () =>
      "cards" in props ? props.cards.length : Children.count(props.children),
    [props],
  );

  const { pan, selectedCardIndex, dragProgress, isDragging } =
    useCardDeckGesture({
      numberOfItems,
      onCardSelected: props.onCardSelected,
    });

  const itemsToRender = useMemo((): RenderItem[] => {
    if ("cards" in props) {
      return props.cards.map((card) => ({
        content: <Card {...card} />,
        key: card.title,
      }));
    } else {
      return (
        Children.map(props.children, (child, index) => ({
          content: child,
          key: `item-${index}`,
        })) ?? []
      );
    }
  }, [props]);

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <GestureDetector gesture={pan}>
        <View style={tw`flex flex-col flex-1 items-center justify-center`}>
          <View style={tw`relative size-0`}>
            {itemsToRender.map((item, index) => (
              <AnimatedItem
                index={index}
                isDragging={isDragging}
                key={item.key}
                progress={dragProgress}
                selectedCardIndex={selectedCardIndex}
                totalNumberOfCards={numberOfItems}
                {...props}
              >
                {item.content}
              </AnimatedItem>
            ))}
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
