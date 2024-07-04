import { Image, Text, TouchableHighlight, View } from "react-native";
import { icons } from "../../constants";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SoundIcon = () => {
  return (
    <View className="items-center justify-center">
      <Image
        source={icons.play}
        resizeMode="contain"
        tintColor={"#fff"}
        className="w-6 h-6"
      />
    </View>
  );
};

const DeleteIconDisabled = () => {
  return (
    <View className="items-center justify-center">
      <MaterialCommunityIcons name="delete" color={"#23265A"} size={25} />
    </View>
  );
};
const DeleteIcon = () => {
  return (
    <View className="items-center justify-center">
      <MaterialCommunityIcons name="delete" color={"#880808"} size={25} />
    </View>
  );
};

const AudioRow = ({ title, excludable = false, play, deleteAction, id}) => {
  return (
    <View className="flex-row justify-between items-center px-6">
      <View
        className={`flex-row items-center pt-0 w-[72%]
        justify-start border-2 border-[#181B45] rounded-xl px-2 my-1 py-3 mr-3 h-12`}
      >
        <Text className="font-bold text-white ml-3 pr-4">{title}</Text>
      </View>
      <TouchableHighlight className="w-10 h-10 rounded-full items-center flex flex-row justify-center" onPress={play}>
        <SoundIcon />
      </TouchableHighlight>
      {excludable && 
        <TouchableHighlight className="w-10 h-10 rounded-full items-center flex flex-row justify-center" onPress={()=>deleteAction(id)}>
          <DeleteIcon />
        </TouchableHighlight>
      }
      {!excludable && 
        <TouchableHighlight disabled={true} className="w-10 h-10 rounded-full items-center flex flex-row justify-center">
          <DeleteIconDisabled />
        </TouchableHighlight>
      }
    </View>
  );
};
export default AudioRow;
