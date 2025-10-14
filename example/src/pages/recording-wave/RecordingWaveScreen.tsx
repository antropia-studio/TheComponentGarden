import { RecordingWave } from "@antropia/the-component-garden-recording-wave";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import tw from "../../theme";
import { useRecording } from "./useRecording";

export const RecordingWaveScreen = () => {
  const { startRecording, stopRecording, volume } = useRecording();

  return (
    <View
      style={[tw`flex flex-1 flex-col justify-between bg-alucardsNight px-4`]}
    >
      <StatusBar style="light" />

      <RecordingWave
        onRecordStart={startRecording}
        onRecordStop={stopRecording}
        volume={volume}
      />
    </View>
  );
};
