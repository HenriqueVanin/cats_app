import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const commandTopic = {
  laserPosition: "/camLaserPosition",
  laserOnOff: "/onOffLaser",
  ballLaunch: "/launchBall",
  dropSnacks: "/dropSnacks",
  pumpOnOff: "/onOffPump",
  setSchedule: "/setSchedule",
  delSchedule: "/delSchedule",
  soundPlay: "/playSound",
  soundFile: "/fileSound",
  systemOnOff: "/turnOffSystem",
  cameraOnOff: "/onOffCamera",
  streamingOnOff: "/onOffVideoStreaming"
};

export const iconActivity = {
  waterTemperature: <MaterialCommunityIcons name="water-outline" color={'#40e0d0'} size={30} />,
  temperatureAlert: <MaterialCommunityIcons name="water-alert-outline" color={'#ff9302'} size={30} />,
  waterLevelAlert:  <Icon name="water" color="#fff" size={27} />,
  snacksLevelAlert: <MaterialCommunityIcons name="food-apple-outline" color={'#ff8456'} size={30} />,
}

export const alertType = {
  waterTemperature: "info",
  alertTemperature: "info",
  alertWaterLevel: "info",
  alertSnacksLevel: "info",
}

export const alertTopic = {
  waterTemperature: "/waterTemperature",
  alertTemperature: "/temperatureAlert",
  alertWaterLevel: "/waterLevelAlert",
  alertSnacksLevel: "/snacksLevelAlert",
}

export const alertTitle = {
  waterTemperature: "Water temperature has changed to ",
  temperatureAlert: "Water temperature are in a critical level to ",
  waterLevelAlert: "Water level has changed to ",
  snacksLevelAlert: "Snack level has changed to ",
}

export const scheduleId = {
  snackDispenser: "dispenser",
  ballLauncher: "launcher",
};
