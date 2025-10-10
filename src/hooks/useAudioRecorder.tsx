import { useRef } from 'react';
import { Audio } from 'expo-av';

export const useAudioRecorder = () => {

    const recordingRef = useRef<Audio.Recording | null>(null);
    const isBusy = useRef(false);
    const isRecording = useRef(false);
    const isStarting = useRef(false);
    const isStopping = useRef(false);

    const startRecording = async () => {
        if (isStarting.current || isBusy.current) {
            console.log("Recorder busy or starting");
            return null;
        }
        isBusy.current = true;
        isStarting.current = true;
      
        try {
            // если висит старая запись — стопаем и чистим
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) {
                    console.log("Previous recording wasn't active or already stopped");
                }
                recordingRef.current = null;
                isRecording.current = false;
            }
        
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== "granted") {
                console.log("Permission to access microphone is required");
                return null;
            }
        
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
        
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
        
            recordingRef.current = recording;
            isRecording.current = true;
            console.log("Recording started");
            return recording;
        } catch (error) {
          console.error("Failed to start recording", error);
          return null;
        } finally {
          isBusy.current = false;
          isStarting.current = false;
        }
    };
      
    const stopRecording = async () => {
        if (isStarting.current) {
        console.log("Stop requested while starting, ignoring");
        return null;
        }

        if (isBusy.current || isStopping.current || !isRecording.current || !recordingRef.current) {
        console.log("Recorder busy or not recording");
        return null;
        }
        isBusy.current = true;
        isStopping.current = true;

        try {
        const rec = recordingRef.current;
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();

        recordingRef.current = null;
        isRecording.current = false;

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
        });

        console.log("Recording stopped:", uri);
        return uri;
        } catch (error) {
        console.error("Failed to stop recording", error);
        return null;
        } finally {
            isBusy.current = false;
            isStopping.current = false;
        }
    };

    return { startRecording, stopRecording, isRecording };
};
