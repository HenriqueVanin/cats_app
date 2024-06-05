import { Image, ImageBackground, Text, View } from "react-native";
import { images } from "../../constants";
import { TouchableHighlight } from "react-native-gesture-handler";

const WaterStatus = ({ level, temperature }) => {
  return (
    <View className="bg-emerald-300 mb-4">
      <ImageBackground
        source={images.waterbg}
        resizeMode="cover"
        className="w-full h-[200px]"
      >
        <View className="flex-1 justify-center items-center gap-2">
          <Text className="font-bold text-white text-3xl">{temperature}</Text>
          <Text className="font-bold text-white">Water level is</Text>
          <Text className="font-bold text-white text-4xl">{level}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};
export default WaterStatus;
