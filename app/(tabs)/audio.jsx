import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioRow from "../components/AudioRow";
import CustomButton from "../components/CustomButton";
import { Audio as AudioDevice } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import useMQTT from "../components/MQTT";
import { commandTopic } from "../components/MQTT/commands";

const Audio = () => {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const { PublishMessage } = useMQTT();
  const publishTopic = (topic, msg) => {
    PublishMessage(topic, msg);
  }
  const timer = ms => new Promise(res => setTimeout(res, ms));
  const [timeLeft, setTimeLeft] = useState(null);
  const AUDIO_DIR = FileSystem.cacheDirectory + "/Audio/"
  useEffect(() => {
      if(timeLeft===0){
        setTimeLeft(null)
        if(recording)  handleRecordButtonPress();
      }

      // exit early when we reach 0
      if (!timeLeft) return;

      // save intervalId to clear the interval when the
      // component re-renders
      const intervalId = setInterval(() => {

        setTimeLeft(timeLeft - 1);
      }, 1000);

      // clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
      // add timeLeft as a dependency to re-rerun the effect
      // when we update it
    }, [timeLeft]);
  const [permissionResponse, requestPermission] = AudioDevice.usePermissions();

  useEffect(() => {
    // Simply get recording permission upon first render
    async function getPermission() {
      await AudioDevice.requestPermissionsAsync()
        .then((permission) => {
          console.log("Permission Granted: " + permission.granted);
          setAudioPermission(permission.granted);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // Call function to get permission
    getPermission();
    // Cleanup upon first render
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, [recording]);

  useEffect(() => {
    publishTopic(commandTopic.cameraOnOff, "off");
    publishTopic(commandTopic.laserOnOff, "off"); 
  },[]);

  useEffect(() => {
    getAllFilePathsFromFolder();
  },[recording]);
  
  
  useEffect(() => {
    getAllFilePathsFromFolder();
  },[]);

  async function playAudio(file, especificUri) {
    const playbackObject = new AudioDevice.Sound();
    await playbackObject.loadAsync({
      uri: (especificUri ? especificUri : AUDIO_DIR + file),
    });
    await playbackObject.playAsync();
  }
  
  async function startRecording() {
    setTimeLeft(30);
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await AudioDevice.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await AudioDevice.Recording.createAsync(AudioDevice.RecordingOptionsPresets.HIGH_QUALITY);
      
      setRecording(recording);
      setRecordingStatus('recording');
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    setRecordingStatus(undefined);
    await recording.stopAndUnloadAsync();
    await AudioDevice.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const audioUri = recording.getURI();
    console.log(audioUri);
    try {
      const audioBytes = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const partSize = Math.ceil(audioBytes.length / 3);
      const audioParts = [
        audioBytes.slice(0, partSize),
        audioBytes.slice(partSize, partSize * 2),
        audioBytes.slice(partSize * 2),
      ];
      for (let i = 0; i < audioParts.length; i++) {
        const soundJson = JSON.stringify({
          id : audioFiles.length + 5,
          name : audioUri,
          filePart : i,
          content : audioParts[i]
        });
        console.log(soundJson);
        publishTopic(commandTopic.soundFile, soundJson);
        await timer(500);
      }
      getAllFilePathsFromFolder();
    } catch (err) {
      console.warn(err);
    }
  }

  const getAllFilePathsFromFolder = async () => {
    const path = AUDIO_DIR;
    const list = await FileSystem.readDirectoryAsync(path);
    setAudioFiles(list);
  };
 
  async function handleRecordButtonPress() {
    if (recording) {
      await stopRecording(recording);
    } else {
      await startRecording();
    }
  }

  async function handleDeleteAudio(file) {
    FileSystem.deleteAsync(AUDIO_DIR + file);
    getAllFilePathsFromFolder();
  }

  
  async function playLocalSound1() {
    const { sound } = await AudioDevice.Sound.createAsync(
      require('../../assets/audios/sound_1.mp3')
    );
    await sound.playAsync();
  }

  async function playLocalSound2() {
    const { sound } = await AudioDevice.Sound.createAsync(
      require('../../assets/audios/sound_2.mp3')
    );
    await sound.playAsync();
  }

  async function playLocalSound3() {
    const { sound } = await AudioDevice.Sound.createAsync(
      require('../../assets/audios/sound_3.mp3')
    );
    await sound.playAsync();
  }

  async function playLocalSound4() {
    const { sound } = await AudioDevice.Sound.createAsync(
      require('../../assets/audios/sound_4.mp3')
    );
    await sound.playAsync();
  }

  async function playLocalSound5() {
    const { sound } = await AudioDevice.Sound.createAsync(
      require('../../assets/audios/sound_5.mp3')
    );
    await sound.playAsync();
  }


  return (
    <SafeAreaView className="flex-1 bg-[#191C4A]">
      <View className="flex-row justify-start p-8">
        <Text className="text-2xl text-white">Audio</Text>
      </View>
      <AudioRow title={"Predefined Sound 1"} play={() => playLocalSound1()}/>
      <AudioRow title={"Predefined Sound 2"} play={() => playLocalSound2()}/>
      <AudioRow title={"Predefined Sound 3"} play={() => playLocalSound3()}/>
      <AudioRow title={"Predefined Sound 4"} play={() => playLocalSound4()}/>
      <AudioRow title={"Predefined Sound 5"} play={() => playLocalSound5()}/>
      {audioFiles?.map((audio, index) => 
        <AudioRow key={index} title={`Custom Audio ${index + 1}`} excludable={true} play={() => playAudio(audio)} deleteAction={handleDeleteAudio} id={audio}/>
      )}
      <View className="flex-row p-6">
        <CustomButton
          handlePress={handleRecordButtonPress}
          title={`${
            recordingStatus === "recording" ? `Recording... ${timeLeft &&  timeLeft > 0 && timeLeft} left` : "Record"
          }`}
          containerStyles={`flex justify-center w-full bg-terciary p-3 ${recordingStatus === "recording" && 'bg-red-400'}`}
        />
      </View>
    </SafeAreaView>
  );
};
export default Audio;
