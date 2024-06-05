import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Text, View } from "react-native";
import useMQTT from "../components/MQTT";
import { commandTopic } from "../components/MQTT/commands";
import { useCallback, useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { AUDIO_DIR } from "../components/MQTT/settings";
// import VideoFrame from "../components/VideoKinesis/video-player";
// import ViewerComponent from "../components/VideoKinesis/ViewerComponent";

const throttle = (func, delay) => {
  let throttling = false;
  
  return (...args) => {
    if (!throttling) {
      throttling = true;
      func(...args);
      setTimeout(() => {
        throttling = false;
      }, delay);
    }
  };
};

const Control = () => {
  const { PublishMessage } = useMQTT();
  const publishTopic = (topic, msg) => {
    PublishMessage(topic, msg);
  }

  const [audioOptions, setAudioOptions] = useState([]);

  const handlePress = useCallback(
    throttle((pos, data) => {
      publishTopic(
        pos,
        data
      )
    }, 1000),
    []
  );

  const getAllFilePathsFromFolder = async () => {
    const list = await FileSystem.readDirectoryAsync(AUDIO_DIR);
    setAudioOptions(list);
  };

  const pickerRef = useRef();


  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  useEffect(() => {getAllFilePathsFromFolder()}, []);

  
  return (
    <SafeAreaView className="flex-1 items-center bg-[#191C4A]">
      <View className="h-[230px] bg-gray-200 m-6 rounded-lg w-[90%]">
        {/* <ViewerComponent /> */}
      </View>
      <View className="flex-1 w-full px-6">
        <CustomButton
          title="LASER ON/OFF"
          isLoading={false}
          containerStyles={"w-full bg-terciary h-12"}
          handlePress={() => publishTopic(
            commandTopic.laserOnOff,
            "switch laser"
          )}
        />
        <View className="flex-row justify-between mt-3">
          <CustomButton
            title="PLAY SOUND"
            isLoading={false}
            containerStyles={"w-[30%] bg-terciary h-12"}
            textStyles={"text-[12px]"}
            handlePress={() => open()}
          />
          <CustomButton
            title="THROW BALL"
            isLoading={false}
            containerStyles={"w-[30%] bg-terciary h-12"}
            textStyles={"text-[12px]"}
            handlePress={() => publishTopic(
              commandTopic.ballLaunch,
              "request a ball"
            )}
          />
          <CustomButton
            title="SERVE SNACK"
            isLoading={false}
            containerStyles={"w-[30%] bg-terciary h-12"}
            textStyles={"text-[12px]"}
            handlePress={() => publishTopic(
              commandTopic.dropSnacks,
              "request to drop some snacks"
            )}
          />
        </View>
      </View>
      <View className="mb-10">
        <ReactNativeJoystick
          color="#09C3B8"
          radius={120}
          onMove={(data) =>
            handlePress(
              commandTopic.laserPosition,
              JSON.stringify(data)
            )
          }
        />
      </View>
      <View className="h-0">
      <Picker
        ref={pickerRef}
        style={{ width: "0%", height: 0}}
        onValueChange={(itemValue) => 
          PublishMessage(commandTopic.soundPlay, itemValue)}
      >
        <Picker.Item key={'p1'} label="Predefined Audio 1" value="sound_1"/>
        <Picker.Item key={'p2'} label="Predefined Audio 2" value="sound_2" />
        <Picker.Item key={'p3'} label="Predefined Audio 3" value="sound_3" />
        <Picker.Item key={'p4'} label="Predefined Audio 4" value="sound_4" />
        <Picker.Item key={'p5'} label="Predefined Audio 5" value="sound_5" />
        {audioOptions?.map((sound, index) => <Picker.Item key={index} label={`Custom Audio ${index}`} value={sound} />)}
      </Picker>
      </View>
    </SafeAreaView>
  );
};
export default Control;
