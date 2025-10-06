import { RecordingWave } from "@antropia/the-component-garden-recording-wave";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import tw from "../../theme";

export const RecordingWaveScreen = () => {
  return (
    <View
      style={[tw`flex flex-1 flex-col justify-between bg-alucardsNight px-4`]}
    >
      <StatusBar style="light" />

      <RecordingWave />
    </View>
  );
};
