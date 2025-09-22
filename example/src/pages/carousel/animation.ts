import type { ComplexAnimationBuilder } from "react-native-reanimated";

export const springify = (builder: typeof ComplexAnimationBuilder) =>
  builder.springify().mass(20).dampingRatio(0.5);
