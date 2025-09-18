import { type ReactNode, useRef } from "react";
import { Dimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue, withSpring } from "react-native-reanimated";
import tw from "twrnc";
import { AnimatedCard } from "./AnimatedCard";
import type { Props as CardProps } from "./Card";

const CENTRIFUGAL_FORCE_INCREASE = 1;

type ContentProps = { children: ReactNode } | { cards: CardProps[] };

export type Props = ContentProps;

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
      centrifugalForce.value = withSpring(
        centrifugalForce.value + CENTRIFUGAL_FORCE_INCREASE,
      );
    })
    .onFinalize((event) => {
      const eventProgress = event.translationX / minTranslationToRotate;

      if (eventProgress > 0.5) {
        initialProgress.current = Math.floor(progress.value) + 1;
        progress.value = withSpring(Math.floor(progress.value) + 1);
      } else {
        initialProgress.current = Math.floor(progress.value);
        progress.value = withSpring(Math.floor(progress.value));
      }

      centrifugalForce.value = withSpring(0);
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
                  />
                ))
              : props.children}
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
