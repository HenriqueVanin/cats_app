import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleRow from "../components/ScheduleRow";
import { commandTopic, scheduleId } from "../components/MQTT/commands";
import useMQTT from "../components/MQTT";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from "react";

const Schedule = () => {
  const { PublishMessage } = useMQTT();
  const publishTopic = (topic, msg) => {
    PublishMessage(topic, msg);
  }
  
  // useEffect(() => {
  //   publishTopic(commandTopic.cameraOnOff, "off");
  //   publishTopic(commandTopic.laserOnOff, "off"); 
  // },[]);

  return (
    <SafeAreaView className="flex-1 bg-[#191C4A]">
      <View className="flex-row items-start  p-8 pb-2">
        <Text className="text-white text-2xl">Schedule Configuration</Text>
      </View>
      <View className="items-center">
        <ScheduleRow
          title={"Ball Launcher"}
          icon={<MaterialCommunityIcons name="tennis-ball" color={'#fff'} size={25} />}
          commandId={scheduleId.ballLauncher}
          publishTopic={publishTopic}
        />
      </View>
      <View className="items-center">
        <ScheduleRow
          title={"Snack Dispenser"}
          icon={<MaterialCommunityIcons name="food-apple-outline" color={'#fff'} size={25} />}
          commandId={scheduleId.snackDispenser}
          publishTopic={publishTopic}
        />
      </View>
      {/* <View className="items-center">
        <ScheduleRow title={"Sound Player"} icon={icons.play} />
      </View> */}
    </SafeAreaView>
  );
};
export default Schedule;
