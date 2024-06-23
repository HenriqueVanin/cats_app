import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-xl min-h-[30px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
        />
      ):  <Text className={`text-white font-semibold text-lg ${textStyles}`}>
      {title}
    </Text>}
    </TouchableOpacity>
  );
};

export default CustomButton;
