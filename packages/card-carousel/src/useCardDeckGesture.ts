import { positiveModulus } from "@antropia/the-component-garden-lib";
import { useState } from "react";
import { Dimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

interface Props {
  onCardSelected: ((index: number) => void) | undefined;
  numberOfItems: number;
}

/**
 * The pan gesture handler for the card deck. It calculates the dragging progress and dragging states to be used by each
 * item and animate them accordingly.
 */
export const useCardDeckGesture = ({
  onCardSelected,
  numberOfItems,
}: Props) => {
  const { width } = Dimensions.get("window");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const dragProgress = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onChange((event) => {
      const newProgress = interpolate(
        event.translationX,
        [-width, width],
        [-0.5, 0.5],
        Extrapolation.CLAMP,
      );

      dragProgress.value = withSpring(selectedCardIndex + newProgress);
    })
    .onFinalize((event) => {
      const newProgress = interpolate(
        event.translationX,
        [-width, width],
        [-0.5, 0.5],
        Extrapolation.CLAMP,
      );

      const finalizedProgress =
        newProgress <= -0.2
          ? selectedCardIndex - 1
          : newProgress >= 0.2
            ? selectedCardIndex + 1
            : selectedCardIndex;

      dragProgress.value = withSpring(finalizedProgress);
      scheduleOnRN(setSelectedCardIndex, finalizedProgress);
      isDragging.value = false;

      if (onCardSelected) {
        scheduleOnRN(
          onCardSelected,
          positiveModulus(finalizedProgress, numberOfItems),
        );
      }
    });

  return { dragProgress, isDragging, pan, selectedCardIndex };
};
