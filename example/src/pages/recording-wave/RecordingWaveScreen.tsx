import { RecordingWave } from "@antropia/the-component-garden-recording-wave";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import tw from "../../theme";
import { useRecording } from "./useRecording";

export const RecordingWaveScreen = () => {
  const { startRecording, stopRecording, isRecording, volume } = useRecording();

  return (
    <View
      style={[tw`flex flex-1 flex-col justify-between bg-alucardsNight px-4`]}
    >
      <StatusBar style="light" />

      <RecordingWave volume={volume} />

      <Pressable
        onPress={() => (isRecording ? stopRecording() : startRecording())}
        style={tw`mb-10 items-center rounded-xl bg-secondary px-4 py-4`}
      >
        <Text style={tw`font-bold text-white`}>Start recording</Text>
      </Pressable>
    </View>
  );
};
