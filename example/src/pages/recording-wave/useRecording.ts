import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const VOLUME_CAPTURE_INTERVAL = 50;

const ease = (x: number) => {
  "worklet";

  return x * x * x * x * x;
};

export const useRecording = () => {
  const audioRecorder = useAudioRecorder({
    // biome-ignore lint/style/noNonNullAssertion: The TS types are strange here, HIGH_QUALITY always exist
    ...RecordingPresets.HIGH_QUALITY!,
    isMeteringEnabled: true,
  });
  /**
   * We could use audioRecorder.isRecording but it's not a React state and so it's not straighforward to
   * react to changes on its value
   */
  const [isRecording, setIsRecording] = useState(false);
  const volume = useSharedValue<number>(0);

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setIsRecording(false);
    volume.value = withSpring(0, { dampingRatio: 0.5, mass: 20 });
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(async () => {
      if (!isRecording) {
        clearInterval(interval);
        return;
      }

      try {
        const status = audioRecorder.getStatus();
        const currentMetering = status.metering ?? -160;
        /**
         * Metering values go from -160 (for silence) to 0 for loudest sounds
         * so we normalize the value to be on a [0,1] range
         */
        const meteringFactor = (160 + currentMetering) / 160;
        volume.value = withSpring(
          ease(
            interpolate(meteringFactor, [0, 1], [0.25, 1], Extrapolation.CLAMP),
          ),
          { duration: 50 },
        );
      } catch {
        clearInterval(interval);
      }
    }, VOLUME_CAPTURE_INTERVAL);

    return () => clearInterval(interval);
  }, [isRecording, volume, audioRecorder.getStatus]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    volume,
  };
};
