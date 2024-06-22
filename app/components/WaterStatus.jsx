import { Image, ImageBackground, Text, View } from "react-native";
import { images } from "../../constants";
import { TouchableHighlight } from "react-native-gesture-handler";

const WaterStatus = ({ level, temperature, temperatureAlert }) => {
  const formatStatus = (s) => {
    return s?.toLocaleUpperCase()?.replaceAll("/","")?.replaceAll("\\","");;
  }
  return (
    <View className="bg-emerald-300 mb-4">
      <ImageBackground
        source={images.waterbg}
        resizeMode="cover"
        className="w-full h-[200px]"
      >
        <View className="flex-1 justify-center items-center gap-2">
          <Text className={`font-bold text-white text-3xl ${temperatureAlert === 'critical' && 'text-red-400'}`}>{temperatureAlert  === 'critical' ? "! " + formatStatus(temperature) : formatStatus(temperature)}</Text>
          <Text className="font-bold text-white text-[24px]">Water level is</Text>
          <Text className="font-bold text-white text-4xl">{formatStatus(level)}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};
export default WaterStatus;
