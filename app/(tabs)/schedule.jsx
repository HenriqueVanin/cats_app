import { Text, TouchableHighlight, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-[#121434]">
      <View className="flex-row justify-between items-center p-5 pr-5 w-full">
            <Text className="font-bold text-white text-3xl">C.A.T.S.</Text>
            <TouchableHighlight className="flex-row w-32 rounded-lg justify-center items-center py-1 bg-primary pr-2" onPress={()=>publishTopic(commandTopic.systemOnOff, "system turn on/off")}>
           <View className="flex flex-row gap-1 items-center">
            <MaterialCommunityIcons name="power" color={'#880808'} size={20} />
            <Text className="font-semibold text-white text-lg">Turn Off</Text>
           </View>
        </TouchableHighlight>
           </View>
      <View className="flex-row items-start  p-8 pt-0 pb-2">
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
