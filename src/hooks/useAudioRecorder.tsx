import { useState } from 'react';
import { Audio } from 'expo-av';

export const useAudioRecorder = () => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);

    const startRecording = async () => {
        try {
            if (recording) {
                console.warn('Recording already in progress, stopping previous one...');
                await stopRecording();
            }

            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                console.log("Permission to access microphone is required");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    };

    const stopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setRecording(null);
                await resetMicrophone(); // Сбрасываем микрофон после остановки
                console.log('Recording stopped:', uri);
                return uri;
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const resetMicrophone = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });
            console.log('Microphone reset complete');
        } catch (error) {
            console.error('Error resetting microphone', error);
        }
    };

    return {
        startRecording,
        stopRecording,
        resetMicrophone,
    };
};
