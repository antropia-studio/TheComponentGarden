import { type ReactNode, useRef } from "react";
import { Dimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import tw from "twrnc";
import { AnimatedCard, type CardsConfiguration } from "./AnimatedCard";
import type { Props as CardProps } from "./Card";

type ListenersProps = {
  onCardSelected?: (index: number) => void;
};

type ContentProps = { children: ReactNode } | { cards: CardProps[] };

export type Props = ContentProps & CardsConfiguration & ListenersProps;

/**
 * CardCarousel is a React functional component that provides a carousel-like interactive
 * experience for navigating between cards. It uses gesture handling and animation to achieve
 * smooth transitions and rotations between items.
 *
 * This component is designed to handle both dynamic card rendering based on a provided
 * list of cards (`props.cards`) or custom child components (`props.children`).
 */
export const CardCarousel = (props: Props) => {
  const { width } = Dimensions.get("window");
  const minTranslationToRotate = 0.5 * width;

  const initialProgress = useRef<number>(0);
  const progress = useSharedValue(0);
  const centrifugalForce = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      progress.value = withSpring(
        initialProgress.current + event.translationX / minTranslationToRotate,
      );

      centrifugalForce.value = withSpring(1, { dampingRatio: 0.5, mass: 20 });
    })
    .onFinalize((event) => {
      const eventProgress = event.translationX / minTranslationToRotate;

      const finalizedProgress =
        eventProgress > 0.5
          ? Math.floor(progress.value) + 1
          : Math.floor(progress.value);

      initialProgress.current = finalizedProgress;
      progress.value = withSpring(finalizedProgress);
      centrifugalForce.value = withSpring(0);

      if (props.onCardSelected) {
        scheduleOnRN(props.onCardSelected, finalizedProgress + 1);
      }
    });

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <GestureDetector gesture={pan}>
        <View style={tw`flex flex-col flex-1 items-center justify-center`}>
          <View style={tw`relative size-0`}>
            {"cards" in props
              ? props.cards.map((card, index) => (
                  <AnimatedCard
                    centrifugalForce={centrifugalForce}
                    index={index}
                    key={card.title}
                    progress={progress}
                    totalNumberOfCards={props.cards.length}
                    {...card}
                    {...props}
                  />
                ))
              : props.children}
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
