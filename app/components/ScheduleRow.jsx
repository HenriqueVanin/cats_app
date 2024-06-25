import {
  Button,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { commandTopic } from "./MQTT/commands";
// import { Picker } from "@react-native-picker/picker";

const ScheduleRow = ({ title, icon, commandId, publishTopic }) => {
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [scheduleTime, setScheduleTime] = useState([]);
  const [daily, setDaily] = useState(true);
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleDateConfirm = (date) => {
    setSelectedDate(`${date.getDate()<10 ? "0" : ""}${date.getDate()}/${(date.getMonth()+1)<10 ? "0":""}${date.getMonth() + 1}`);
    hideDatePicker();
  };
  const handleTimeConfirm = (time) => {
    setSelectedTime(`${time.getHours() < 10 ? "0" : ""}${time.getHours()}:${time.getMinutes() < 10 ? "0" : ""}${time.getMinutes()}`);
    hideDatePicker();
  };
  const handleAddNewSchedule = () => {
    setScheduleTime([
      ...scheduleTime,
      { id: scheduleTime.length + 1, time: selectedTime, date: selectedDate },
    ]);
    const date = daily ? "" :("#" + selectedDate.split("/")[0] + "#" + selectedDate.split("/")[1]) ;
    publishTopic(
      commandTopic.setSchedule,
      commandId + "#" + selectedTime?.replace(":", "") + date
    );
    setTimePickerVisibility(false);
  };
  const handleDeleteSchedule = (id) => {
    let newArray = scheduleTime.filter((item) => item.id !== id);
    setScheduleTime(newArray);
    publishTopic(
      commandTopic.delSchedule,
      commandId +
        ":" +
        scheduleTime
          .filter((item) => item.id === id)[0]
          .time?.replaceAll(":", "")
    );
  };

  return (
    <ScrollView className="grid mr-2">
      <View className="flex-row justify-between items-center w-full py-4 px-6 pr-24">
        <View className="flex-row justify-start items-center w-full">
          <View className="rounded-lg w-10 h-10 items-center justify-center bg-terciary mr-3">
            {icon}
          </View>
          <Text className="font-bold text-white text-2xl">{title}</Text>
        </View>
        {/* <Switch /> */}
      </View>
      <View className="flex-grid justify-start pl-6 gap-2">
        <View className="w-[90%] rounded-lg flex flex-row">
          <TouchableOpacity
            className="bg-terciary w-[80%] p-4 rounded rounded-md mr-1"
            onPress={()=> showTimePicker()}
          >
            <Text className="text-[16px] text-white">
              {selectedTime ? String(selectedTime) : "SELECT TIME"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            className="bg-terciary w-[50%]  p-4 rounded rounded-md"
            onPress={()=> showDatePicker()}
          >
            <Text className="text-[16px] text-white">
              {selectedDate ? String(selectedDate) : "SELECT DATE"}
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            className={`${daily ? "bg-secondary" : "bg-terciary"} w-[30%] ml-1 p-4 rounded rounded-md`}
            // onPress={()=> setDaily(!daily)}
          >
            <Text className="text-[16px] text-white">
              DAILY
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            className="bg-secondary w-20 p-3 rounded rounded-md justify-center items-center flex-row"
            onPress={handleAddNewSchedule}
          >
            <Text className="text-[16px] font-bold text-white">
              Add
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            mode="time"
            isVisible={isTimePickerVisible}
            onCancel={hideTimePicker}
            onConfirm={handleTimeConfirm}
          />
          {/* <DateTimePickerModal
            mode="date"
            isVisible={true}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          /> */}
        </View>
        <View className="w-[93%] rounded-lg bg-terciary">
          {/* <Picker
            selectedValue={selectedRepeatTime}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedRepeatTime(itemValue)
            }
            style={{ color: "#fff" }}
          >
            <Picker.Item label="2x A DAY" value="java" />
            <Picker.Item label="3x A DAY" value="js" />
          </Picker> */}
          
        </View>
      </View>
      <ScrollView className="grid w-[100%] gap-2 mt-2 ml-4 overflow-auto max-h-[20vh]">
        {scheduleTime?.map((item) => (
          <View
            key={item.id}
            className="p-3 bg-terciary mr-8 rounded-lg flex flex-row items-center justify-between"
          >
            <Text className="text-[14px] text-white">
              {title} - {item?.time} | Day {item?.date}
            </Text>
            <TouchableOpacity
              className="bg-primary p-2 rounded rounded-full w-9 items-center justify-center"
              onPress={() => {
                handleDeleteSchedule(item?.id);
              }}
            >
              <Text className="text-[16px] font-bold text-red-200">-</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};
export default ScheduleRow;
