import { Text, View } from "react-native";

const StatusCard = ({ title, ammount, icon }) => {
  return (
    <View className="flex-row w-[47%] rounded-lg justify-between items-center p-3 bg-terciary ml-2">
      <View className="flex flex-row items-center">
        {icon}
        <Text className="font-bold text-white ml-2 text-lg">{title}</Text>
      </View>
      <View className="flex flex-row items-center">
        <Text className="font-bold text-secondary mr-2">{ammount}</Text>
      </View>
    </View>
  );
};

export default StatusCard;
