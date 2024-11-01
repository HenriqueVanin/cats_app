import { Button, ScrollView, Text, TouchableHighlight, View } from "react-native";
// import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import WaterStatus from "../components/WaterStatus";
import StatusCard from "../components/StatusCard";
import ActivityCard from "../components/ActivityCard";

// import { icons } from "../../constants";
import { useEffect, useState } from "react";
import ActivityRepository from "../database/ActivityRepository";
import useMQTT from "../components/MQTT";
import { commandTopic } from "../components/MQTT/commands";
import { useAlertStore } from "../components/MQTT/store";
import CustomButton from "../components/CustomButton";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const repository = new ActivityRepository();

const Home = () => {  
  const { PublishMessage } = useMQTT();
  const publishTopic = (topic, msg) => {
    PublishMessage(topic, msg);
  }
  const alertStore = useAlertStore();  
  

  const all = async () => {
    const activities = await repository.all();
      alertStore.setActivities(activities);
  };

  const clearTable = async () => {
    await repository.clear();
    all();
  }

  useEffect(() => {
    all();
  }, []);

  // useEffect(() => {
  //   publishTopic(commandTopic.cameraOnOff, "off");
  //   publishTopic(commandTopic.laserOnOff, "off"); 
  // },[]);

  function recentActivity( a, b ) {
    if ( Number(a.timeStamp) < Number(b.timeStamp) ){
      return 1;
    }
    if (  Number(a.timeStamp) >  Number(b.timeStamp) ){
      return -1;
    }
    return 0;
  }

  // <StatusCard title={"Snacks"} ammount={alertStore?.alertStatus?.snacksLevelAlert} icon={<MaterialCommunityIcons name="food-apple-outline" color={'#fff'} size={25} />} />
  return (
    <SafeAreaView className="flex-1 justify-start bg-[#121434]">
      <View className="flex-row justify-between items-center p-5 pr-2 w-full gap-3">
      <Text className="font-bold text-white text-3xl">C.A.T.S.</Text>
      <TouchableHighlight className="flex-row w-32 rounded-lg justify-center items-center py-1 bg-primary pr-2" onPress={()=>publishTopic(commandTopic.systemOnOff, "system turn on/off")}>
           <View className="flex flex-row gap-1 items-center">
            <MaterialCommunityIcons name="power" color={'#880808'} size={20} />
            <Text className="font-semibold text-white text-lg">Turn Off</Text>
           </View>
        </TouchableHighlight></View>
      <WaterStatus level={alertStore?.alertStatus?.waterLevelAlert} temperature={(alertStore?.alertStatus?.waterTemperature + "ºC")} temperatureAlert={alertStore?.alertStatus?.temperatureAlert} />
      <View className="flex-row w-full justify-between pr-4 pl-2">
        {/* <StatusCard title={"Snacks"} ammount={alertStore?.alertStatus?.snacksLevelAlert} icon={<MaterialCommunityIcons name="food-apple-outline" color={'#fff'} size={25} />} /> */}
      </View>
      <View className="flex flex-row justify-between mr-8">
        <Text className="p-3 pl-4 mt-0 text-2xl font-semibold text-white">
          Recent Activities
        </Text>
        <TouchableHighlight className="m-3 rounded-lg justify-center items-center" handlePress={clearTable}><Text className="text-xl text-white font-semibold ">Clear</Text></TouchableHighlight>
      </View>
      <ScrollView className="flex-1 w-full">
        {alertStore.activities.sort(recentActivity).filter((item) => item.title).map((activity) => (
          <View key={activity.timeStamp}>
            <ActivityCard
              title={activity.title}
              date={String(new Date(Number(activity.timeStamp)))}
              type={activity.type}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
