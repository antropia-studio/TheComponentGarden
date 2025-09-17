import { StatusBar } from "expo-status-bar";
import { useRef } from "react";
import { Dimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../theme";
import { AnimatedCard } from "./AnimatedCard";
import { Button } from "./Button";
import { CARDS } from "./cards";
import { Header } from "./Header";

const CENTRIFUGAL_FORCE_INCREASE = 1;

export const CarouselScreen = () => {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={tw`bg-base flex-1`}>
        <StatusBar style="dark" />

        <SafeAreaView style={tw`flex flex-1`}>
          <View style={tw`flex flex-col flex-1 pt-20 px-4 justify-between`}>
            <Header />

            <GestureDetector gesture={pan}>
              <View
                style={tw`flex flex-col flex-1 items-center justify-center`}
              >
                <View style={tw`relative size-0`}>
                  {CARDS.map((props, index) => (
                    <AnimatedCard
                      centrifugalForce={centrifugalForce}
                      index={index}
                      key={props.title}
                      progress={progress}
                      totalNumberOfCards={CARDS.length}
                      {...props}
                    />
                  ))}
                </View>
              </View>
            </GestureDetector>

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
