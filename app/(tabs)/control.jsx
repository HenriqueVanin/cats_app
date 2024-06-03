// import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Text, View } from "react-native";
import useMQTT from "../components/MQTT";
import { commandTopic } from "../components/MQTT/commands";
import VideoFrame from "../components/VideoKinesis/video-player";

const Control = () => {
  const { PublishMessage } = useMQTT();
  const publishTopic = (topic, msg) => {
    PublishMessage(topic, msg);
  }
  return (
    <SafeAreaView className="flex-1 items-center bg-[#191C4A]">
      <View className="h-[230px] bg-gray-200 m-6 rounded-lg w-[90%]">
        <VideoFrame />
      </View>
      <View className="flex-1 w-full px-6">
        <CustomButton
          title="LASER ON"
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
            handlePress={() => publishTopic(commandTopic.soundPlay, "someId")}
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
      <View className="p-5">
        {/* <ReactNativeJoystick
          color="#09C3B8"
          radius={75}
          onMove={(data) =>
            publishTopic(
              commandTopic.laserPosition,
              JSON.stringify(data)
            )
          }
        /> */}
      </View>
    </SafeAreaView>
  );
};
export default Control;
